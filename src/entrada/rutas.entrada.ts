import { Router } from 'express';
import { sanitizeEntradaInput, findAll, findOne, add, update, remove, findByCliente, reembolsarEntrada } from './controlador.entrada.js';
import { verificarToken, soloAdministrador, soloCliente } from '../autenticacion/middleware.autenticacion.js'

export const rutaEntrada = Router();

rutaEntrada.get('/cliente/:idCliente', verificarToken, soloCliente, findByCliente);
rutaEntrada.post('/:id/reembolsar', verificarToken, soloCliente, reembolsarEntrada);
rutaEntrada.get('/', verificarToken, soloAdministrador, findAll);
rutaEntrada.get('/:id', verificarToken, soloAdministrador, findOne);
rutaEntrada.post('/', verificarToken, soloAdministrador, sanitizeEntradaInput, add);
rutaEntrada.put('/:id', verificarToken, soloAdministrador, sanitizeEntradaInput, update);
rutaEntrada.patch('/:id', verificarToken, soloAdministrador, sanitizeEntradaInput, update);
rutaEntrada.delete('/:id', verificarToken, soloAdministrador, remove);

/* rutaEntrada.get('/cliente/:idCliente', findByCliente);
rutaEntrada.post('/:id/reembolsar', reembolsarEntrada);
rutaEntrada.get('/', findAll);
rutaEntrada.get('/:id', findOne);
rutaEntrada.post('/', sanitizeEntradaInput, add);
rutaEntrada.put('/:id', sanitizeEntradaInput, update);
rutaEntrada.patch('/:id', sanitizeEntradaInput, update);
rutaEntrada.delete('/:id', remove); */