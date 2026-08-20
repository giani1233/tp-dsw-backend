import { Router } from "express";
import { sanitizeEventoInput, findAll, findOne, add, update, remove, findAprobados, findPendientes, findDestacados, findPorOrganizador, findAprobadosParaMapa } from "./controlador.evento.js";
import { verificarToken, soloAdministrador, soloOrganizador } from '../autenticacion/middleware.autenticacion.js'

export const rutaEvento = Router();

rutaEvento.get('/aprobados', findAprobados)
rutaEvento.get('/destacados', findDestacados)
rutaEvento.get('/aprobados-para-mapa', findAprobadosParaMapa)
rutaEvento.get('/organizador/:idOrganizador', verificarToken, findPorOrganizador)
rutaEvento.get('/', verificarToken, soloAdministrador, findAll)
rutaEvento.get('/pendientes', verificarToken, soloAdministrador, findPendientes)
rutaEvento.get('/:id', verificarToken, soloAdministrador, findOne)
rutaEvento.put('/:id', verificarToken, soloAdministrador, sanitizeEventoInput, update)
rutaEvento.patch('/:id', verificarToken, soloAdministrador, sanitizeEventoInput, update)
rutaEvento.delete('/:id', verificarToken, soloAdministrador, remove)
rutaEvento.post('/', verificarToken, soloOrganizador, sanitizeEventoInput, add)


/* rutaEvento.get('/', findAll)
rutaEvento.get('/organizador/:idOrganizador', findPorOrganizador)
rutaEvento.get('/aprobados-para-mapa', findAprobadosParaMapa)
rutaEvento.get('/pendientes', findPendientes)
rutaEvento.get('/aprobados', findAprobados)
rutaEvento.get('/destacados', findDestacados)
rutaEvento.get('/:id', findOne)
rutaEvento.post('/', sanitizeEventoInput, add)
rutaEvento.put('/:id', sanitizeEventoInput, update)
rutaEvento.patch('/:id', sanitizeEventoInput, update)
rutaEvento.delete('/:id', remove)
 */