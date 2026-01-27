# 🚀 WorkLyst - Frontend

WorkLyst es una plataforma premium de gestión de proyectos diseñada para equipos modernos. Ofrece una experiencia fluida e intuitiva para organizar tareas, colaborar en proyectos y mantener un seguimiento claro del progreso.

Este repositorio contiene la aplicación **frontend**, construida con un enfoque en el rendimiento, la accesibilidad y una experiencia de usuario excepcional.

---

## ✨ Características Principales

- **📊 Tablero Kanban Interactivo**: Gestión visual de tareas mediante **Drag & Drop** nativo entre estados (Por hacer, En progreso, Completado).
- **🤖 Asistente IA Integrado**: ChatAI powered by n8n para crear proyectos mediante lenguaje natural.
- **🔔 Sistema de Notificaciones (Toasts)**: Retroalimentación inmediata y elegante con micro-animaciones para cada acción (suceso, error, info).
- **🛠️ Gestión de Proyectos**: Creación dinámica de proyectos con métricas en tiempo real y seguimiento de colaboradores.
- **🔐 Autenticación Robusta**: Flujos completos de registro e inicio de sesión con persistencia de sesión y refresh token automático.
- **📱 Diseño Ultra-Responsivo**: Interfaz adaptativa optimizada para dispositivos móviles (Menú Hamburguesa) y escritorio.
- **💾 Persistencia Inteligente**: Sincronización automática con `localStorage` para garantizar que nunca pierdas tu progreso.

---

## 🛠️ Tecnologías

