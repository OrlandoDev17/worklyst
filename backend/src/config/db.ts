import Database from 'better-sqlite3';
import path from 'path';
import obtenerConfig from './configLoader';

const config = obtenerConfig();

const rutaBD = path.resolve(__dirname, '../../', config.database.path);

const bd = new Database(rutaBD, { verbose: console.log });

export const consulta = (sql: string, params: any[] = []) => {
    return bd.prepare(sql).all(params);
};

export const ejecutar = (sql: string, params: any[] = []) => {
    return bd.prepare(sql).run(params);
};

export const obtener = (sql: string, params: any[] = []) => {
    return bd.prepare(sql).get(params);
};

export default bd;
