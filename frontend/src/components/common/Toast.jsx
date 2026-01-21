import { useEffect, useState } from "react";

const icons = {
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-6 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-6 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-6 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const styles = {
  success: "border-green-100 bg-green-50 text-green-800",
  error: "border-red-100 bg-red-50 text-red-800",
  info: "border-blue-100 bg-blue-50 text-blue-800",
};

export function Toast({ message, type = "info", onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Anima la entrada
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Espera a que la animación termine antes de eliminar
    setTimeout(onClose, 300);
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-4 p-4 rounded-xl border shadow-lg max-w-md w-full transition-all duration-300 transform
        ${styles[type]}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1 text-lg font-medium pt-0.5">{message}</div>
      <button
        onClick={handleClose}
        className="shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 rounded-lg p-1 transition-colors"
        aria-label="Cerrar notificación"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
