import cron from 'node-cron';
import { orm } from '../db/orm.js';
import { Evento } from '../../evento/entidad.evento.js';
import { Entrada } from '../../entrada/entidad.entrada.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'cd6a1065880c60',
        pass: '12708818074e88'
    }
})

async function enviarMailRecordatorio(cliente: any, evento: any) {
    const fechaEvento = new Date(evento.fechaInicio).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    const horaEvento = new Date(evento.horaInicio).toLocaleTimeString('es-AR', {
        hour: '2-digit', minute: '2-digit'
    })

    await transporter.sendMail({
        from: '"tp dsw eventos" <noreply@tpdsweventos.com>',
        to: cliente.email,
        subject: `⏰ Tu evento es mañana: ${evento.nombre}`,
        html: `
            <h2>¡Tu evento es mañana!</h2>
            <p>Hola <strong>${cliente.nombre} ${cliente.apellido}</strong>,</p>
            <p>Te recordamos que mañana tenés un evento:</p>
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
            <p style="margin-top: 20px;">¡Nos vemos mañana!</p>
        `
    })
}

export function iniciarJobRecordatorio() {
    cron.schedule('0 * * * *', async () => {
        const em = orm.em.fork();
        try {
            const ahora = new Date();
            const offset = 3 * 60 * 60 * 1000
            const ahoraUTC = new Date(ahora.getTime() - offset);
            const en24hs = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
            const en25hs = new Date(ahora.getTime() + 25 * 60 * 60 * 1000);
            const eventos = await em.find(Evento, {
                fechaInicio: { $gte: en24hs, $lt: en25hs },
                estado: 'aprobado'
            }, { populate: ['direccion', 'direccion.localidad'] });
            for (const evento of eventos) {
                const entradas = await em.find(Entrada, { evento, estado: 'adquirida' }, { populate: ['cliente'] });
                for (const entrada of entradas) {
                    try {
                        await enviarMailRecordatorio(entrada.cliente, evento)
                        console.log(`Recordatorio enviado a: ${entrada.cliente.email}`)
                    } catch (err) {
                        console.error(`Error enviando recordatorio a ${entrada.cliente.email}:`, err)
                    }
                }
            }
        } catch (err) {
            console.error('Error en job de recordatorio:', err)
        }
    })
}