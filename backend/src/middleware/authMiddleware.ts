import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import obtenerConfig from '../config/configLoader';

const config = obtenerConfig();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ mensaje: 'Token de acceso no proporcionado' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwt.accessTokenSecret) as { id: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
};
