import { Request, Response } from 'express'
import { ServiceAutenticacion } from '../autenticacion/service.autenticacion.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em.fork()

export class ControladorAutenticacion {

    static async login(req: Request, res: Response) {
        const { email, contrasena } = req.body 

        if (!email || !contrasena) {
            return res.status(400).json({ message: "Email y contraseña requeridos"})
        }

        try {
            const serviceAutenticacion = new ServiceAutenticacion(em)
            const {token, usuario} = await serviceAutenticacion.login(email, contrasena)

            res.json({ token })
            
        } catch (error:any) {
            res.status(401).json({ message: error.message })
        }
    }
}