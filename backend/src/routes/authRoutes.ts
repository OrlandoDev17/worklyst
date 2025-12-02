import { Router } from 'express';
import { registrar, iniciarSesion, renovarToken, cerrarSesion } from '../controllers/authController';

const router = Router();

router.post('/register', registrar);
router.post('/login', iniciarSesion);
router.post('/refresh', renovarToken);
router.post('/logout', cerrarSesion);

export default router;
