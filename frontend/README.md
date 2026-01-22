# 🚀 WorkLyst - Frontend

WorkLyst es una plataforma premium de gestión de proyectos diseñada para equipos modernos. Ofrece una experiencia fluida e intuitiva para organizar tareas, colaborar en proyectos y mantener un seguimiento claro del progreso.

Este repositorio contiene la aplicación **frontend**, construida con un enfoque en el rendimiento, la accesibilidad y una experiencia de usuario excepcional.

---

## ✨ Características Principales

- **📊 Tablero Kanban Interactivo**: Gestión visual de tareas mediante **Drag & Drop** nativo entre estados (Por hacer, En progreso, Completado).
- **🔔 Sistema de Notificaciones (Toasts)**: Retroalimentación inmediata y elegante con micro-animaciones para cada acción (suceso, error, info).
- **🛠️ Gestión de Proyectos**: Creación dinámica de proyectos con métricas en tiempo real y seguimiento de colaboradores.
- **🔐 Autenticación Robusta**: Flujos completos de registro e inicio de sesión con persistencia de sesión.
- **📱 Diseño Ultra-Responsivo**: Interfaz adaptativa optimizada para dispositivos móviles (Menú Hamburguesa) y escritorio.
- **💾 Persistencia Inteligente**: Sincronización automática con `localStorage` para garantizar que nunca pierdas tu progreso.

---

## 🛠️ Tecnologías

- **[React 19](https://react.dev/)**: La librería líder para interfaces de usuario reactivas.
- **[Vite](https://vitejs.dev/)**: Herramientas de Frontend de próxima generación para un desarrollo ultrarrápido.
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Estilizado mediante utilidades modernas y un sistema de diseño consistente.
- **[React Router 7](https://reactrouter.com/)**: Gestión de rutas potente y optimizada.
- **[Axios](https://axios-http.com/)**: Cliente HTTP robusto para la comunicación con el Backend.

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura modular y escalable dentro de `src/`:

```bash
src/
├── components/           # Componentes de UI modulares
│   ├── auth/             # Componentes de seguridad (FormInput, ProtectedRoute)
│   ├── common/           # UI compartida (Iconos, Sistema de Toasts)
│   ├── layout/           # Estructura global (Header, Footer, MobileMenu)
│   └── projects/         # Lógica visual de proyectos (Cards, Modales, Stats)
├── context/              # Estado Global (AuthContext, ProjectsContext, ToastContext)
├── pages/                # Vistas principales y enrutamiento dinámico
├── lib/                  # Utilidades, constantes y lógica de apoyo
├── App.jsx               # Configurador de rutas y proveedores
└── main.jsx              # Punto de entrada de la aplicación
```

---

## 🚀 Comenzando

Sigue estos pasos para configurar el entorno de ejecución local.

### Requisitos Previos

- **Node.js**: Versión 18 o superior recomendada.
- **npm** o **bun**: Gestor de paquetes.

### Instalación

1.  **Clonar el repositorio:**

    ```bash
    git clone <repository-url>
    cd workLyst/frontend
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    # o
    bun install
    ```

3.  **Configuración del Entorno:**
    Crea un archivo `.env` en la raíz del directorio `frontend`.

    ```env
    VITE_API_URL=http://localhost:3000 # URL de tu Backend API
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible por defecto en `http://localhost:5173`.

---

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el entorno de desarrollo con HMR.
- `npm run build`: Compila y optimiza el proyecto para producción.
- `npm run lint`: Verifica la calidad del código mediante ESLint.
- `npm run preview`: Previsualiza localmente el build de producción.

---

Desarrollado para **Uneti Grupo**.