- **[React 19](https://react.dev/)**: La librería líder para interfaces de usuario reactivas.
- **[Vite](https://vitejs.dev/)**: Herramientas de Frontend de próxima generación para un desarrollo ultrarrápido.
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Estilizado mediante utilidades modernas y un sistema de diseño consistente.
- **[React Router 7](https://reactrouter.com/)**: Gestión de rutas potente y optimizada.
- **[Axios](https://axios-http.com/)**: Cliente HTTP robusto para la comunicación con el Backend.
- **[n8n Chat](https://www.npmjs.com/package/@n8n/chat)**: Widget de chat integrado para asistente IA.

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura modular y escalable dentro de `src/`:

```bash
src/
├── components/           # Componentes de UI modulares
│   ├── ai/              # ChatAI - Asistente IA integrado
│   ├── auth/            # Componentes de seguridad (FormInput, ProtectedRoute)
│   ├── common/          # UI compartida (Iconos, Sistema de Toasts)
│   ├── layout/          # Estructura global (Header, Footer, MobileMenu)
│   └── projects/        # Lógica visual de proyectos (Cards, Modales, Stats, Kanban)
├── context/             # Estado Global (AuthContext, ProjectsContext, ToastContext, UsersContext)
├── pages/               # Vistas principales y enrutamiento dinámico
│   ├── Login.jsx        # Página de inicio de sesión
│   ├── Register.jsx     # Página de registro
│   ├── Dashboard.jsx    # Panel principal
│   ├── Projects.jsx     # Lista de proyectos
│   ├── [id].jsx         # Detalle de proyecto (Kanban board)
│   └── Community.jsx    # Comunidad (en desarrollo)
├── lib/                 # Utilidades, constantes y lógica de apoyo
│   ├── api.js          # Cliente Axios configurado con interceptores
│   └── constants.js    # Constantes de la aplicación
├── App.jsx              # Configurador de rutas y proveedores
└── main.jsx             # Punto de entrada de la aplicación
```

---

## 🏗️ Arquitectura Frontend

### Context Providers (Estado Global)

La aplicación utiliza React Context API para gestionar el estado global:

#### 1. **AuthContext** (`context/AuthContext.jsx`)

Gestiona la autenticación de usuarios.

**Estado:**

- `user`: Usuario autenticado actual
- `loading`: Estado de carga
- `success`: Indicador de operación exitosa
- `error`: Mensajes de error

**Métodos:**

- `register(userData)`: Registra un nuevo usuario
- `login(userData)`: Inicia sesión
- `logout()`: Cierra sesión y limpia tokens

**Persistencia:**

- Guarda `tokenAcceso`, `tokenActualizacion` y `usuario` en localStorage
- Restaura sesión automáticamente al recargar la página

#### 2. **ProjectsContext** (`context/ProjectsContext.jsx`)

Gestiona proyectos y sus operaciones.

**Estado:**

- `projects`: Array de proyectos del usuario
- `project`: Proyecto individual seleccionado
- `state`: { loading, error, success }

**Métodos:**

- `getProjects()`: Obtiene todos los proyectos del usuario
- `getProjectById(id)`: Obtiene un proyecto específico
- `addProject(projectData)`: Crea un nuevo proyecto

#### 3. **UsersContext** (`context/UsersContext.jsx`)

Gestiona búsqueda y obtención de usuarios.

**Estado:**

- `user`: Usuario obtenido
- `loading`: Estado de carga
- `error`: Mensajes de error

**Métodos:**

- `searchUsers(query)`: Busca usuarios por nombre (filtra bots)
- `getUserById(id)`: Obtiene usuario por ID (detecta y maneja bots)

**Características especiales:**

- Detecta usuarios bot ("IA System Bot") y devuelve datos estáticos
- Filtra bots de resultados de búsqueda

#### 4. **ToastContext** (`context/ToastContext.jsx`)

Sistema de notificaciones toast.

**Métodos:**

- `addToast(message, type)`: Muestra notificación
  - `type`: "success" | "error" | "info"

---

## 🌐 API Integration

### Cliente HTTP (`lib/api.js`)

Instancia de Axios configurada con:

**Base URL:**

```javascript
baseURL: import.meta.env.VITE_API_URL;
```

**Request Interceptor:**

- Añade automáticamente `Authorization: Bearer <token>` a todas las peticiones
- Lee el token de `localStorage.getItem("tokenAcceso")`

**Response Interceptor:**

- Detecta errores 401 (Unauthorized)
- Llama automáticamente a `/api/auth/refresh` con el refresh token
- Actualiza el access token en localStorage
- Reintenta la petición original con el nuevo token
- Redirige a `/login` si el refresh falla

### Endpoints Utilizados

#### Autenticación

```javascript
POST / api / auth / register;
Body: {
  (nombre, email, password);
}
Response: {
  (usuario, tokenAcceso, tokenActualizacion);
}

POST / api / auth / login;
Body: {
  (email, password);
}
Response: {
  (usuario, tokenAcceso, tokenActualizacion);
}

POST / api / auth / logout;
Body: {
  tokenActualizacion;
}
Response: {
  message;
}

POST / api / auth / refresh;
Body: {
  tokenActualizacion;
}
Response: {
  tokenAcceso;
}
```

#### Proyectos

```javascript
GET /api/projects
Headers: { Authorization: Bearer <token> }
Response: [{ id, nombre, descripcion, status, creadorId, miembros, ... }]

GET /api/projects/:id
Headers: { Authorization: Bearer <token> }
Response: { id, nombre, descripcion, status, tareas, ... }

POST /api/projects
Headers: { Authorization: Bearer <token> }
Body: { nombre, descripcion, status }
Response: { id, nombre, ... }
```

#### Usuarios

```javascript
GET /api/users?nombre=<query>
Headers: { Authorization: Bearer <token> }
Response: [{ id, nombre, email, iniciales }]

GET /api/users/:id
Headers: { Authorization: Bearer <token> }
Response: { id, nombre, email, iniciales }
```

---

## 🔄 Flujo de Autenticación

1. **Login/Register:**
   - Usuario envía credenciales
   - Backend responde con `tokenAcceso` y `tokenActualizacion`
   - Frontend guarda ambos tokens en localStorage
   - Usuario se guarda en estado global y localStorage

2. **Peticiones Autenticadas:**
   - Interceptor añade `Authorization: Bearer <tokenAcceso>` automáticamente
   - Si el token es válido, la petición procede normalmente

3. **Token Expirado (401):**
   - Interceptor detecta error 401
   - Llama a `/api/auth/refresh` con `tokenActualizacion`
   - Actualiza `tokenAcceso` en localStorage
   - Reintenta la petición original automáticamente

4. **Refresh Token Inválido:**
   - Limpia localStorage
   - Redirige a `/login`

5. **Persistencia de Sesión:**
   - Al recargar la página, `AuthContext` lee `usuario` y `tokenAcceso` de localStorage
   - Si existen, restaura la sesión automáticamente

---

## 🤖 Integración ChatAI

El componente `ChatAI` integra n8n para crear proyectos mediante IA:

**Configuración:**

```javascript
createChat({
  webhookUrl: "https://n8n-production-fc0c.up.railway.app/webhook/...",
  metadata: {
    userId: user.id, // UUID del usuario autenticado
  },
  mode: "embedded",
  title: "Worklyst AI",
});
```

**Flujo:**

1. Usuario envía mensaje al chat
2. n8n procesa el mensaje y crea el proyecto
3. Proyecto se crea con `userId` del metadata
4. Frontend detecta si `creadorId` es bot y muestra usuario real en la UI

---

## 🎨 Componentes Principales

### ProjectCard

Muestra tarjeta de proyecto con:

- Nombre, descripción, status
- Avatares de miembros (máx 4 visibles)
- Fechas de creación y actualización
- Detección inteligente de creador bot (muestra usuario real)

### ProjectModal

Modal para crear nuevos proyectos:

- Nombre, descripción, status
- Validación de campos
- Integración con ProjectsContext

### KanbanBoard

Tablero drag-and-drop para gestión de tareas:

- Tres columnas: Por hacer, En progreso, Completado
- Arrastrar y soltar tareas entre columnas
- Persistencia en localStorage

---

## 🚀 Comenzando

### Requisitos Previos

- **Node.js**: Versión 18 o superior recomendada.
- **npm** o **bun**: Gestor de paquetes.

### Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone <repository-url>
   cd workLyst/frontend
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   # o
   bun install
   ```

3. **Configuración del Entorno:**
   Crea un archivo `.env` en la raíz del directorio `frontend`.

   ```env
   VITE_API_URL=http://localhost:3000 # URL de tu Backend API
   ```

4. **Ejecutar el servidor de desarrollo:**
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

## 🔒 Seguridad

- Tokens JWT almacenados en localStorage
- Refresh token automático para sesiones largas
- Rutas protegidas con `ProtectedRoute` component
- Validación de entrada en formularios
- Detección y filtrado de usuarios bot

---

## 🐛 Debugging

Para depurar peticiones API:

1. Abre DevTools → Network
2. Filtra por "Fetch/XHR"
3. Revisa headers de Authorization
4. Verifica respuestas del backend

Para depurar estado:

1. Instala React DevTools
2. Inspecciona Context values
3. Revisa localStorage en Application tab

---

Desarrollado para **Uneti Grupo**.
