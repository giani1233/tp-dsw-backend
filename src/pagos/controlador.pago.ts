import e, { Request, Response, NextFunction, request } from 'express'; 
import { Pago } from './entidad.pago.js';
import { orm } from '../shared/db/orm.js';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import { Entrada } from '../entrada/entidad.entrada.js'
import { Evento } from '../evento/entidad.evento.js';
import { Usuario } from '../usuario/entidad.usuario.js';

const em = orm.em

const mpclient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "APP_USR-3257636109634727-101615-572da9859e58c5a8997772003e1cd710-2930382396"
})
const paymentService = new Payment(mpclient)

function sanitizePagoinput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        id: req.body.id,
        fechaPago: req.body.fechaPago ? new Date(req.body.fechaPago) : undefined,
        monto: req.body.monto,
        entrada: req.body.entrada
    }
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function crearPreferenciaMP(req: Request, res: Response){
    try {
        const { titulo, monto, cantidad, idEvento, idUsuario } = req.body;

        if (!idEvento || !idUsuario || !monto) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const preferencia = new Preference(mpclient);

        const result = await preferencia.create({
            body: {
                items: [
                    {
                        id: idEvento.toString(),
                        title: titulo || 'Pago de entrada',
                        quantity: Number(cantidad) || 1,
                        unit_price: Number(monto) || 0,
                        currency_id: 'ARS'
                    }
                ],
                back_urls: {
                    success: 'https://arrhythmical-marcene-preeternal.ngrok-free.dev/success/',
                    failure: 'https://arrhythmical-marcene-preeternal.ngrok-free.dev/failure/',
                    pending: 'https://arrhythmical-marcene-preeternal.ngrok-free.dev/pending/',
                },
                auto_return: 'approved',
                notification_url: 'http://localhost:3000/api/pagos/notificacion',
                metadata: { idEvento, idUsuario }
            }
        });

        res.status(201).json({ id: result.id });
    } catch (error: any) {
        console.error('Error creando preferencia:', error);
        res.status(500).json({ message: error.message });
    }    
}


async function recibirNotificacionMP(req: Request, res: Response){
    console.log('Notificación recibida:', req.body);
    try {
        const data = req.body

        if(data.action === 'payment.created' || data.action === 'payment.updated'){
            const pagoData = data.data
            
            if (pagoData.status === 'approved') {
                const idEvento = pagoData.metadata.idEvento;   
                const idUsuario = pagoData.metadata.idUsuario;
                const evento = await em.findOneOrFail(Evento, { id: idEvento });
                const usuario = await em.findOneOrFail(Usuario, { id: idUsuario });

                const entrada = em.create(Entrada, {
                    estado: 'adquirida',
                    evento: evento,
                    cliente: usuario
                });

                await em.flush();
                const nuevoPago = em.create(Pago, {
                    fechaPago: new Date(),
                    monto: pagoData.transaction_amount,
                    entrada: entrada
                });
                await em.flush();
            }
        }
        res.status(200).json({ message: 'Notificación recibida' });
    } catch (error: any) {
        console.error('Error recibiendo notificación de Mercado Pago:', error);
        res.status(500).json({ message: error.message });
    }
}

async function findAll(req: Request, res: Response){
    try {
        const pagos = await em.find(Pago, {}, {populate: ['entrada']})
        res.status(200).json({message: 'Todos los pagos encontrados', data: pagos})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const pago = await em.findOneOrFail(Pago, { id }, {populate: ['entrada']})
        res.status(200).json({message: 'Pago encontrado', data: pago})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const pago = em.create(Pago, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Pago creado', data: pago})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const pagoParaActualizar = await em.findOneOrFail(Pago, { id })
        em.assign(pagoParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Pago actualizado', data: pagoParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const pago = em.getReference(Pago, id)
        await em.removeAndFlush(pago)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

export { sanitizePagoinput, findAll, findOne, add, update, remove, crearPreferenciaMP, recibirNotificacionMP }; 