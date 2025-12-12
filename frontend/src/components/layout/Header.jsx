import { NAV_ITEMS } from "@/lib/constants";

export default function Header() {
  return (
    <header className="border-b border-gray-300">
      <div className="flex items-center justify-between max-w-11/12 mx-auto w-full py-2">
        <picture>
          <img className="w-48" src="/logo.svg" alt="Logo de Worklyst" />
        </picture>
        <nav className="flex items-center gap-4">
          {NAV_ITEMS.map((item) => (
            <a
              href={item.href}
              key={item.label}
              className="text-gray-600 hover:text-black transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
