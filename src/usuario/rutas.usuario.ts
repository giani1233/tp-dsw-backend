import { Router } from 'express';
import { sanitizeUsuarioInput, findAll, findOne, add, update, remove } from './controlador.usuario.js';

export const rutaUsuario = Router();

rutaUsuario.get('/', findAll)
rutaUsuario.get('/:id', findOne)
rutaUsuario.post('/', sanitizeUsuarioInput, add)
rutaUsuario.put('/:id', sanitizeUsuarioInput, update)
rutaUsuario.patch('/:id', sanitizeUsuarioInput, update)
rutaUsuario.delete('/:id', remove)