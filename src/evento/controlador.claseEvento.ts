import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { ClaseEvento } from './entidad.claseEvento.js';

const em = orm.em

async function findAll(req: Request, res: Response){
    try {
        const claseEvento = await em.find(ClaseEvento, {})
        res.status(200).json({message: 'todas las clases de evento encontradas', data: claseEvento});
    } catch (error: any) 
    {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id);
        const claseEvento = await em.findOneOrFail(ClaseEvento, { id });
        res.status(200).json({message: 'Clase de evento encontrada', data: claseEvento});
    } catch (error: any)
    {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const claseEvento = em.create(ClaseEvento, req.body)
        await em.flush();
        res.status(201).json({message: 'Clase de evento creada', data: claseEvento});
    } catch (error: any)
    {
        res.status(500).json({message: error.message});
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id);
        const claseEvento = await em.getReference(ClaseEvento, id);
        em.assign(claseEvento, req.body);
        await em.flush();
        res.status(200).json({message: 'Clase de evento actualizada'});
    } catch (error: any)
    {
        res.status(500).json({message: error.message});
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id);
        const claseEvento = em.getReference(ClaseEvento, id);
        await em.removeAndFlush(claseEvento);
        res.status(200).json({message: 'Clase de evento eliminada'});
    } catch (error: any)
    {
        res.status(500).json({message: error.message});
    }
}

export { findAll, findOne, add, update, remove };