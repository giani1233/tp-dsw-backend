import { Router } from "express";
import { sanitizeProvinciaInput, findAll, findOne, add, update, remove, getByFilter } from "./controlador.provincia.js";

export const rutaProvincia = Router();

rutaProvincia.get('/filtro', getByFilter)
rutaProvincia.get('/', findAll)
rutaProvincia.get('/:id', findOne)
rutaProvincia.post('/', sanitizeProvinciaInput, add)
rutaProvincia.put('/:id', sanitizeProvinciaInput, update)
rutaProvincia.patch('/:id', sanitizeProvinciaInput, update)
rutaProvincia.delete('/:id', remove)