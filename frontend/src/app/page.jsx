"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <nav>
          <a href="projects">Proyectos</a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {user ? (
          <div>Bienvenido {user?.nombre}</div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-3xl font-semibold mb-4">Bienvenido</h2>
            <div className="flex gap-4">
              <Link href="/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200">
                  Iniciar Sesión
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200">
                  Registrar
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
