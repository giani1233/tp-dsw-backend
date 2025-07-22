import { Router } from 'express';
import { sanitizeEntradaInput, findAll, findOne, add, update, remove } from './controlador.entrada.js';

export const rutaEntrada = Router();

rutaEntrada.get('/', findAll);
rutaEntrada.get('/:id', findOne);
rutaEntrada.post('/', sanitizeEntradaInput, add);
rutaEntrada.put('/:id', sanitizeEntradaInput, update);
rutaEntrada.patch('/:id', sanitizeEntradaInput, update);
rutaEntrada.delete('/:id', remove);