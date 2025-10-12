import e, { Request, Response, NextFunction, request } from 'express';
import { Direccion } from './entidad.direccion.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em

function sanitizeDireccionInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        id: req.body.id,
        calle: req.body.calle,
        altura: req.body.altura,
        detalles: req.body.detalles,
        localidad: req.body.localidad
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
        const direcciones = await em.find(Direccion, {}, {populate: ['localidad']})
        res.status(200).json({message: 'Todas las direcciones encontradas', data: direcciones})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const direccion = await em.findOneOrFail(Direccion, { id }, {populate: ['localidad']})
        res.status(200).json({message: 'Direccion encontrada', data: direccion})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const direccion = em.create(Direccion, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Direccion creada', data: direccion})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const direccionParaActualizar = await em.findOneOrFail(Direccion, { id })
        em.assign(direccionParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Direccion actualizada', data: direccionParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const direccion = em.getReference(Direccion, id)
        await em.removeAndFlush(direccion)
        res.status(200).json({message: 'Direccion eliminada'})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function getByFilter(req: Request, res: Response) {
    try {
        const busqueda = (req.query.busqueda as string)?.trim() || ''
        if (!busqueda) {
            const direcciones = await em.find(Direccion, {})
            return res.status(200).json({ message: 'Direcciones encontradas', data: direcciones })
        }
        const direcciones = await em.find(Direccion,{calle: {$like: `%${busqueda}%`}}, {populate: ['localidad']})
        res.status(200).json({ message: 'Direcciones encontradas', data: direcciones })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { sanitizeDireccionInput, findAll, findOne, add, update, remove, getByFilter };