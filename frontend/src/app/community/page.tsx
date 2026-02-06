"use client";

import { useEffect, useState } from "react";
import { useGroups } from "@/contexts/GroupContext";
import { Button } from "@/components/common/Button";
import { Plus, Users, ArrowRight, MoreVertical } from "lucide-react";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { AddGroupModal } from "@/components/community/AddGroupModal";
import { Group } from "@/lib/types";

export default function ComunidadPage() {
  const { groups, fetchGroups, loading } = useGroups();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Comunidades</h1>
          <p className="text-gray-500">
            Gestiona tus grupos de trabajo y colabora eficientemente
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="size-5" />
          Crear Grupo
        </Button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Users className="size-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            No perteneces a ninguna comunidad
          </h2>
          <p className="text-gray-500 mb-6">
            Comienza creando un grupo e invitando a tu equipo
          </p>
          <Button style="secondary" onClick={() => setShowModal(true)}>
            Crear mi primer grupo
          </Button>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group: Group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      <AddGroupModal show={showModal} onClose={() => setShowModal(false)} />
    </main>
  );
}

function GroupCard({ group }: { group: Group }) {
  return (
    <article className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <Users className="size-6" />
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="size-5" />
        </button>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">{group.nombre}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
        {group.descripcion}
      </p>

      <footer className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex -space-x-2">
          {/* Aquí podrías mapear los avatares si el GET de la lista los incluyera */}
          <MemberAvatar name={group.creador} size="sm" />
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:gap-2 transition-all">
          Ver detalles <ArrowRight className="size-4" />
        </button>
      </footer>
    </article>
  );
}
