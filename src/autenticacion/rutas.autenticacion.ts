import { Router } from "express"
import { ControladorAutenticacion } from "./controlador.autenticacion.js"

export const rutaAutenticacion = Router()

rutaAutenticacion.post("/login", ControladorAutenticacion.login)