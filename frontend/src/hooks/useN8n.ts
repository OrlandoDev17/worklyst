import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";

export const useN8n = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hola soy Worklyst, ¿en qué puedo ayudarte?",
      user: "agent",
    },
  ]);

  const callN8nAgent = useCallback(
    async (query: string) => {
      try {
        // El cuerpo del POST (lo que n8n recibirá en el nodo Webhook)
        const payload = {
          message: query,
          history: messages.slice(-5), // Contexto de la conversación
          userId: user?.id,
          userName: user?.nombre || user?.usuario, // Útil para que la IA te salude
        };

        const response = await axios.post(
          // "https://n8n-production-fc0c.up.railway.app/webhook-test/worklyst-chat",
          "https://n8n-production-fc0c.up.railway.app/webhook/worklyst-chat",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
              "x-api-key": process.env.NEXT_PUBLIC_AI_API_KEY,
            },
          },
        );

        // Importante: n8n suele devolver la respuesta en data.output o data.text
        // Ajusta esto según cómo configures el nodo de respuesta en n8n
        const data = response.data;
        console.log("Respuesta de n8n:", data);
        if (data.refresh) {
          // Disparamos un evento global sencillo
          window.dispatchEvent(new Event("refresh_worklyst_data"));
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text:
              data.output || data.response || "No se pudo obtener respuesta.",
            user: "agent",
          },
        ]);
        return data;
      } catch (error) {
        console.error("Error callN8n:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "Lo siento, tuve problemas para conectarme con mis herramientas.",
            user: "agent",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, user],
  );

  return { callN8nAgent, messages, isLoading, setMessages, setIsLoading };
};
