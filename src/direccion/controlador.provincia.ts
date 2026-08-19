import { Request, Response, NextFunction } from 'express';
import { Provincia } from './entidad.provincia.js'; 
import { orm } from '../shared/db/orm.js';
import { ProvinciaSchema } from '../shared/schemas.js';

const em = orm.em

function sanitizeProvinciaInput(req: Request, res: Response, next: NextFunction) {
    const schema = req.method === 'POST' ? ProvinciaSchema : ProvinciaSchema.partial()
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: result.error.flatten().fieldErrors })
    }
    req.body.sanitizedInput = result.data
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
        res.status(200).json({message: 'Provincia eliminada'})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function getByFilter(req: Request, res: Response) {
    try {
        const busqueda = (req.query.busqueda as string)?.trim() || ''
        if (!busqueda) {
            const provincias = await em.find(Provincia, {})
            return res.status(200).json({ message: 'Provincias encontradas', data: provincias })
        }
        const provincias = await em.find(Provincia,{nombre: {$like: `%${busqueda}%`}})
        res.status(200).json({ message: 'Provincias encontradas', data: provincias })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { sanitizeProvinciaInput, findAll, findOne, add, update, remove, getByFilter };