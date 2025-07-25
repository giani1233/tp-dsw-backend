import { Router } from 'express';
import { sanitizePagoinput, findAll, findOne, add, update, remove } from './controlador.pago.js';

export const rutaPago = Router();

rutaPago.get('/', findAll);
rutaPago.get('/:id', findOne);
rutaPago.post('/', sanitizePagoinput, add);
rutaPago.put('/:id', sanitizePagoinput, update);
rutaPago.patch('/:id', sanitizePagoinput, update);
rutaPago.delete('/:id', remove);