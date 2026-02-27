import e, { Request, Response, NextFunction, request } from 'express'; 
import { Pago } from './entidad.pago.js';
import { orm } from '../shared/db/orm.js';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import { Entrada } from '../entrada/entidad.entrada.js'
import { Evento } from '../evento/entidad.evento.js';
import { Cliente } from '../usuario/entidad.usuario.js';
import nodemailer from 'nodemailer';

const em = orm.em

const mpclient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "APP_USR-3257636109634727-101615-572da9859e58c5a8997772003e1cd710-2930382396"
})
const paymentService = new Payment(mpclient)

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'cd6a1065880c60',
        pass: '12708818074e88'
    }
})

async function enviarMailConfirmacion(cliente: any, evento: any) {
    const fechaEvento = new Date(evento.fechaInicio).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    const horaEvento = new Date(evento.horaInicio).toLocaleTimeString('es-AR', {
        hour: '2-digit', minute: '2-digit'
    })
    await transporter.sendMail({
        from: '"tp dsw eventos" <noreply@tpdsweventos.com>',
        to: cliente.email,
        subject: `✅ Entrada confirmada: ${evento.nombre}`,
        html: `
            <h2>¡Tu entrada fue confirmada!</h2>
            <p>Hola <strong>${cliente.nombre} ${cliente.apellido}</strong>,</p>
            <p>Tu compra fue procesada exitosamente. Acá están los detalles:</p>
            <table style="border-collapse: collapse; width: 100%">
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Evento</td>
                    <td style="padding: 8px;">${evento.nombre}</td>
                </tr>
                <tr style="background: #f5f5f5">
                    <td style="padding: 8px; font-weight: bold;">Fecha</td>
                    <td style="padding: 8px;">${fechaEvento}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Hora</td>
                    <td style="padding: 8px;">${horaEvento}hs</td>
                </tr>
                <tr style="background: #f5f5f5">
                    <td style="padding: 8px; font-weight: bold;">Dirección</td>
                    <td style="padding: 8px;">${evento.direccion?.calle} ${evento.direccion?.altura}, ${evento.direccion?.localidad?.nombre}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">¡Nos vemos en el evento!</p>`
    })
}

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

        const evento = await em.findOneOrFail(Evento, { id: idEvento });
        if (evento.cuposDisponibles <= 0) {
            return res.status(400).json({ message: 'No hay cupos disponibles para este evento' });
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
                    success: 'https://arrhythmical-marcene-preeternal.ngrok-free.dev/api/pagos/success/',
                    failure: 'https://arrhythmical-marcene-preeternal.ngrok-free.dev/api/pagos/failure/',
                    pending: 'https://arrhythmical-marcene-preeternal.ngrok-free.dev/api/pagos/pending/',
                },
                auto_return: 'approved',
                notification_url: 'https://arrhythmical-marcene-preeternal.ngrok-free.dev/api/pagos/notificacion',
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
            const pagoMp = await paymentService.get({ id: data.data.id });
            
            if (pagoMp.status === 'approved') {
                const idEvento = pagoMp.metadata.id_evento;   
                const idUsuario = pagoMp.metadata.id_usuario;
                const evento = await em.findOneOrFail(Evento, { id: idEvento }, { populate: ['direccion', 'direccion.localidad'] });
                const cliente = await em.findOneOrFail(Cliente, { id: idUsuario });

                if (evento.cuposDisponibles <= 0) {
                    return res.status(400).json({ message: 'No hay cupos disponibles para este evento' });
                }

                const entrada = em.create(Entrada, {
                    estado: 'adquirida',
                    evento,
                    cliente,
                });

                evento.cuposDisponibles -= 1;

                await em.flush();
                const nuevoPago = em.create(Pago, {
                    fechaPago: new Date(),
                    monto: pagoMp.transaction_amount ?? 0,
                    entrada: entrada
                });
                await em.flush();
                try {
                    await enviarMailConfirmacion(cliente, evento)
                    console.log('Mail enviado a:', cliente.email)
                } catch (mailError) {
                    console.error('Error enviando mail:', mailError)
                }
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