"use client";

import { useState, useEffect } from "react";
import { useGroups } from "@/contexts/GroupContext";
import { Button } from "../common/Button";
import { X, Pencil, Trash2, UserPlus, UserMinus, Loader2 } from "lucide-react";
import { Group, GroupMember, User } from "@/lib/types";
import { AddMemberModal } from "../projects/AddMemberModal";
import { MemberAvatar } from "../common/MemberAvatar";

interface EditGroupModalProps {
  show: boolean;
  onClose: () => void;
  group: Group;
}

export function EditGroupModal({ show, onClose, group }: EditGroupModalProps) {
  const {
    updateGroup,
    deleteGroup,
    addMembers,
    removeMember,
    getGroupById,
    selectedGroup,
    loading,
  } = useGroups();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [updatingGroup, setUpdatingGroup] = useState(false);

  useEffect(() => {
    if (show && group.id) {
      getGroupById(group.id);
    }
  }, [show, group.id, getGroupById]);

  if (!show) return null;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatingGroup(true);
    const formData = new FormData(e.currentTarget);
    const success = await updateGroup(group.id, {
      nombre: formData.get("nombre") as string,
      descripcion: formData.get("descripcion") as string,
    });
    setUpdatingGroup(false);
    if (success) onClose();
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar esta comunidad? Esta acción no se puede deshacer.",
      )
    ) {
      setIsDeleting(true);
      const success = await deleteGroup(group.id);
      setIsDeleting(false);
      if (success) onClose();
    }
  };

  const handleAddMember = async (user: User) => {
    return await addMembers(group.id, [user.id!]);
  };

  const handleRemoveMember = async (userId: string) => {
    if (window.confirm("¿Eliminar miembro de la comunidad?")) {
      await removeMember(group.id, userId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <header className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Configurar Comunidad
            </h2>
            <p className="text-sm text-gray-500">
              Edita detalles y gestiona miembros
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="size-6 text-gray-500" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Formulario de edición */}
          <form
            onSubmit={handleUpdate}
            id="edit-group-form"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  name="nombre"
                  defaultValue={group.nombre}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  name="descripcion"
                  defaultValue={group.descripcion}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </form>

          {/* Gestión de miembros */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Miembros
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  {selectedGroup?.miembros?.length || 0}
                </span>
              </h3>
              <Button
                style="secondary"
                className="py-2 px-4 text-xs"
                onClick={() => setShowAddMember(true)}
              >
                <UserPlus className="size-4" />
                Añadir Miembro
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loading ? (
                <div className="col-span-full py-10 flex justify-center">
                  <Loader2 className="size-8 text-blue-500 animate-spin" />
                </div>
              ) : selectedGroup?.miembros?.length === 0 ? (
                <p className="col-span-full text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-2xl border border-dashed">
                  No hay miembros en esta comunidad
                </p>
              ) : (
                selectedGroup?.miembros?.map((member: GroupMember) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group/member"
                  >
                    <div className="flex items-center gap-3">
                      <MemberAvatar name={member.nombre} size="sm" />
                      <div className="flex flex-col min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {member.nombre}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/member:opacity-100"
                    >
                      <UserMinus className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <footer className="p-6 border-t flex justify-between items-center bg-gray-50/50 rounded-b-3xl">
          <Button
            style="logout"
            className="py-2 px-4"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Eliminar Grupo
          </Button>

          <div className="flex gap-3">
            <Button style="secondary" onClick={onClose} className="py-2 px-6">
              Cancelar
            </Button>
            <Button
              type="submit"
              form="edit-group-form"
              isLoading={updatingGroup}
              className="py-2 px-6"
            >
              <Pencil className="size-4" />
              Guardar Cambios
            </Button>
          </div>
        </footer>

        <AddMemberModal
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
          onAddMember={handleAddMember}
          currentMembers={selectedGroup?.miembros?.map((m) => ({
            id: m.id,
            nombre: m.nombre,
            email: m.email,
          }))}
        />
      </div>
    </div>
  );
}
