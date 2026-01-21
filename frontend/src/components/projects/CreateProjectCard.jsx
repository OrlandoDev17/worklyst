import { Plus } from "../common/Icons";

export function CreateProjectCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed border-gray-800 cursor-pointer hover:bg-gray-100 hover:border-blue-500 transition h-full min-h-[200px] w-full group text-left"
      aria-label="Crear Nuevo Proyecto"
    >
      <div className="p-2 rounded-full bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-500 transition">
        <Plus className="size-10" />
      </div>
      <span className="text-2xl text-center font-medium text-gray-800 group-hover:text-blue-600 transition">
        Crear Nuevo Proyecto
      </span>
      <span className="text-gray-500 text-center text-sm">
        Comienza un nuevo proyecto colaborativo
      </span>
    </button>
  );
}
