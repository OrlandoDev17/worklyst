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
          userName: user?.nombre || user?.usuario || "Usuario", // Útil para que la IA te salude
        };

        const n8nUrl = process.env.NEXT_PUBLIC_N8N_URL || "";

        const response = await axios.post(n8nUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sessionToken") || ""}`,
            "x-api-key": process.env.NEXT_PUBLIC_AI_API_KEY || "",
          },
        });

        // Importante: n8n suele devolver la respuesta en data.output o data.text
        // Ajusta esto según cómo configures el nodo de respuesta en n8n
        const data = response.data;
        console.log("Respuesta de n8n:", data);

        // Disparamos un evento global para que la UI se refresque (proyectos, tareas, etc)
        window.dispatchEvent(new Event("refresh_worklyst_data"));

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
