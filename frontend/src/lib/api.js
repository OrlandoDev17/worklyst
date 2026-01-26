import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para añadir el token de Acceso a cada peticion
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Verificamos que sea 401
    // 2. Verificamos que no sea la propia ruta de refresh (para evitar bucles)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("tokenActualizacion");

        if (!refreshToken) {
          throw new Error("No hay refresh token");
        }

        // IMPORTANTE: Usamos axios (la librería) para no entrar en bucle
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {
            tokenActualizacion: refreshToken,
          },
        );

        const { tokenAcceso } = res.data;
        localStorage.setItem("tokenAcceso", tokenAcceso);

        // Reintentamos
        originalRequest.headers.Authorization = `Bearer ${tokenAcceso}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
