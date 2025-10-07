import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { EntityManager } from "@mikro-orm/core"
import { Usuario } from "../usuario/entidad.usuario.js"

export class ServiceAutenticacion {
    constructor(private readonly em: EntityManager) {}

    async login(email: string, contrasena: string){
        const usuario = await this.em.findOne(Usuario, {email})

        if(!usuario) {
            throw new Error("Usuario o contraseña incorrectos")
        }

        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)
        if (!contrasenaValida) {
            throw new Error("Usuario o contraseña incorrectos")
        }

        const token = jwt.sign(
            {id: usuario.id, nombre: usuario.nombre, tipo: usuario.tipo},
            process.env.JWT_SECRET || "clave_jwt_eventos_provisoria",
            {expiresIn: "2h"}
        )

        return {token, usuario}
    }

    async hashContraseña(contraseña: string) {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(contraseña, salt)
    }
}