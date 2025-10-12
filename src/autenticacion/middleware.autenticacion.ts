import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

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
            process.env.JWT_SECRET || "clave_jwt_eventos_provisoria"
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
