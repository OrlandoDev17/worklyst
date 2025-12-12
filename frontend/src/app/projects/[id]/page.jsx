"use client";

import { use } from "react";
import Link from "next/link";

export default function ProjectDetails({ params }) {
  // resolving params correctly in Next.js 15/16 (async params)
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a Proyectos
        </Link>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Proyecto {id}</h1>
          <p className="mt-4 text-gray-600">
            Detalles del proyecto con ID: {id}. Aquí irá la información completa
            del proyecto.
          </p>
        </div>
      </div>
    </main>
  );
}
