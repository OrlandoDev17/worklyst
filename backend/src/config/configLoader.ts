import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

interface Configuracion {
    server: {
        port: number;
    };
    database: {
        tipo: 'sqlite' | 'postgres';
        // SQLite
        path?: string;
        // PostgreSQL
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
        configuracion = yaml.load(contenidoArchivo) as Configuracion;
        return configuracion;
    } catch (error) {
        console.error('Error al cargar bootstrap.yml:', error);
        throw new Error('Fallo al cargar el archivo de configuración');
    }
};

export const obtenerConfiguracion = (): Configuracion => {
    if (!configuracion) {
        return cargarConfiguracion();
    }
    return configuracion;
};

export default obtenerConfiguracion;
