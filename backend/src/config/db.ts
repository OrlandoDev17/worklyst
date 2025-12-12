import obtenerConfig from './configLoader';
import { IAdaptadorBD } from './database/IAdaptadorBD';
import { SQLiteAdapter } from './database/SQLiteAdapter';
import { PostgreSQLAdapter } from './database/PostgreSQLAdapter';

const config = obtenerConfig();

/**
 * Factory que crea el adaptador de base de datos apropiado
 * según la configuración en bootstrap.yml
 */
function crearAdaptadorBD(): IAdaptadorBD {
    const tipoBD = config.database.tipo;

    switch (tipoBD) {
        case 'sqlite':
            if (!config.database.path) {
                throw new Error('Configuración SQLite incompleta: falta "path"');
            }
            return new SQLiteAdapter(config.database.path);

        case 'postgres':
            if (!config.database.host || !config.database.port ||
                !config.database.database || !config.database.user ||
                !config.database.password) {
                throw new Error('Configuración PostgreSQL incompleta');
            }
            return new PostgreSQLAdapter({
                host: config.database.host,
                port: config.database.port,
                database: config.database.database,
                user: config.database.user,
                password: config.database.password,
            });

        default:
            throw new Error(`Tipo de base de datos no soportado: ${tipoBD}`);
    }
}

// Crear instancia del adaptador
const adaptadorBD = crearAdaptadorBD();

// Conectar a la base de datos
adaptadorBD.conectar().catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
});

// Funciones de conveniencia que mantienen la API original
export const consulta = (sql: string, params: any[] = []) => {
    return adaptadorBD.consulta(sql, params);
};

export const ejecutar = (sql: string, params: any[] = []) => {
    return adaptadorBD.ejecutar(sql, params);
};

export const obtener = (sql: string, params: any[] = []) => {
    return adaptadorBD.obtener(sql, params);
};

// Exportar el adaptador para acceso directo si es necesario
export default adaptadorBD;

