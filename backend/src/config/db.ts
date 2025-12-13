import obtenerConfig from './configLoader';
import { PostgreSQLConnection } from './database/PostgreSQLConnection';

const config = obtenerConfig();

// Validar configuración de PostgreSQL
// Debe tener connection string O todos los parámetros individuales
const tieneConnectionString = !!config.database.connectionString;
const tieneParametrosIndividuales = !!(
    config.database.host &&
    config.database.port &&
    config.database.database &&
    config.database.user &&
    config.database.password
);

if (!tieneConnectionString && !tieneParametrosIndividuales) {
    throw new Error(
        'Configuración PostgreSQL incompleta. ' +
        'Debe proporcionar "connectionString" O todos los parámetros individuales (host, port, database, user, password)'
    );
}

// Crear instancia de la conexión PostgreSQL
const conexionBD = new PostgreSQLConnection(
    tieneConnectionString
        ? { connectionString: config.database.connectionString }
        : {
            host: config.database.host!,
            port: config.database.port!,
            database: config.database.database!,
            user: config.database.user!,
            password: config.database.password!,
        }
);

// Conectar a la base de datos
conexionBD.conectar().catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
});

// Funciones de conveniencia para consultas
export const consulta = (sql: string, params: any[] = []) => {
    return conexionBD.consulta(sql, params);
};

export const ejecutar = (sql: string, params: any[] = []) => {
    return conexionBD.ejecutar(sql, params);
};

export const obtener = (sql: string, params: any[] = []) => {
    return conexionBD.obtener(sql, params);
};

// Exportar la conexión para acceso directo si es necesario
export default conexionBD;



