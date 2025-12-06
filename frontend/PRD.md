# Worklyst Frontend - Product Requirements Document (PRD)

## 1. Visión General

Este documento describe la arquitectura, funcionalidad y convenciones del frontend de **Worklyst**. Sirve como guía para desarrolladores frontend, backend y usuarios para entender cómo funciona la aplicación.

## 2. Tecnologías Principales (Tech Stack)

- **Framework:** Next.js 16 (App Router)
- **Librería UI:** React 19
- **Lenguajes:** TypeScript (.tsx, .ts) y JavaScript (.js, .jsx)
- **Estilos:** Tailwind CSS v4
- **Animaciones:** GSAP (GreenSock Animation Platform)
- **Fuentes:** Inter (Google Fonts)

## 3. Estructura del Proyecto

La estructura de carpetas sigue las convenciones del **App Router** de Next.js.

```
frontend/
├── src/
│   ├── app/                 # Rutas de la aplicación (App Router)
│   │   ├── (auth)/          # Grupo de rutas de autenticación
│   │   │   ├── login/       # Página de inicio de sesión
│   │   │   └── register/    # Página de registro
│   │   ├── layout.tsx       # Layout raíz (define fuentes y estilos globales)
│   │   └── page.tsx         # Página de inicio (Home)
│   ├── components/          # Componentes reutilizables
│   │   └── auth/            # Componentes específicos de autenticación
│   └── lib/                 # Utilidades y constantes
│       ├── animations.js    # Configuraciones de GSAP
│       └── constants.js     # Constantes globales (campos de formularios, etc.)
├── public/                  # Archivos estáticos
└── package.json             # Dependencias y scripts
```

## 4. Funcionalidades Core

### 4.1 Autenticación (Auth)

El sistema de autenticación maneja el acceso de usuarios mediante rutas dedicadas.

- **Login (`/login`):**
  - Campos definidos en `src/lib/constants.js`:
    - Email (`email`)
    - Contraseña (`password`)
- **Registro (`/register`):**
  - Campos definidos en `src/lib/constants.js`:
    - Nombre Completo (`usuario`)
    - Email (`email`)
    - Contraseña (`password`)

### 4.2 UI & UX

- **Diseño:** Minimalista y responsivo utilizando Tailwind CSS 4.
- **Tipografía:** Fuente **Inter** configurada globalmente en `layout.tsx`.
- **Animaciones:** Se utiliza GSAP para transiciones fluidas y micro-interacciones. Las configuraciones de animación residen en `src/lib/animations.js`.

## 5. Convenciones de Desarrollo

### Constantes

Para evitar "hardcoding", los valores de configuración y textos fijos (como etiquetas de formularios) se almacenan en `src/lib/constants.js`. Esto facilita la modificación de campos sin alterar la lógica de los componentes.

```javascript
// Ejemplo de src/lib/constants.js
export const LOGIN_FIELDS = [
  { name: "email", type: "email", ... },
  ...
];
```

### Estilos

- Se prioriza el uso de clases de utilidad de Tailwind CSS.
- Los estilos globales básicos están en `src/app/globals.css`.

## 6. Integración con Backend

_(Sección para referencia futura)_

- El frontend espera comunicarse con una API RESTful o GraphQL.
- Las definiciones de tipos para las respuestas de la API deberían ubicarse (futuramente) en `src/types` o `src/interfaces`.
