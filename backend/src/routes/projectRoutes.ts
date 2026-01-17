import { Router } from 'express';
import {
    crear,
    listar,
    obtenerUno,
    actualizar,
    finalizar,
    eliminar,
    agregarMiembroController,
    eliminarMiembroController
} from '../controllers/projectController';
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas CRUD Proyectos

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         owner_id:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, finished]
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Proyecto creado
 *   get:
 *     summary: Listar proyectos del usuario
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.post('/', verificarToken, crear);
router.get('/', verificarToken, listar);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del proyecto
 *       404:
 *         description: Proyecto no encontrado
 *   put:
 *     summary: Actualizar proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *   delete:
 *     summary: Eliminar proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 */
router.get('/:id', verificarToken, obtenerUno);
router.put('/:id', verificarToken, actualizar);
router.patch('/:id/finish', verificarToken, finalizar);
router.delete('/:id', verificarToken, eliminar);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   post:
 *     summary: Agregar miembro al proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Miembro agregado
 */
router.post('/:id/members', verificarToken, agregarMiembroController);
router.delete('/:id/members/:userId', verificarToken, eliminarMiembroController);

export default router;
