import { Router } from 'express';
import { sanitizeUsuarioInput, findAll, findAllClientes, findAllOrganizadores, findAllAdministradores, findOneCliente, findOneOrganizador, findOneAdministrador, addCliente, addOrganizador, addAdministrador, updateCliente, updateOrganizador, updateAdministrador, removeCliente, removeOrganizador, removeAdministrador, getByFilter } from './controlador.usuario.js';
import { verificarToken, soloAdministrador, soloOrganizadorOAdmin } from '../autenticacion/middleware.autenticacion.js'

export const rutaUsuario = Router();

rutaUsuario.post('/Cliente', sanitizeUsuarioInput, addCliente)
rutaUsuario.post('/Organizador', sanitizeUsuarioInput, addOrganizador)
rutaUsuario.get('/filtro', verificarToken, soloAdministrador, getByFilter)
rutaUsuario.get('/', verificarToken, soloAdministrador, findAll)
rutaUsuario.get('/Cliente', verificarToken, soloAdministrador, findAllClientes)
rutaUsuario.get('/Organizador', verificarToken, soloAdministrador, findAllOrganizadores)
rutaUsuario.get('/Administrador', verificarToken, soloAdministrador, findAllAdministradores)
rutaUsuario.get('/Cliente/:id', verificarToken, soloAdministrador, findOneCliente)
rutaUsuario.get('/Organizador/:id', verificarToken, soloOrganizadorOAdmin, findOneOrganizador)
rutaUsuario.get('/Administrador/:id', verificarToken, soloAdministrador, findOneAdministrador)
rutaUsuario.post('/Administrador', verificarToken, soloAdministrador, sanitizeUsuarioInput, addAdministrador)
rutaUsuario.put('/Cliente/:id', verificarToken, soloAdministrador, sanitizeUsuarioInput, updateCliente)
rutaUsuario.patch('/Cliente/:id', verificarToken, soloAdministrador, sanitizeUsuarioInput, updateCliente)
rutaUsuario.put('/Organizador/:id', verificarToken, soloAdministrador, sanitizeUsuarioInput, updateOrganizador)
rutaUsuario.patch('/Organizador/:id', verificarToken, soloAdministrador, sanitizeUsuarioInput, updateOrganizador)
rutaUsuario.put('/Administrador/:id', verificarToken, soloAdministrador, sanitizeUsuarioInput, updateAdministrador)
rutaUsuario.patch('/Administrador/:id', verificarToken, soloAdministrador, sanitizeUsuarioInput, updateAdministrador)
rutaUsuario.delete('/Cliente/:id', verificarToken, soloAdministrador, removeCliente)
rutaUsuario.delete('/Organizador/:id', verificarToken, soloAdministrador, removeOrganizador)
rutaUsuario.delete('/Administrador/:id', verificarToken, soloAdministrador, removeAdministrador)
