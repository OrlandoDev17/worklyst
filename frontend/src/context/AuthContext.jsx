/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";

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
  const [user, setUser] = useState(null);

  const { addToast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL;

  const register = async (userData) => {
    setLoading(true);
    try {
      await axios.post(API_URL + "/api/auth/register", userData);
      setUser(userData);
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
      setUser(res.data.usuario);
      localStorage.setItem("tokenAcceso", res.data.tokenAcceso);
      localStorage.setItem("tokenActualizacion", res.data.tokenActualizacion);
      setSuccess(true);
      addToast(`Bienvenido de nuevo, ${res.data.usuario.nombre}`, "success");
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
      await axios.post(API_URL + "/api/auth/logout", {
        tokenActualizacion: localStorage.getItem("tokenActualizacion"),
      });
      localStorage.removeItem("tokenAcceso");
      localStorage.removeItem("tokenActualizacion");
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
