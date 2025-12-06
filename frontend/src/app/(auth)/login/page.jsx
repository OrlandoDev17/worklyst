"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import { LOGIN_FIELDS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { FadeUp } from "@/lib/animations";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [logged, setLogged] = useState(false);

  const router = useRouter();

  useEffect(() => {
    FadeUp();
  }, []);

  useEffect(() => {
    if (logged) {
      router.push("/");
    }
  }, [logged]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:30200/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      setLogged(true);
    } catch (error) {
      console.log(error);
    }
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
            <button
              className="w-full mt-2 py-3 bg-blue-400 text-white font-medium rounded-xl
            hover:bg-blue-500 hover:-translate-y-1 transition-all cursor-pointer"
            >
              Iniciar Sesión
            </button>
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
