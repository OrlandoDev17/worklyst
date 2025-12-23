import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { crearUsuario, buscarUsuarioPorEmail, guardarRefreshToken, buscarRefreshToken, eliminarRefreshToken } from '../models/userModel';
import obtenerConfig from '../config/configLoader';

const config = obtenerConfig();
const SECRET_ACCESS_TOKEN = config.jwt.accessTokenSecret;
const SECRET_REFRESH_TOKEN = config.jwt.refreshTokenSecret;
const EXPIRACION_ACCESS_TOKEN = config.jwt.accessTokenExpiry;
const EXPIRACION_REFRESH_TOKEN = config.jwt.refreshTokenExpiry;

// Función auxiliar para calcular fecha de expiración
const obtenerFechaExpiracion = (expiracion: string): Date => {
    const coincidencia = expiracion.match(/^(\d+)([smhd])$/);
    if (!coincidencia) throw new Error('Formato de expiración inválido');

    const valor = parseInt(coincidencia[1]);
    const unidad = coincidencia[2];
    const ahora = new Date();

    switch (unidad) {
        case 's': return new Date(ahora.getTime() + valor * 1000);
        case 'm': return new Date(ahora.getTime() + valor * 60 * 1000);
        case 'h': return new Date(ahora.getTime() + valor * 60 * 60 * 1000);
        case 'd': return new Date(ahora.getTime() + valor * 24 * 60 * 60 * 1000);
        default: throw new Error('Unidad de expiración inválida');
    }
};

export const registrar = async (req: Request, res: Response): Promise<void> => {
    const { usuario, email, password } = req.body;

    if (!usuario || !email || !password) {
        res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        return;
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
        res.status(400).json({ mensaje: 'El usuario ya existe' });
        return;
    }

    const passwordHasheado = await bcrypt.hash(password, 10);
    const nuevoUsuario = await crearUsuario({ usuario, email, password: passwordHasheado });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
};

export const iniciarSesion = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
        return;
    }

    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario || !usuario.password) {
        res.status(401).json({ mensaje: 'Credenciales inválidas' });
        return;
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
        res.status(401).json({ mensaje: 'Credenciales inválidas' });
        return;
    }

    // Generar access token (corta duración)
    const tokenAcceso = jwt.sign(
        { id: usuario.id, email: usuario.email },
        SECRET_ACCESS_TOKEN,
        { expiresIn: EXPIRACION_ACCESS_TOKEN } as jwt.SignOptions
    );

    // Generar refresh token (larga duración)
    const tokenActualizacion = jwt.sign(
        { id: usuario.id, email: usuario.email },
        SECRET_REFRESH_TOKEN,
        { expiresIn: EXPIRACION_REFRESH_TOKEN } as jwt.SignOptions
    );

    // Guardar refresh token en la base de datos
    const expiraEn = obtenerFechaExpiracion(EXPIRACION_REFRESH_TOKEN);
    await guardarRefreshToken(usuario.id, tokenActualizacion, expiraEn);

    res.json({
        mensaje: 'Login exitoso',
        tokenAcceso,
        tokenActualizacion,
        usuario: { id: usuario.id, nombre: usuario.usuario, email: usuario.email }
    });
};

export const renovarToken = async (req: Request, res: Response): Promise<void> => {
    const { tokenActualizacion } = req.body;

    if (!tokenActualizacion) {
        res.status(400).json({ mensaje: 'Refresh token es obligatorio' });
        return;
    }

    try {
        // Verificar refresh token
        const decodificado = jwt.verify(tokenActualizacion, SECRET_REFRESH_TOKEN) as { id: string; email: string };

        // Verificar si el refresh token existe en la base de datos y no ha expirado
        const tokenAlmacenado = await buscarRefreshToken(tokenActualizacion);
        if (!tokenAlmacenado) {
            res.status(401).json({ mensaje: 'Refresh token inválido o expirado' });
            return;
        }

        // Generar nuevo access token
        const nuevoTokenAcceso = jwt.sign(
            { id: decodificado.id, email: decodificado.email },
            SECRET_ACCESS_TOKEN,
            { expiresIn: EXPIRACION_ACCESS_TOKEN } as jwt.SignOptions
        );

        res.json({
            mensaje: 'Token renovado exitosamente',
            tokenAcceso: nuevoTokenAcceso
        });
    } catch (error) {
        res.status(401).json({ mensaje: 'Refresh token inválido' });
    }
};

export const cerrarSesion = async (req: Request, res: Response): Promise<void> => {
    const { tokenActualizacion } = req.body;

    if (!tokenActualizacion) {
        res.status(400).json({ mensaje: 'Refresh token es obligatorio' });
        return;
    }

    // Eliminar refresh token de la base de datos
    await eliminarRefreshToken(tokenActualizacion);

    res.json({ mensaje: 'Logout exitoso' });
};
