import { Router } from "express";
import { sanitizeEventoInput, findAll, findOne, add, update, remove, findAprobados, findPendientes } from "./controlador.evento.js";

export const rutaEvento = Router();

rutaEvento.get('/', findAll)
rutaEvento.get('/pendientes', findPendientes)
rutaEvento.get('/aprobados', findAprobados)
rutaEvento.get('/:id', findOne)
rutaEvento.post('/', sanitizeEventoInput, add)
rutaEvento.put('/:id', sanitizeEventoInput, update)
rutaEvento.patch('/:id', sanitizeEventoInput, update)
rutaEvento.delete('/:id', remove)
