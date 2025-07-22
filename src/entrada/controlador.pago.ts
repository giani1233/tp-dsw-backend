import e, { Request, Response, NextFunction, request } from 'express'; 
import { Pago } from './entidad.pago.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em

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

export { sanitizePagoinput, findAll, findOne, add, update, remove }; 