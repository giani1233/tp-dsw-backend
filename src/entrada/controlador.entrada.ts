import e, { Request, Response, NextFunction, request } from 'express'; 
import { Entrada } from './entidad.entrada.js';
import { orm } from '../shared/db/orm.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'cd6a1065880c60',
        pass: '12708818074e88'
    }
})

const em = orm.em;

async function enviarMailReembolso(cliente: any, evento: any) {
    const fechaEvento = new Date(evento.fechaInicio).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric'
    })

    await transporter.sendMail({
        from: '"tp dsw eventos" <noreply@tpdsweventos.com>',
        to: cliente.email,
        subject: `Reembolso procesado: ${evento.nombre}`,
        html: `
            <h2>Tu reembolso fue procesado</h2>
            <p>Hola <strong>${cliente.nombre} ${cliente.apellido}</strong>,</p>
            <p>Tu entrada para el siguiente evento fue reembolsada exitosamente:</p>
            <table style="border-collapse: collapse; width: 100%">
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Evento</td>
                    <td style="padding: 8px;">${evento.nombre}</td>
                </tr>
                <tr style="background: #f5f5f5">
                    <td style="padding: 8px; font-weight: bold;">Fecha</td>
                    <td style="padding: 8px;">${fechaEvento}</td>
                </tr>
            </table>
            <p>Próximamente el dinero se acreditara en tu billetera virtual</p>
            <p style="margin-top: 20px;">Si tenés alguna duda, comunicate con nosotros.</p>
        `
    })
}

function sanitizeEntradaInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        id: req.body.id,
        estado: req.body.estado,
        evento: req.body.evento,
        cliente: req.body.cliente
    }
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key]
        }
    })
    next();
}

async function findAll(req: Request, res: Response){
    try {
        const entradas = await em.find(Entrada, {}, {populate: ['evento', 'cliente']})
        res.status(200).json({message: 'Todas las entradas encontradas', data: entradas})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const entrada = await em.findOneOrFail(Entrada, { id }, {populate: ['evento', 'cliente']})
        res.status(200).json({message: 'Entrada encontrada', data: entrada})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const entrada = em.create(Entrada, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Entrada creada', data: entrada})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const entradaParaActualizar = await em.findOneOrFail(Entrada, { id })
        em.assign(entradaParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Entrada actualizada', data: entradaParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const entrada = em.getReference(Entrada, id)
        await em.removeAndFlush(entrada)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findByCliente(req: Request, res: Response) {
    try {
        const idCliente = Number.parseInt(req.params.idCliente);
        const entradas = await em.find(Entrada, { cliente: idCliente, estado: 'adquirida' }, { populate: ['evento', 'cliente'] });
        res.status(200).json({ message: 'Entradas encontradas para el cliente', data: entradas });
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function reembolsarEntrada(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const entrada = await em.findOneOrFail(Entrada, { id }, {populate: ['evento', 'cliente']})
        if (entrada.estado === 'reembolsada') {
            return res.status(400).json({ message: 'Esta entrada ya fue reembolsada' })
        }
        entrada.estado = 'reembolsada'
        entrada.evento.cuposDisponibles += 1
        await em.flush()
        try {
            await enviarMailReembolso(entrada.cliente, entrada.evento)
            console.log('Mail de reembolso enviado a:', entrada.cliente.email)
        } catch (mailError) {
            console.error('Error enviando mail de reembolso:', mailError)
        }
        res.status(200).json({ message: 'Entrada reembolsada', data: entrada })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { sanitizeEntradaInput, findAll, findOne, add, update, remove, findByCliente, reembolsarEntrada }; 

