import { Router } from "express";
import { sanitizeDireccionInput, findAll, findOne, add, update, remove, getByFilter, findByLocalidad } from "./controlador.direccion.js";
import { verificarToken, soloAdministrador } from "../autenticacion/middleware.autenticacion.js";

export const rutaDireccion = Router();

rutaDireccion.get('/filtro', getByFilter)
rutaDireccion.get('/', findAll)
rutaDireccion.get('/:id', findOne)
rutaDireccion.get('/localidad/:localidadId', findByLocalidad)
rutaDireccion.post('/', verificarToken, soloAdministrador, sanitizeDireccionInput, add)
rutaDireccion.put('/:id', verificarToken, soloAdministrador, sanitizeDireccionInput, update)
rutaDireccion.patch('/:id', verificarToken, soloAdministrador, sanitizeDireccionInput, update)
rutaDireccion.delete('/:id', verificarToken, soloAdministrador, remove) 
