/**
 * Interfaz genérica para adaptadores de base de datos
 * Todos los adaptadores (SQLite, PostgreSQL, MongoDB) deben implementar esta interfaz
 */
export interface IAdaptadorBD {
    /**
     * Ejecutar una consulta SELECT que retorna múltiples filas
     * @param sql - Consulta SQL o equivalente
     * @param params - Parámetros de la consulta
     * @returns Promise con array de resultados
     */
    consulta(sql: string, params?: any[]): Promise<any[]>;

    /**
     * Ejecutar una consulta SELECT que retorna una sola fila
     * @param sql - Consulta SQL o equivalente
     * @param params - Parámetros de la consulta
     * @returns Promise con un resultado o undefined
     */
    obtener(sql: string, params?: any[]): Promise<any>;

    /**
     * Ejecutar una operación INSERT, UPDATE o DELETE
     * @param sql - Consulta SQL o equivalente
     * @param params - Parámetros de la consulta
     * @returns Promise con información de la ejecución
     */
    ejecutar(sql: string, params?: any[]): Promise<any>;

    /**
     * Establecer conexión con la base de datos
     */
    conectar(): Promise<void>;

    /**
     * Cerrar conexión con la base de datos
     */
    desconectar(): Promise<void>;

    /**
     * Inicializar las tablas necesarias para la aplicación
     */
    inicializarTablas(): Promise<void>;
}
