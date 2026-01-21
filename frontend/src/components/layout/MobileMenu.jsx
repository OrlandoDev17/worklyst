import { Link } from "react-router-dom";

export function MobileMenu({
  isOpen,
  setIsOpen,
  NavbarItems,
  showAuthButtons,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 p-4 flex flex-col gap-4">
      <nav className="flex flex-col space-y-2">
        {NavbarItems.map(({ label, href }) => (
          <Link
            key={href}
            className="p-3 text-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
            to={href}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
      {showAuthButtons && (
        <>
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full text-center px-5 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="w-full text-center px-5 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              onClick={() => setIsOpen(false)}
            >
              Crear Cuenta
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
