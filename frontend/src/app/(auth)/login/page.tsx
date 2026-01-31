"use client";

// Constants
import { LOGIN_FORM } from "@/lib/constants";
// Components
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormInput } from "@/components/auth/FormInput";
// Hooks
import { useState, useRef } from "react";
import Link from "next/link";
// Animaciones
import { animations } from "@/lib/animations";
import { useAnimations } from "@/hooks/useAnimations";
// Contextos
import { useAuth } from "@/contexts/AuthContext";
// Tipos
import { User } from "@/lib/types";

export default function LoginPage() {
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  });

  const containerRef = useRef<HTMLElement>(null);
  const { animate } = useAnimations(containerRef);
  const { login, states } = useAuth();
  const { loading } = states;

  animate(() => {
    animations.fadeUp(".login", {
      ease: "back.out(1.8)",
    });
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <main
      ref={containerRef}
      className="flex flex-col items-center justify-center h-screen"
    >
      <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-lg max-w-md w-full login">
        <header className="flex flex-col items-center gap-2">
          <img className="w-20" src="/worklyst.svg" alt="Logo de Worklyst" />
          <h1 className="text-3xl font-extrabold tracking-wide">Worklyst</h1>
        </header>

        <section
          className="flex flex-col gap-4"
          aria-label="Formulario de inicio de sesión"
        >
          <AuthHeader
            title="Bienvenido de nuevo"
            description="Ingresa tus credenciales para acceder a tus proyectos"
          />
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {LOGIN_FORM.map((item) => (
              <FormInput
                key={item.name}
                {...item}
                onChange={(e) =>
                  setFormData({ ...formData, [item.name]: e.target.value })
                }
              />
            ))}

            <button
              type="submit"
              className="py-2.5 bg-blue-400 text-white rounded-lg text-lg hover:bg-blue-500 hover:scale-105 active:scale-90 transition-all cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          <span className="text-center mt-2 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Registrate aquí
            </Link>
          </span>
        </section>
      </div>
    </main>
  );
}
