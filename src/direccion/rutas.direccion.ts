import { Router } from "express";
import { sanitizeDireccionInput, findAll, findOne, add, update, remove, getByFilter, findByLocalidad } from "./controlador.direccion.js";

export const rutaDireccion = Router();

rutaDireccion.get('/filtro', getByFilter)
rutaDireccion.get('/', findAll)
rutaDireccion.get('/:id', findOne)
rutaDireccion.get('/localidad/:localidadId', findByLocalidad)
rutaDireccion.post('/', sanitizeDireccionInput, add)
rutaDireccion.put('/:id', sanitizeDireccionInput, update)
rutaDireccion.patch('/:id', sanitizeDireccionInput, update)
rutaDireccion.delete('/:id', remove)