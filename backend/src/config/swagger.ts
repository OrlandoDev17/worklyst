import swaggerJSDoc from 'swagger-jsdoc';
import obtenerConfig from './configLoader';

const config = obtenerConfig();
const port = config.server.port;

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Worklist Backend API',
        version: '1.0.0',
        description: 'Documentación de la API Backend de Worklist',
        contact: {
            name: 'Equipo de Desarrollo Worklist',
        },
    },
    servers: [
        {
            url: `http://localhost:${port}`,
            description: 'Servidor de Desarrollo',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Archivos donde buscar anotaciones
};

export const swaggerSpec = swaggerJSDoc(options);
