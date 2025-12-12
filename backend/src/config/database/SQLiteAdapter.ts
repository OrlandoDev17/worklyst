import Database from 'better-sqlite3';
import path from 'path';
import { IAdaptadorBD } from './IAdaptadorBD';

/**
 * Adaptador para SQLite usando better-sqlite3
 * Mantiene la funcionalidad actual del sistema
 */
export class SQLiteAdapter implements IAdaptadorBD {
    private bd: Database.Database | null = null;
    private rutaBD: string;

    constructor(rutaBD: string) {
        this.rutaBD = path.resolve(process.cwd(), rutaBD);
    }

    async conectar(): Promise<void> {
        if (!this.bd) {
            this.bd = new Database(this.rutaBD, { verbose: console.log });
            console.log(`✓ Conectado a SQLite: ${this.rutaBD}`);
        }
    }

    async desconectar(): Promise<void> {
        if (this.bd) {
            this.bd.close();
            this.bd = null;
            console.log('✓ Desconectado de SQLite');
        }
    }

    async consulta(sql: string, params: any[] = []): Promise<any[]> {
        if (!this.bd) throw new Error('Base de datos no conectada');
        return this.bd.prepare(sql).all(params);
    }

    async obtener(sql: string, params: any[] = []): Promise<any> {
        if (!this.bd) throw new Error('Base de datos no conectada');
        return this.bd.prepare(sql).get(params);
    }

    async ejecutar(sql: string, params: any[] = []): Promise<any> {
        if (!this.bd) throw new Error('Base de datos no conectada');
        return this.bd.prepare(sql).run(params);
    }

    async inicializarTablas(): Promise<void> {
        if (!this.bd) throw new Error('Base de datos no conectada');

        // Tabla de usuarios
        const sqlUsuarios = `
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        this.bd.prepare(sqlUsuarios).run();

        // Tabla de refresh tokens
        const sqlRefreshTokens = `
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        this.bd.prepare(sqlRefreshTokens).run();

        console.log('✓ Tablas SQLite inicializadas');
    }
}
