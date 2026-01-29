/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";
import api from "../lib/api";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      const storedToken = localStorage.getItem("tokenAcceso");
      return storedUser && storedToken ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Error rehydrating auth state:", err);
      return null;
    }
  });

  const { addToast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL;

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post(API_URL + "/api/auth/register", userData);
      setUser((prevState) => ({ ...prevState, ...res.data.usuario }));
      setSuccess(true);
      addToast("Cuenta creada exitosamente. ¡Bienvenido!", "success");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al registrarse";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post(API_URL + "/api/auth/login", userData);
      const { tokenAcceso, tokenActualizacion, usuario } = res.data;

      setUser(usuario);
      localStorage.setItem("tokenAcceso", tokenAcceso);
      localStorage.setItem("tokenActualizacion", tokenActualizacion);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      setSuccess(true);
      addToast(`Bienvenido de nuevo, ${usuario.nombre}`, "success");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al iniciar sesión";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/api/auth/logout", {
        tokenActualizacion: localStorage.getItem("tokenActualizacion"),
      });
      localStorage.removeItem("tokenAcceso");
      localStorage.removeItem("tokenActualizacion");
      localStorage.removeItem("usuario");
      setUser(null);
      setSuccess(true);
      addToast("Sesión cerrada correctamente", "info");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al cerrar sesión";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ register, login, logout, success, error, loading, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
