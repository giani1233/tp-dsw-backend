import { Router } from 'express';
import { sanitizePagoinput, findAll, findOne, add, update, remove, crearPreferenciaMP, recibirNotificacionMP } from './controlador.pago.js';

export const rutaPago = Router();

rutaPago.get('/success', (req, res) => {
    res.redirect(`http://localhost:5173/success?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/failure', (req, res) => {
    res.redirect(`http://localhost:5173/failure?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/pending', (req, res) => {
    res.redirect(`http://localhost:5173/pending?${new URLSearchParams(req.query as any).toString()}`);
});
rutaPago.get('/', findAll);
rutaPago.get('/:id', findOne);
rutaPago.post('/', sanitizePagoinput, add);
rutaPago.put('/:id', sanitizePagoinput, update);
rutaPago.patch('/:id', sanitizePagoinput, update);
rutaPago.delete('/:id', remove);
rutaPago.post('/crear-preferencia', crearPreferenciaMP);
rutaPago.post('/notificacion', recibirNotificacionMP);