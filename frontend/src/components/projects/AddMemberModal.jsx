import { X, Search, Check } from "../common/Icons";

export function AddMemberModal({
  setShowAddMember,
  search,
  setSearch,
  isSearching,
  suggestions,
  handleAddMember,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={() => setShowAddMember(false)}
      />
      <article className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-gray-900">Añadir miembro</h4>
          <button
            onClick={() => setShowAddMember(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 size-4 text-gray-400" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar por nombre..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>

        <ul className="max-h-48 overflow-y-auto flex flex-col gap-1">
          {suggestions.map((u) => (
            <li key={u.id}>
              <button
                onClick={() => handleAddMember(u)}
                className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl group transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-700">
                    {u.usuario}
                  </p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <Check className="size-4 text-transparent group-hover:text-blue-500" />
              </button>
            </li>
          ))}
          {search.length >= 3 && suggestions.length === 0 && !isSearching && (
            <p className="text-center py-4 text-sm text-gray-400">
              No se encontraron usuarios
            </p>
          )}
          {search.length < 3 && (
            <p className="text-center py-4 text-xs text-gray-400">
              Escribe al menos 3 caracteres...
            </p>
          )}
        </ul>
      </article>
    </div>
  );
}
