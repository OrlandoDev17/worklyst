import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

interface Configuracion {
    server: {
        port: number;
    };
    database: {
        type?: 'postgres' | 'sqlite';
        filename?: string;
        // Opción 1: Connection string (recomendado para Supabase)
        connectionString?: string;
        // Opción 2: Parámetros individuales
        host?: string;
        port?: number;
        database?: string;
        user?: string;
        password?: string;
    };
    jwt: {
        accessTokenSecret: string;
        refreshTokenSecret: string;
        accessTokenExpiry: string;
        refreshTokenExpiry: string;
    };
    cors: {
        enabled: boolean;
        origin: string;
    };
}

let configuracion: Configuracion;

export const cargarConfiguracion = (): Configuracion => {
    if (configuracion) {
        return configuracion;
    }

    try {
        const rutaConfig = path.resolve(__dirname, '../../bootstrap.yml');
        const contenidoArchivo = fs.readFileSync(rutaConfig, 'utf8');
        const archivoConfig = yaml.load(contenidoArchivo) as Configuracion;

        // Sobrescribir con variables de entorno si existen
        configuracion = {
            server: {
                port: Number(process.env.PORT) || archivoConfig.server.port,
            },
            database: {
                type: (process.env.DB_TYPE as 'postgres' | 'sqlite') || archivoConfig.database.type || 'postgres',
                filename: process.env.DB_FILENAME || archivoConfig.database.filename || 'database.sqlite',
                connectionString: process.env.DATABASE_URL || archivoConfig.database.connectionString,
                host: process.env.DB_HOST || archivoConfig.database.host,
                port: Number(process.env.DB_PORT) || archivoConfig.database.port,
                database: process.env.DB_NAME || archivoConfig.database.database,
                user: process.env.DB_USER || archivoConfig.database.user,
                password: process.env.DB_PASSWORD || archivoConfig.database.password,
            },
            jwt: {
                accessTokenSecret: process.env.JWT_ACCESS_SECRET || archivoConfig.jwt.accessTokenSecret,
                refreshTokenSecret: process.env.JWT_REFRESH_SECRET || archivoConfig.jwt.refreshTokenSecret,
                accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || archivoConfig.jwt.accessTokenExpiry,
                refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || archivoConfig.jwt.refreshTokenExpiry,
            },
            cors: {
                enabled: process.env.CORS_ENABLED ? process.env.CORS_ENABLED === 'true' : archivoConfig.cors.enabled,
                origin: process.env.CORS_ORIGIN || archivoConfig.cors.origin,
            }
        };

        return configuracion;
    } catch (error) {
        console.error('Error al cargar la configuración:', error);
        throw new Error('Fallo al cargar el archivo de configuración o variables de entorno');
    }
};

export const obtenerConfiguracion = (): Configuracion => {
    if (!configuracion) {
        return cargarConfiguracion();
    }
    return configuracion;
};

export default obtenerConfiguracion;
