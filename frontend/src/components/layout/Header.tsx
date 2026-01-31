"use client";

import { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";
import { NAVBAR_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { MemberAvatar } from "@/components/common/MemberAvatar";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, mounted } = useAuth();

  const [showAuthButtons, setShowAuthButtons] = useState<boolean>(false);

  useEffect(() => {
    if (mounted && user) {
      setShowAuthButtons(true);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="relative flex items-center justify-between px-6 lg:px-16 py-4 bg-white shadow-sm z-50 h-20">
      <picture className="flex-1">
        <img
          className="w-32 lg:w-48"
          src="/worklyst-logo.svg"
          alt="Worklyst Logo"
        />
      </picture>

      <nav className="hidden xl:flex items-center justify-center gap-8">
        {NAVBAR_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            className="text-xl text-gray-700 hover:text-blue-600 hover:scale-105 transition font-medium"
            href={href}
          >
            {label}
          </Link>
        ))}
      </nav>

      <aside
        className={`hidden xl:flex items-center gap-4 flex-1 justify-end transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {mounted && (
          <>
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Crear Cuenta
                </Link>
              </>
            ) : (
              <button onClick={handleLogout}>
                <MemberAvatar
                  name={user?.nombre || ""}
                  size="lg"
                  color="blue"
                />
              </button>
            )}
          </>
        )}
      </aside>

      <button
        className="xl:hidden p-2 text-gray-600 hover:text-blue-600 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        NavbarItems={NAVBAR_ITEMS}
        showAuthButtons={showAuthButtons}
      />
    </header>
  );
}
