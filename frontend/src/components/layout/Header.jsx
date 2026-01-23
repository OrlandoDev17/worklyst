// Hooks
import { useState } from "react";
import { Link, useNavigate } from "react-router";

// Contexto
import { useAuth } from "../../context/AuthContext";

// Componentes
import { MobileMenu } from "./MobileMenu";
import { NavbarItems } from "../../lib/constants";
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const token = localStorage.getItem("tokenAcceso");

  const showAuthButtons = !user && !token;

  const userNameFirstLetter = user?.nombre.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="relative flex items-center justify-between px-6 lg:px-16 py-4 bg-white shadow-sm z-50">
      <picture>
        <img
          className="w-32 lg:w-48"
          src="/worklyst-logo.svg"
          alt="Worklyst Logo"
        />
      </picture>

      {/* Desktop Navigation */}
      <nav className="hidden xl:flex flex-1 items-center justify-center gap-8">
        {NavbarItems.map(({ label, href }) => (
          <Link
            key={href}
            className="text-xl text-gray-700 hover:text-blue-600 hover:scale-105 transition font-medium"
            to={href}
          >
            {label}
          </Link>
        ))}
      </nav>

      <aside className="hidden xl:flex items-center gap-4">
        {showAuthButtons ? (
          <>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Crear Cuenta
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center text-2xl font-medium text-gray-800 bg-gray-200 size-12 rounded-full"
          >
            {userNameFirstLetter}
          </button>
        )}
      </aside>

      <button
        className="xl:hidden p-2 text-gray-600 hover:text-blue-600 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        NavbarItems={NavbarItems}
        showAuthButtons={showAuthButtons}
      />
    </header>
  );
}
