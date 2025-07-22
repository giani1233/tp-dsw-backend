import { Router } from "express";
import { sanitizeLocalidadInput, findAll, findOne, add, update, remove } from "./controlador.localidad.js";

export const rutaLocalidad = Router();

rutaLocalidad.get('/', findAll)
rutaLocalidad.get('/:id', findOne)
rutaLocalidad.post('/', sanitizeLocalidadInput, add)
rutaLocalidad.put('/:id', sanitizeLocalidadInput, update)
rutaLocalidad.patch('/:id', sanitizeLocalidadInput, update)
rutaLocalidad.delete('/:id', remove)