import e, { Request, Response, NextFunction, request } from 'express';
import { Provincia } from './entidad.provincia.js'; 
import { orm } from '../shared/db/orm.js';

const em = orm.em

function sanitizeProvinciaInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        id: req.body.id,
        nombre: req.body.nombre,
        codigo: req.body.codigo
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
        const provincias = await em.find(Provincia, {})
        res.status(200).json({message: 'Todas las provincias encontradas', data: provincias})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const provincia = await em.findOneOrFail(Provincia, { id })
        res.status(200).json({message: 'Provincia encontrada', data: provincia})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const provincia = em.create(Provincia, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Provincia creada', data: provincia})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const provinciaParaActualizar = await em.findOneOrFail(Provincia, { id })
        em.assign(provinciaParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Provincia actualizada', data: provinciaParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const provincia = em.getReference(Provincia, id)
        await em.removeAndFlush(provincia)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

export { sanitizeProvinciaInput, findAll, findOne, add, update, remove };