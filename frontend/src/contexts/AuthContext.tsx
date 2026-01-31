import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import type { User } from "@/lib/types";
import { useToast } from "./ToastContext";
import { useRouter } from "next/navigation";

interface AuthContextType {
  register: (formData: User) => Promise<void>;
  login: (formData: User) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  mounted: boolean;
  states: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      const storedToken = localStorage.getItem("tokenAcceso");
      return storedUser && storedToken ? JSON.parse(storedUser) : null;
    } catch (err: any) {
      console.error("Error rehydrating auth state:", err);
      return null;
    }
  });
  const [states, setStates] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const { addToast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      const storedToken = localStorage.getItem("tokenAcceso");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error al recuperar la sesión:", err);
    } finally {
      setMounted(true);
    }
  }, []);

  const register = async (formData: User) => {
    setStates({
      loading: true,
      error: null,
      success: false,
    });
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        formData,
      );
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data.usuario,
      }));
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      setStates({
        loading: false,
        error: null,
        success: true,
      });
      addToast("Cuenta creada exitosamente. ¡Bienvenido!", "success");
      router.push("/login");
    } catch (error: any) {
      const msg =
        error.response.data.message || "Error al registrar el usuario";
      setStates({
        loading: false,
        error: msg,
        success: false,
      });
    } finally {
      setStates({
        loading: false,
        error: null,
        success: false,
      });
    }
  };

  const login = async (formData: User) => {
    setStates({
      loading: true,
      error: null,
      success: false,
    });
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data.usuario,
      }));
      const { tokenAcceso, tokenActualizacion, usuario } = response.data;
      localStorage.setItem("tokenAcceso", tokenAcceso);
      localStorage.setItem("tokenActualizacion", tokenActualizacion);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setStates({
        loading: false,
        error: null,
        success: true,
      });
      addToast(`Bienvenido de nuevo, ${usuario.nombre}`, "success");
      router.push("/projects");
    } catch (error: any) {
      const msg = error.response.data.message || "Error al iniciar sesión";
      setStates({
        loading: false,
        error: msg,
        success: false,
      });
    } finally {
      setStates({
        loading: false,
        error: null,
        success: false,
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {
        tokenActualizacion: localStorage.getItem("tokenActualizacion"),
      });
      localStorage.removeItem("tokenAcceso");
      localStorage.removeItem("tokenActualizacion");
      localStorage.removeItem("usuario");
      setUser(null);
      setStates({
        loading: false,
        error: null,
        success: true,
      });
      addToast("Sesión cerrada correctamente", "info");
      router.push("/login");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error al cerrar sesión";
      setStates({
        loading: false,
        error: msg,
        success: false,
      });
    } finally {
      setStates({
        loading: false,
        error: null,
        success: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        user,
        mounted,
        states,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
