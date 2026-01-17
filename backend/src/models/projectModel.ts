import { ejecutar, obtener, consulta } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
    id: string;
    name: string;
    description?: string;
    owner_id: string;
    status: 'active' | 'finished';
    created_at: string;
    updated_at: string;
}

export interface ProjectMember {
    project_id: string;
    user_id: string;
    role: string;
    joined_at: string;
}

// Crear Proyecto
export const crearProyecto = async (proyecto: { name: string; description?: string; owner_id: string }) => {
    const id = uuidv4();
    const sql = `
        INSERT INTO projects (id, name, description, owner_id)
        VALUES (?, ?, ?, ?)
    `;
    await ejecutar(sql, [id, proyecto.name, proyecto.description, proyecto.owner_id]);

    // Agregar al owner como miembro automáticamente
    await agregarMiembro(id, proyecto.owner_id, 'owner');

    return { id, ...proyecto, status: 'active' };
};

// Obtener Proyecto por ID
export const obtenerProyectoPorId = async (id: string): Promise<Project | undefined> => {
    const sql = `SELECT * FROM projects WHERE id = ?`;
    return await obtener(sql, [id]) as any;
};

// Obtener Proyectos de un Usuario (incluye donde es owner y donde es miembro)
export const obtenerProyectosUsuario = async (userId: string): Promise<any[]> => {
    const sql = `
        SELECT p.*, pm.role 
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = ?
        ORDER BY p.updated_at DESC
    `;
    return await consulta(sql, [userId]);
};

// Actualizar Proyecto
export const actualizarProyecto = async (id: string, datos: Partial<Project>) => {
    const updates: string[] = [];
    const values: any[] = [];

    if (datos.name) {
        updates.push('name = ?');
        values.push(datos.name);
    }
    if (datos.description !== undefined) {
        updates.push('description = ?');
        values.push(datos.description);
    }
    if (datos.status) {
        updates.push('status = ?');
        values.push(datos.status);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    if (updates.length > 1) { // siempre agregamos updated_at, asi que > 1 significa que hay cambios reales
        const sql = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id);
        await ejecutar(sql, values);
    }
};

// Eliminar Proyecto
export const eliminarProyecto = async (id: string) => {
    const sql = `DELETE FROM projects WHERE id = ?`;
    await ejecutar(sql, [id]);
};

// Agregar Miembro
export const agregarMiembro = async (projectId: string, userId: string, role: string = 'member') => {
    // Verificar si ya existe
    const checkSql = `SELECT * FROM project_members WHERE project_id = ? AND user_id = ?`;
    const existing = await obtener(checkSql, [projectId, userId]);
    if (existing) return;

    const sql = `
        INSERT INTO project_members (project_id, user_id, role)
        VALUES (?, ?, ?)
    `;
    await ejecutar(sql, [projectId, userId, role]);
};

// Eliminar Miembro
export const eliminarMiembro = async (projectId: string, userId: string) => {
    const sql = `DELETE FROM project_members WHERE project_id = ? AND user_id = ?`;
    await ejecutar(sql, [projectId, userId]);
};

// Obtener Miembros de un Proyecto
export const obtenerMiembrosProyecto = async (projectId: string) => {
    const sql = `
        SELECT u.id, u.name, u.email, pm.role, pm.joined_at
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?
    `;
    return await consulta(sql, [projectId]);
};
