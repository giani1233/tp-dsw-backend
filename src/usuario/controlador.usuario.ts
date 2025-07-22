import e, { Request, Response, NextFunction } from 'express';
import { Usuario } from './entidad.usuario.js';
import { orm } from '../shared/db/orm.js';
import { appendFile } from 'fs';

const em = orm.em;

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        id: req.body.id,
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        fechaNacimiento: req.body.fechaNacimiento ? new Date(req.body.fechaNacimiento) : undefined,
        empresa: req.body.empresa
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
        const usuarios = await em.find(Usuario, {});
        res.status(200).json({message: 'Todos los usuarios encontrados', data: usuarios});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

async function findOne(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = await em.findOneOrFail(Usuario, { id })
        res.status(200).json({message: 'Usuario encontrado', data: usuario})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response){
    try {
        const usuario = em.create(Usuario, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Usuario creado', data: usuario})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const usuarioParaActualizar = await em.findOneOrFail(Usuario, { id })
        em.assign(usuarioParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Usuario actualizado', data: usuarioParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = em.getReference(Usuario, id)
        await em.removeAndFlush(usuario)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

export { sanitizeUsuarioInput, findAll, findOne, add, update, remove };