import { useEffect } from "react";
import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";
import { useAuth } from "../../context/AuthContext";

export function ChatAI() {
  const { user } = useAuth();
  useEffect(() => {
    // Si no hay usuario, no inicializar
    if (!user?.id) return;

    try {
      const chat = createChat({
        webhookUrl:
          "https://n8n-production-fc0c.up.railway.app/webhook/89906e2e-fdd2-4773-84cb-0268443009bb/chat",
        webhookConfig: {
          method: "POST",
        },
        metadata: {
          userId: user.id, // ID desde tu AuthContext
        },
        mode: "embedded",
        showWelcomeScreen: true,
        title: "Worklyst AI",
      });

      return () => {
        if (chat && typeof chat.close === "function") chat.close();
        const element = document.querySelector("#n8n-chat");
        if (element) element.remove();
      };
    } catch (error) {
      console.error("Error al cargar el chat de n8n:", error);
    }
  }, [user?.id]);

  return null;
}
