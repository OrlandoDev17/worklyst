import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { ChatbotAgent } from "../ai/ChatbotAgent";

export function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <ChatbotAgent />
      <Footer />
    </>
  );
}
