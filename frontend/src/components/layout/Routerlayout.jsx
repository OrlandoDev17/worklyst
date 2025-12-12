"use client";

import { AuthProvider } from "@/context/AuthContext";
import Header from "./Header";

export default function Routerlayout({ children }) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
