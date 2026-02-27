import { Router } from 'express';
import { sanitizeEntradaInput, findAll, findOne, add, update, remove, findByCliente, reembolsarEntrada } from './controlador.entrada.js';

export const rutaEntrada = Router();

rutaEntrada.get('/cliente/:idCliente', findByCliente);
rutaEntrada.post('/:id/reembolsar', reembolsarEntrada);
rutaEntrada.get('/', findAll);
rutaEntrada.get('/:id', findOne);
rutaEntrada.post('/', sanitizeEntradaInput, add);
rutaEntrada.put('/:id', sanitizeEntradaInput, update);
rutaEntrada.patch('/:id', sanitizeEntradaInput, update);
rutaEntrada.delete('/:id', remove);