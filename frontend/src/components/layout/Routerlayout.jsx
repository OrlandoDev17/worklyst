"use client";

import { AuthProvider } from "@/context/AuthContext";

export default function Routerlayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
