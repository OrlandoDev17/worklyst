# workLyst 🚀

Proyecto de gestión integral para el Trayecto 2 de la UNETI. Este repositorio contiene el ecosistema completo compuesto por una interfaz moderna, un núcleo persistente y automatización mediante IA.

---

## 🛠️ Arquitectura del Proyecto

### 💻 Frontend

Desarrollado con **Next.js** y **TypeScript**, ofreciendo una experiencia de usuario fluida y reactiva.

- **Framework:** Next.js (App Router).
- **Estilos:** Tailwind CSS con un diseño premium y responsive.
- **Estado:** Context API para la gestión de tareas y usuarios.
- **Iconografía:** Lucide React.

### ⚙️ Backend

Un servidor robusto construido con **Node.js** y **Express**.

- **Lenguaje:** TypeScript.
- **Base de Datos:** PostgreSQL (con soporte para SQLite en desarrollo).
- **Autenticación:** Gestión de sesiones mediante JSON Web Tokens (JWT).
- **Seguridad:** Implementación de CORS, bcryptjs y rate limiting.

### 🤖 Agente IA

La inteligencia del sistema está integrada mediante flujos de automatización.

- **Motor:** Flujo de trabajo en **n8n**.
- **Modelo:** Procesamiento de lenguaje natural utilizando la **API Key de Groq**.
- **Función:** Automatización de tareas y análisis inteligente de datos dentro del flujo de trabajo de la aplicación.

---

## 📂 Estructura del Repositorio

- `/frontend`: Código fuente de la interfaz de usuario.
- `/backend`: Lógica del servidor, modelos de datos y endpoints API.
