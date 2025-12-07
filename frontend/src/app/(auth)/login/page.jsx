"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import { LOGIN_FIELDS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { FadeUp } from "@/lib/animations";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { error, loading, success, login, user } = useAuth();

  useEffect(() => {
    FadeUp();
  }, []);

  useEffect(() => {
    if (success) {
      router.push("/");
    }
  }, [success]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    login(formData);
  };

  return (
    <main className="bg-background h-screen flex flex-col items-center justify-center">
      <article
        className="bg-white p-6 rounded-xl max-w-md mx-auto w-full flex flex-col 
      items-center justify-center gap-4 shadow-xl shadow-blue-200 fade-up"
      >
        <AuthHeader title="Inicia Sesión con tu cuenta" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 items-center">
            <h2 className="text-2xl font-semibold">Bienvenido de vuelta</h2>
            <p className="text-gray-600 text-sm">
              Ingresa tus credenciales para acceder a tus proyectos
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-4 w-full"
          >
            {LOGIN_FIELDS.map(({ name, type, placeholder, label }) => (
              <label key={name} className="flex flex-col gap-1">
                <span>{label}</span>
                <input
                  className="border border-gray-400 px-4 py-2.5 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [name]: e.target.value,
                    })
                  }
                />
              </label>
            ))}
            {error && <p className="text-red-500">{error.mensaje}</p>}
            {success ? (
              <p className="text-green-500">Iniciaste sesión correctamente</p>
            ) : (
              ""
            )}
            <button
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-400 text-white font-medium rounded-xl
            hover:bg-blue-500 hover:-translate-y-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
            <span>{user?.nombre}</span>
          </form>
          <span className="text-center mt-2 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <a
              className="text-blue-400 font-semibold hover:underline hover:text-blue-500 transition-all cursor-pointer"
              href="/register"
            >
              Registrate aqui
            </a>
          </span>
        </div>
      </article>
    </main>
  );
}
