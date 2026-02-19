"use client";

// Componentes
import Link from "next/link";
// Hooks
import { useRef, useEffect } from "react";
import { useAnimations } from "@/hooks/useAnimations";
// Animaciones
import { animations } from "@/lib/animations";
// Tipos
import type { NavbarItem, User } from "@/lib/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  NavbarItems: NavbarItem[];
  showAuthButtons: boolean;
  user: User | null;
}

export function MobileMenu({
  user,
  isOpen,
  setIsOpen,
  NavbarItems,
  showAuthButtons,
}: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { animate, gsap } = useAnimations(containerRef);

  useEffect(() => {
    if (isOpen) {
      animate(() => {
        gsap.set(containerRef.current, { display: "flex", opacity: 1, y: 0 });
        animations.menuIn(containerRef.current);
      });
    } else {
      animate(() => {
        animations.menuOut(containerRef.current, {
          onComplete: () => {
            gsap.set(containerRef.current, { display: "none" });
          },
        });
      });
    }
  }, [isOpen, animate, gsap]);

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl xl:hidden p-4 flex flex-col gap-4 z-100 "
    >
      <nav className="flex flex-col space-y-2">
        {NavbarItems.map(({ label, href }) => (
          <Link
            key={href}
            className="p-3 text-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
            href={href}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
      {!showAuthButtons ? (
        <>
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full text-center px-5 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="w-full text-center px-5 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              onClick={() => setIsOpen(false)}
            >
              Crear Cuenta
            </Link>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-2">
          <MemberAvatar name={user?.nombre} />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user?.nombre}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
