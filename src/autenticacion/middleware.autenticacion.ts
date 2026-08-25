import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../shared/config.js"

interface JwtPayload {
    id: string,
    nombre: string,
    tipo: string
}

export function verificarToken(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];
    if (!header) {
        return res.status(403).json({ message: "Token requerido" });
    }
    const token = header.split(" ")[1];
    try {
        const verificado = jwt.verify(
            token,
            config.jwtSecret
        ) as JwtPayload;
        (req as any).usuario = verificado;
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" });
        }
        return res.status(401).json({ message: "Token inválido" });
    }
}

export function soloAdministrador(req: Request, res: Response, next: NextFunction) {
    const usuario = (req as any).usuario;
    if (!usuario || usuario.tipo !== 'administrador') {
        return res.status(403).json({ message: "Acceso restringido a administradores" });
    }
    next();
}

export function soloOrganizador(req: Request, res: Response, next: NextFunction) {
    const usuario = (req as any).usuario;
    if (!usuario || usuario.tipo !== 'organizador') {
        return res.status(403).json({ message: "Acceso restringido a organizadores" });
    }
    next();
}

export function soloCliente(req: Request, res: Response, next: NextFunction) {
    const usuario = (req as any).usuario;
    if (!usuario || usuario.tipo !== 'cliente') {
        return res.status(403).json({ message: "Acceso restringido a clientes" });
    }
    next();
}

export function soloOrganizadorOAdmin(req: Request, res: Response, next: NextFunction) {
    const usuario = (req as any).usuario;
    if (!usuario || (usuario.tipo !== 'organizador' && usuario.tipo !== 'administrador')) {
        return res.status(403).json({ message: "Acceso restringido a organizadores o administradores" });
    }
    next();
}