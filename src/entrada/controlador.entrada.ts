import e, { Request, Response, NextFunction, request } from 'express'; 
import { Entrada } from './entidad.entrada.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

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

export { sanitizeEntradaInput, findAll, findOne, add, update, remove }; 

