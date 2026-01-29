import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de peticiones: Adjunta el token de acceso
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tokenAcceso");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuestas: Maneja errores 401 y refresca el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos reintentado ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("tokenActualizacion");
        if (!refreshToken) throw new Error("No hay refresh token");

        // Llamada a refresh token usando una instancia limpia de axios para evitar bucles
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {
            tokenActualizacion: refreshToken,
          },
        );

        const { tokenAcceso } = res.data;

        // Guardar nuevo token
        localStorage.setItem("tokenAcceso", tokenAcceso);

        // Actualizar header y reintentar petición original
        originalRequest.headers.Authorization = `Bearer ${tokenAcceso}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error al refrescar token:", refreshError);
        // Si el refresh falla, limpiar y redirigir
        localStorage.removeItem("tokenAcceso");
        localStorage.removeItem("tokenActualizacion");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
