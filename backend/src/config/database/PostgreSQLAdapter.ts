import { Pool, PoolClient } from 'pg';
import { IAdaptadorBD } from './IAdaptadorBD';

/**
 * Adaptador para PostgreSQL usando pg
 * Traduce las operaciones SQLite a PostgreSQL
 */
export class PostgreSQLAdapter implements IAdaptadorBD {
    private pool: Pool | null = null;
    private config: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
    };

    constructor(config: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
    }) {
        this.config = config;
    }

    async conectar(): Promise<void> {
        if (!this.pool) {
            this.pool = new Pool({
                host: this.config.host,
                port: this.config.port,
                database: this.config.database,
                user: this.config.user,
                password: this.config.password,
            });

            // Probar conexión
            const client = await this.pool.connect();
            client.release();
            console.log(`✓ Conectado a PostgreSQL: ${this.config.host}:${this.config.port}/${this.config.database}`);
        }
    }

    async desconectar(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('✓ Desconectado de PostgreSQL');
        }
    }

    async consulta(sql: string, params: any[] = []): Promise<any[]> {
        if (!this.pool) throw new Error('Base de datos no conectada');
        const sqlPg = this.traducirSQL(sql);
        const result = await this.pool.query(sqlPg, params);
        return result.rows;
    }

    async obtener(sql: string, params: any[] = []): Promise<any> {
        if (!this.pool) throw new Error('Base de datos no conectada');
        const sqlPg = this.traducirSQL(sql);
        const result = await this.pool.query(sqlPg, params);
        return result.rows[0];
    }

    async ejecutar(sql: string, params: any[] = []): Promise<any> {
        if (!this.pool) throw new Error('Base de datos no conectada');
        const sqlPg = this.traducirSQL(sql);
        const result = await this.pool.query(sqlPg, params);
        return {
            changes: result.rowCount || 0,
            lastInsertRowid: result.rows[0]?.id,
        };
    }

    async inicializarTablas(): Promise<void> {
        if (!this.pool) throw new Error('Base de datos no conectada');

        // Tabla de usuarios
        const sqlUsuarios = `
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await this.pool.query(sqlUsuarios);

        // Tabla de refresh tokens
        const sqlRefreshTokens = `
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await this.pool.query(sqlRefreshTokens);

        console.log('✓ Tablas PostgreSQL inicializadas');
    }

    /**
     * Traduce SQL de SQLite a PostgreSQL
     * Principalmente convierte placeholders ? a $1, $2, etc.
     */
    private traducirSQL(sql: string): string {
        let contador = 1;
        let sqlPg = sql.replace(/\?/g, () => `$${contador++}`);

        // Reemplazar DATETIME por TIMESTAMP
        sqlPg = sqlPg.replace(/DATETIME/gi, 'TIMESTAMP');

        // Reemplazar datetime('now') por NOW()
        sqlPg = sqlPg.replace(/datetime\('now'\)/gi, 'NOW()');

        return sqlPg;
    }
}
