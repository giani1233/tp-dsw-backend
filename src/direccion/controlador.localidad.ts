import e, { Request, Response, NextFunction, request } from 'express';
import { Localidad } from './entidad.localidad.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em

function sanitizeLocalidadInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        id: req.body.id,
        nombre: req.body.nombre,
        codigoPostal: req.body.codigoPostal,
        provincia: req.body.provincia
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
        const localidades = await em.find(Localidad, {}, {populate: ['provincia']})
        res.status(200).json({message: 'Todas las localidades encontradas', data: localidades})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const localidad = await em.findOneOrFail(Localidad, { id }, {populate: ['provincia']})
        res.status(200).json({message: 'Localidad encontrada', data: localidad})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const localidad = em.create(Localidad, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Localidad creada', data: localidad})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const localidadParaActualizar = await em.findOneOrFail(Localidad, { id })
        em.assign(localidadParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Localidad actualizada', data: localidadParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const localidad = em.getReference(Localidad, id)
        await em.removeAndFlush(localidad)
        res.status(200).json({message: 'Localidad eliminada'})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}
    
async function getByFilter(req: Request, res: Response) {
    try {
        const busqueda = (req.query.busqueda as string)?.trim() || ''
        if (!busqueda) {
            const localidades = await em.find(Localidad, {})
            return res.status(200).json({ message: 'Localidades encontradas', data: localidades })
        }
        const localidades = await em.find(Localidad,{nombre: {$like: `%${busqueda}%`}}, {populate: ['provincia']})
        res.status(200).json({ message: 'Localidades encontradas', data: localidades })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findByProvincia(req: Request, res: Response) {
    try {
        const provinciaId = Number.parseInt(req.params.provinciaId);
        if (isNaN(provinciaId)) {
        return res.status(400).json({ message: 'ID de provincia inválido', data: [] });
        }
        const localidades = await em.find(Localidad, { provincia: provinciaId }, { populate: ['provincia'] });
        res.status(200).json({ 
        message: localidades.length > 0 ? 'Localidades encontradas' : 'No hay localidades para esta provincia',
        data: localidades 
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message, data: [] });
    }
}

export { sanitizeLocalidadInput, findAll, findOne, add, update, remove, getByFilter, findByProvincia };