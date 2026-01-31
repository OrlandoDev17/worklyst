import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLayoutEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useAnimations(scopeRef: React.RefObject<HTMLElement | null>) {
  // Función para ejecutar animaciones de forma segura
  const animate = (
    callback: (context: gsap.Context) => void,
    deps: any[] = [],
  ) => {
    useLayoutEffect(() => {
      let ctx = gsap.context(callback, scopeRef);
      return () => ctx.revert(); // Limpieza automática al desmontar
    }, deps);
  };

  return { animate, gsap };
}
