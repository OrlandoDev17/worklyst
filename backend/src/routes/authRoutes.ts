import { Router } from 'express';
import { registrar, iniciarSesion, renovarToken, cerrarSesion } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - email
 *               - password
 *             properties:
 *               usuario:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos o usuario ya existente
 */
router.post('/register', authLimiter, registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna tokens
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authLimiter, iniciarSesion);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar token de acceso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenActualizacion
 *             properties:
 *               tokenActualizacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo token de acceso generado
 *       401:
 *         description: Token inválido o expirado
 */
router.post('/refresh', renovarToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión (revocar refresh token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenActualizacion
 *             properties:
 *               tokenActualizacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.post('/logout', cerrarSesion);

export default router;
