import { Router } from "express";
import { sanitizeLocalidadInput, findAll, findOne, add, update, remove, getByFilter, findByProvincia } from "./controlador.localidad.js";
import { verificarToken, soloAdministrador } from "../autenticacion/middleware.autenticacion.js";

export const rutaLocalidad = Router();

rutaLocalidad.get('/filtro', getByFilter)
rutaLocalidad.get('/', findAll)
rutaLocalidad.get('/provincia/:provinciaId', findByProvincia);
rutaLocalidad.get('/:id', findOne)
rutaLocalidad.post('/', verificarToken, soloAdministrador, sanitizeLocalidadInput, add)
rutaLocalidad.put('/:id', verificarToken, soloAdministrador, sanitizeLocalidadInput, update)
rutaLocalidad.patch('/:id', verificarToken, soloAdministrador, sanitizeLocalidadInput, update)
rutaLocalidad.delete('/:id', verificarToken, soloAdministrador, remove) 
