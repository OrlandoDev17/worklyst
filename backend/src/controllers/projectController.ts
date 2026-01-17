import { Request, Response } from 'express';
import {
    crearProyecto,
    obtenerProyectosUsuario,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto,
    agregarMiembro,
    eliminarMiembro,
    obtenerMiembrosProyecto
} from '../models/projectModel';
import { buscarUsuarioPorId } from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const crear = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, members } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ mensaje: 'No autorizado' });
            return;
        }

        if (!name) {
            res.status(400).json({ mensaje: 'El nombre del proyecto es obligatorio' });
            return;
        }

        // Crear proyecto
        const proyecto = await crearProyecto({
            name,
            description,
            owner_id: userId
        });

        // Asignar miembros iniciales si existen
        if (members && Array.isArray(members)) {
            for (const memberId of members) {
                // Validar que el usuario a agregar exista
                const usuarioExiste = await buscarUsuarioPorId(memberId);
                if (usuarioExiste && memberId !== userId) { // Evitar agregar al owner de nuevo
                    await agregarMiembro(proyecto.id, memberId);
                }
            }
        }

        res.status(201).json({ mensaje: 'Proyecto creado exitosamente', proyecto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el proyecto' });
    }
};

export const listar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ mensaje: 'No autorizado' });
            return;
        }

        const proyectos = await obtenerProyectosUsuario(userId);
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener proyectos' });
    }
};

export const obtenerUno = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const proyecto = await obtenerProyectoPorId(id as string);
        if (!proyecto) {
            res.status(404).json({ mensaje: 'Proyecto no encontrado' });
            return;
        }

        // Validar acceso (solo miembros pueden ver)
        const proyectosUsuario = await obtenerProyectosUsuario(userId!);
        const tieneAcceso = proyectosUsuario.some(p => p.id === id);

        if (!tieneAcceso) {
            res.status(403).json({ mensaje: 'No tienes permiso para ver este proyecto' });
            return;
        }

        const miembros = await obtenerMiembrosProyecto(id as string);
        res.json({ ...proyecto, miembros });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el proyecto' });
    }
};

export const actualizar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const userId = req.user?.id;

        const proyecto = await obtenerProyectoPorId(id as string);
        if (!proyecto) {
            res.status(404).json({ mensaje: 'Proyecto no encontrado' });
            return;
        }

        if (proyecto.owner_id !== userId) {
            res.status(403).json({ mensaje: 'Solo el creador puede editar el proyecto' });
            return;
        }

        await actualizarProyecto(id as string, { name, description });
        res.json({ mensaje: 'Proyecto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el proyecto' });
    }
};

export const finalizar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const proyecto = await obtenerProyectoPorId(id as string);
        if (!proyecto) {
            res.status(404).json({ mensaje: 'Proyecto no encontrado' });
            return;
        }

        if (proyecto.owner_id !== userId) {
            res.status(403).json({ mensaje: 'Solo el creador puede finalizar el proyecto' });
            return;
        }

        await actualizarProyecto(id as string, { status: 'finished' });
        res.json({ mensaje: 'Proyecto finalizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al finalizar el proyecto' });
    }
};

export const eliminar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const proyecto = await obtenerProyectoPorId(id as string);
        if (!proyecto) {
            res.status(404).json({ mensaje: 'Proyecto no encontrado' });
            return;
        }

        if (proyecto.owner_id !== userId) {
            res.status(403).json({ mensaje: 'Solo el creador puede eliminar el proyecto' });
            return;
        }

        await eliminarProyecto(id as string);
        res.json({ mensaje: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el proyecto' });
    }
};

export const agregarMiembroController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // project id
        const { userId: userToAddId } = req.body;
        const currentUserId = req.user?.id;

        if (!userToAddId) {
            res.status(400).json({ mensaje: 'ID de usuario requerido' });
            return;
        }

        const proyecto = await obtenerProyectoPorId(id as string);
        if (!proyecto) {
            res.status(404).json({ mensaje: 'Proyecto no encontrado' });
            return;
        }

        if (proyecto.owner_id !== currentUserId) {
            res.status(403).json({ mensaje: 'Solo el creador puede agregar miembros' });
            return;
        }

        const usuarioExiste = await buscarUsuarioPorId(userToAddId);
        if (!usuarioExiste) {
            res.status(404).json({ mensaje: 'El usuario a agregar no existe' });
            return;
        }

        await agregarMiembro(id as string, userToAddId);
        res.json({ mensaje: 'Miembro agregado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar miembro' });
    }
};

export const eliminarMiembroController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id, userId: userToRemoveId } = req.params;
        const currentUserId = req.user?.id;

        const proyecto = await obtenerProyectoPorId(id as string);
        if (!proyecto) {
            res.status(404).json({ mensaje: 'Proyecto no encontrado' });
            return;
        }

        if (proyecto.owner_id !== currentUserId) {
            res.status(403).json({ mensaje: 'Solo el creador puede eliminar miembros' });
            return;
        }

        if (proyecto.owner_id === userToRemoveId) {
            res.status(400).json({ mensaje: 'No se puede eliminar al creador del proyecto' });
            return;
        }

        await eliminarMiembro(id as string, userToRemoveId as string);
        res.json({ mensaje: 'Miembro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar miembro' });
    }
};
