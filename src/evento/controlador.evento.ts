import e, { Request, Response, NextFunction, request } from 'express';
import { Evento } from './entidad.evento.js';
import { orm } from '../shared/db/orm.js';
import { Organizador } from '../usuario/entidad.usuario.js';
import { Direccion } from '../direccion/entidad.direccion.js';

const em = orm.em

function sanitizeEventoInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precioEntrada: req.body.precioEntrada,
        cantidadCupos: req.body.cantidadCupos,
        fechaInicio: req.body.fechaInicio ? new Date(req.body.fechaInicio) : undefined,
        horaInicio: req.body.horaInicio ? new Date(req.body.horaInicio) : undefined,
        horaFin: req.body.horaFin ? new Date(req.body.horaFin) : undefined,
        cuposDisponibles: req.body.cuposDisponibles,
        edadMinima: req.body.edadMinima,
        estado: req.body.estado,
        destacado: req.body.destacado,
        claseEvento: req.body.claseEvento,
        organizador: req.body.organizador,
        direccion: req.body.direccion,
    }
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function findAll(req: Request, res: Response){
    try {
        const eventos = await em.find(Evento, {}, {populate: ['claseEvento', 'organizador', 'direccion']})
        res.status(200).json({message: 'Todos los eventos encontrados', data: eventos})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const evento = await em.findOneOrFail(Evento, { id }, {populate: ['claseEvento', 'organizador', 'direccion']})
        res.status(200).json({message: 'Evento encontrado', data: evento})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const evento = em.create(Evento, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Evento creado', data: evento})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const eventoParaActualizar = await em.findOneOrFail(Evento, { id })
        em.assign(eventoParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Evento actualizado', data: eventoParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const evento = em.getReference(Evento, id)
        await em.removeAndFlush(evento)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findPendientes(req: Request, res: Response) {
    try {
        const eventos = await em.find(Evento, { estado: 'pendiente' }, { populate: ['claseEvento', 'organizador', 'direccion', 'direccion.localidad'] });
        res.status(200).json({ message: 'Eventos pendientes encontrados', data: eventos });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findAprobados(req: Request, res: Response) {
    try {
        const hoyString = new Date().toISOString().split('T')[0];
        const hoy = new Date(hoyString);
        const eventos = await em.find(Evento, {estado: 'aprobado', fechaInicio: { $gte: hoy }}, {populate: ['claseEvento', 'organizador', 'direccion', 'direccion.localidad'], orderBy: { fechaInicio: 'ASC' }});
        res.status(200).json({ message: 'Eventos aprobados encontrados', data: eventos });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export { sanitizeEventoInput, findAll, findOne, add, update, remove, findPendientes, findAprobados };
