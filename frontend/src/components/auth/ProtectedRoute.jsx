import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { user, tokens } = useAuth();

  if (!user || !tokens.tokenAcceso) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
