import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const login = async (formData) => {
    setError(null);
    setLoading(false);
    setSuccess(false);
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      setUser(data.usuario);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setError(null);
    setLoading(false);
    setSuccess(false);
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      setUser(data.usuario);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ error, loading, success, user, login, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
