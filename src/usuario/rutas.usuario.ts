import { Router } from 'express';
import { sanitizeUsuarioInput, findAll, findAllClientes, findAllOrganizadores, findAllAdministradores, findOneCliente, findOneOrganizador, findOneAdministrador, addCliente, addOrganizador, addAdministrador, updateCliente, updateOrganizador, updateAdministrador, removeCliente, removeOrganizador, removeAdministrador, getByFilter } from './controlador.usuario.js';

export const rutaUsuario = Router();

rutaUsuario.get('/filtro', getByFilter)
rutaUsuario.get('/', findAll)
rutaUsuario.get('/Cliente', findAllClientes)
rutaUsuario.get('/Organizador', findAllOrganizadores)
rutaUsuario.get('/Administrador', findAllAdministradores)
rutaUsuario.get('/Cliente/:id', findOneCliente)
rutaUsuario.get('/Organizador/:id', findOneOrganizador)
rutaUsuario.get('/Administrador/:id', findOneAdministrador)
rutaUsuario.post('/Cliente', sanitizeUsuarioInput, addCliente)
rutaUsuario.post('/Organizador', sanitizeUsuarioInput, addOrganizador)
rutaUsuario.post('/Administrador', sanitizeUsuarioInput, addAdministrador)
rutaUsuario.put('/Cliente/:id', sanitizeUsuarioInput, updateCliente)
rutaUsuario.patch('/Cliente/:id', sanitizeUsuarioInput, updateCliente)
rutaUsuario.put('/Organizador/:id', sanitizeUsuarioInput, updateOrganizador)
rutaUsuario.patch('/Organizador/:id', sanitizeUsuarioInput, updateOrganizador)
rutaUsuario.put('/Administrador/:id', sanitizeUsuarioInput, updateAdministrador)
rutaUsuario.patch('/Administrador/:id', sanitizeUsuarioInput, updateAdministrador)
rutaUsuario.delete('/Cliente/:id', removeCliente)
rutaUsuario.delete('/Organizador/:id', removeOrganizador)
rutaUsuario.delete('/Administrador/:id', removeAdministrador)