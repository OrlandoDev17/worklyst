"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-400 py-2 flex items-center">
      <div className="flex items-center justify-between max-w-11/12 mx-auto w-full">
        <picture className="flex-1">
          <img className="w-48" src="/logo.svg" alt="Logo de worklyst" />
        </picture>
        <nav>
          <ul className="flex items-center gap-4">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  className={` transition-colors ${
                    pathname === href
                      ? "text-blue-500 font-medium"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                  href={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <aside className="flex items-center gap-4 flex-1 justify-end">
          <Link
            className="px-4 py-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-500 hover:-translate-y-1 transition-all"
            href="/login"
          >
            Iniciar Sesión
          </Link>
          <Link
            className="px-4 py-1.5 border border-blue-400 rounded-lg text-blue-500 
            hover:text-white hover:bg-blue-500 hover:-translate-y-1 transition-all"
            href="/register"
          >
            Registrarse
          </Link>
        </aside>
      </div>
    </header>
  );
}
