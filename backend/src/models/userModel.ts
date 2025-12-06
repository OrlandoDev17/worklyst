import { ejecutar, obtener } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export interface Usuario {
    id: string;
    usuario: string;
    email: string;
    password?: string;
    created_at?: string;
}

export const inicializarTablaUsuarios = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await ejecutar(sql);
};

export const inicializarTablaRefreshTokens = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    await ejecutar(sql);
};

export const guardarRefreshToken = async (idUsuario: string, token: string, expiraEn: Date) => {
    const id = uuidv4();
    const sql = `
        INSERT INTO refresh_tokens (id, user_id, token, expires_at)
        VALUES (?, ?, ?, ?)
    `;
    await ejecutar(sql, [id, idUsuario, token, expiraEn.toISOString()]);
    return { id, idUsuario, token, expiraEn };
};

export const buscarRefreshToken = async (token: string) => {
    const sql = `
        SELECT * FROM refresh_tokens 
        WHERE token = ? AND expires_at > datetime('now')
    `;
    return await obtener(sql, [token]);
};

export const eliminarRefreshToken = async (token: string) => {
    const sql = `DELETE FROM refresh_tokens WHERE token = ?`;
    await ejecutar(sql, [token]);
};

export const eliminarRefreshTokensUsuario = async (idUsuario: string) => {
    const sql = `DELETE FROM refresh_tokens WHERE user_id = ?`;
    await ejecutar(sql, [idUsuario]);
};

export const crearUsuario = async (usuario: Omit<Usuario, 'id' | 'created_at'>) => {
    const id = uuidv4();
    const sql = `
        INSERT INTO users (id, name, email, password)
        VALUES (?, ?, ?, ?)
    `;
    await ejecutar(sql, [id, usuario.usuario, usuario.email, usuario.password]);
    return { id, nombre: usuario.usuario, email: usuario.email };
};

export const buscarUsuarioPorEmail = async (email: string): Promise<Usuario | undefined> => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const resultado = await obtener(sql, [email]) as any;
    if (!resultado) return undefined;

    return {
        id: resultado.id,
        usuario: resultado.name,
        email: resultado.email,
        password: resultado.password,
        created_at: resultado.created_at
    };
};
