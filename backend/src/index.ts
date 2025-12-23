import express, { Request, Response } from 'express';
import cors from 'cors';
import obtenerConfig from './config/configLoader';

const config = obtenerConfig();

const app = express();

const puerto = process.env.PORT || config.server.port;

app.use(cors());
app.use(express.json());

app.get('/prueba', (req: Request, res: Response) => {
    res.send('¡Hola Mundo! Backend con TypeScript y SQLite funcionando');
});

// Conexión a la base de datos
import db from './config/db';
import rutasAuth from './routes/authRoutes';
import { inicializarTablas } from './config/database/init';

// Inicializar tablas
inicializarTablas().catch(console.error);

// Rutas
app.use('/api/auth', rutasAuth);

app.listen(puerto, () => {
    console.log(`✓ Servidor escuchando en http://localhost:${puerto}`);
});

