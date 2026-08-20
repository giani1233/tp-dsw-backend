import { Router } from 'express';
import { sanitizePagoinput, findAll, findOne, add, update, remove, crearPreferenciaMP, recibirNotificacionMP } from './controlador.pago.js';
import { verificarToken, soloAdministrador, soloCliente } from '../autenticacion/middleware.autenticacion.js'

export const rutaPago = Router();

rutaPago.get('/success', (req, res) => {
    res.redirect(`https://tp-dsw-eventos.vercel.app/success?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/failure', (req, res) => {
    res.redirect(`https://tp-dsw-eventos.vercel.app/failure?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/pending', (req, res) => {
    res.redirect(`https://tp-dsw-eventos.vercel.app/pending?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.post('/notificacion', recibirNotificacionMP);
rutaPago.post('/crear-preferencia', verificarToken, soloCliente, crearPreferenciaMP);
rutaPago.get('/', verificarToken, soloAdministrador, findAll);
rutaPago.get('/:id', verificarToken, soloAdministrador, findOne);
rutaPago.post('/', verificarToken, soloAdministrador, sanitizePagoinput, add);
rutaPago.put('/:id', verificarToken, soloAdministrador, sanitizePagoinput, update);
rutaPago.patch('/:id', verificarToken, soloAdministrador, sanitizePagoinput, update);
rutaPago.delete('/:id', verificarToken, soloAdministrador, remove);

/* rutaPago.get('/success', (req, res) => {
    res.redirect(`https://tp-dsw-eventos.vercel.app/success?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/failure', (req, res) => {
    res.redirect(`https://tp-dsw-eventos.vercel.app/failure?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/pending', (req, res) => {
    res.redirect(`https://tp-dsw-eventos.vercel.app/pending?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/', findAll);
rutaPago.get('/:id', findOne);
rutaPago.post('/', sanitizePagoinput, add);
rutaPago.put('/:id', sanitizePagoinput, update);
rutaPago.patch('/:id', sanitizePagoinput, update);
rutaPago.delete('/:id', remove);
rutaPago.post('/crear-preferencia', crearPreferenciaMP);
rutaPago.post('/notificacion', recibirNotificacionMP); */