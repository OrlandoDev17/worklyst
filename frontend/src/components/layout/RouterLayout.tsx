"use client";
// Providers
import { AuthProvider } from "@/contexts/AuthContext";
// Hooks
import { usePathname } from "next/navigation";
// Componentes
import { Header } from "./Header";
import { Footer } from "./Footer";
// Providers
import { ToastProvider } from "@/contexts/ToastContext";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { UsersProvider } from "@/contexts/UsersContext";
import { TasksProvider } from "@/contexts/TasksContext";
// Components
import { ChatbotAgent } from "@/components/chatbot/ChatbotAgent";

export default function RouterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showLayout = pathname !== "/login" && pathname !== "/register";

  return (
    <ToastProvider>
      <AuthProvider>
        <UsersProvider>
          <ProjectsProvider>
            <TasksProvider>
              <div className="min-h-screen flex flex-col">
                {showLayout && <Header />}
                <div className="flex-1">{children}</div>
                <ChatbotAgent />
                {showLayout && <Footer />}
              </div>
            </TasksProvider>
          </ProjectsProvider>
        </UsersProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
