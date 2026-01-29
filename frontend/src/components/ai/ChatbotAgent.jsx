import { MessageCircleMore, CircleX, Minimize2, Send } from "lucide-react";
import { useState } from "react";
import { Message } from "../ai/Message";

export function ChatbotAgent() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatOpen = () => {
    setIsChatOpen(!isChatOpen);
  };

  const dateNow = new Date();
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "p.m" : "a.m";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
  };
  const displayDate = `Hoy, ${formatTime(dateNow)}`;

  return (
    // Boton flotante para abrir o cerrar el chat
    <div className="fixed bottom-8 right-8 ">
      <button
        className={`relative rounded-full p-3.5 hover:scale-105 transition-all duration-300 cursor-pointer group ${
          isChatOpen
            ? "bg-zinc-600 hover:bg-zinc-500"
            : "bg-blue-500 hover:bg-blue-400 hover:rotate-12"
        } shadow-lg shadow-blue-500/20`}
        onClick={handleChatOpen}
      >
        <div className="relative size-8">
          <CircleX
            className={`absolute inset-0 size-8 text-white transition-all duration-400 transform ${
              isChatOpen
                ? "scale-100 opacity-100 rotate-0"
                : "scale-0 opacity-0 -rotate-90"
            }`}
          />
          <MessageCircleMore
            className={`absolute inset-0 size-8 text-white transition-all duration-400 transform ${
              isChatOpen
                ? "scale-0 opacity-0 rotate-90"
                : "scale-100 opacity-100 rotate-0"
            }`}
          />
        </div>
        <span
          className={`absolute -inset-1 rounded-full border opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none ${
            isChatOpen ? "border-zinc-500/30" : "border-blue-500/30"
          }`}
        ></span>
      </button>
      {/* ChatBot */}
      {isChatOpen && (
        <article className="flex flex-col gap-4 border border-gray-200 absolute bottom-20 right-0 w-md h-[600px] bg-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300">
          <header className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center text-lg font-medium text-white bg-blue-400 rounded-lg size-10">
                  WL
                </span>
                <h3 className="font-medium text-gray-500">
                  Asistente Worklyst
                </h3>
              </div>
              <button onClick={handleChatOpen}>
                <Minimize2 className="text-gray-500 hover:text-gray-800 hover:scale-110 transition-all duration-300 cursor-pointer" />
              </button>
            </div>
          </header>
          <div className="border-b border-gray-200 pb-4 overflow-y-auto h-full max-h-[500px]">
            <span className="flex items-center justify-center">
              <span className="border border-gray-300 px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-400 font-medium tracking-wider">
                {displayDate}
              </span>
            </span>
            <div className="flex flex-col gap-4 px-4 pt-4">
              <Message
                message="Hola soy Worklyst, ¿en qué puedo ayudarte?"
                user="agent"
              />
            </div>
          </div>
          <footer className="flex flex-col gap-2 px-4 pb-4">
            <form className="relative">
              <input
                className="flex items-center gap-2 bg-zinc-200 border border-gray-300 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Escribe tu mensaje"
              />
              <button className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center p-2 bg-white rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer">
                <Send className="size-5 " />
              </button>
            </form>
            <span className="text-xs text-center text-gray-500">
              IA puede cometer errores verifica la informacion
            </span>
          </footer>
        </article>
      )}
    </div>
  );
}
