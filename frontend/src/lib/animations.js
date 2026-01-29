import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Función base para crear animaciones con ScrollTrigger.
 * Permite separar el 'target' (qué se anima) del 'trigger' (qué activa el scroll).
 *
 * @param {string|HTMLElement} target - Elemento(s) a animar.
 * @param {Object} defaultVars - Valores iniciales (opacidad, posición, etc).
 * @param {Object} options - Configuración adicional (trigger, stagger, duration, etc).
 */
const createScrollAnimation = (target, defaultVars, options = {}) => {
  const {
    // Si no se especifica un trigger en las opciones, usamos el propio target.
    trigger = target,
    start = "top 85%",
    toggleActions = "play none none none",
    stagger = 0,
    delay = 0,
    duration = 0.8,
    ease = "power2.out",
    once = false,
    ...customVars
  } = options;

  return gsap.from(target, {
    ...defaultVars,
    ...customVars,
    duration,
    delay,
    stagger,
    ease,
    scrollTrigger: {
      trigger: trigger, // Aquí es donde se separan si es necesario
      start,
      toggleActions: once ? "play none none none" : toggleActions,
    },
  });
};

/**
 * Animaciones predefinidas
 */
export const fadeUp = (target, options = {}) =>
  createScrollAnimation(target, { y: 50, opacity: 0 }, options);

export const fadeDown = (target, options = {}) =>
  createScrollAnimation(target, { y: -50, opacity: 0 }, options);

export const fadeLeft = (target, options = {}) =>
  createScrollAnimation(target, { x: 50, opacity: 0 }, options);

export const fadeRight = (target, options = {}) =>
  createScrollAnimation(target, { x: -50, opacity: 0 }, options);

export const fadeIn = (target, options = {}) =>
  createScrollAnimation(target, { opacity: 0 }, options);

export const zoomIn = (target, options = {}) =>
  createScrollAnimation(target, { scale: 0.8, opacity: 0 }, options);

export const fadeUpScale = (target, options = {}) =>
  createScrollAnimation(target, { y: 100, opacity: 0, scale: 0.9 }, options);
