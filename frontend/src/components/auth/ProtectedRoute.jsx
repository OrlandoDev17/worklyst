import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { user } = useAuth();

  const token = localStorage.getItem("tokenAcceso");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
