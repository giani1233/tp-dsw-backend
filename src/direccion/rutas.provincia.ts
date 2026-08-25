import { Router } from "express";
import { sanitizeProvinciaInput, findAll, findOne, add, update, remove, getByFilter } from "./controlador.provincia.js";
import { verificarToken, soloAdministrador } from "../autenticacion/middleware.autenticacion.js";

export const rutaProvincia = Router();

rutaProvincia.get('/filtro', getByFilter)
rutaProvincia.get('/', findAll)
rutaProvincia.get('/:id', findOne)
rutaProvincia.post('/', verificarToken, soloAdministrador, sanitizeProvinciaInput, add)
rutaProvincia.put('/:id', verificarToken, soloAdministrador, sanitizeProvinciaInput, update)
rutaProvincia.patch('/:id', verificarToken, soloAdministrador, sanitizeProvinciaInput, update)
rutaProvincia.delete('/:id', verificarToken, soloAdministrador, remove)
