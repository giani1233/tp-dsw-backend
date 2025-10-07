import e, { Request, Response, NextFunction } from 'express';
import { Administrador, Cliente, Organizador, Usuario } from './entidad.usuario.js';
import { orm } from '../shared/db/orm.js';
import { ServiceAutenticacion } from '../autenticacion/service.autenticacion.js';

const em = orm.em;

const serviceAutenticacion = new ServiceAutenticacion(em);

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        id: req.body.id,
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        contrasena: req.body.contrasena,
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

async function findAllClientes(req: Request, res: Response){
    try {
        const clientes = await em.find(Cliente, {});
        res.status(200).json({message: 'Todos los clientes encontrados', data: clientes});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

async function findAllOrganizadores(req: Request, res: Response){
    try {
        const organizadores = await em.find(Organizador, {});
        res.status(200).json({message: 'Todos los organizadores encontrados', data: organizadores});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

async function findAllAdministradores(req: Request, res: Response){
    try {
        const administradores = await em.find(Administrador, {});
        res.status(200).json({message: 'Todos los administradores encontrados', data: administradores});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

async function findOneCliente(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const cliente = await em.findOneOrFail(Cliente, { id })
        res.status(200).json({message: 'Cliente encontrado', data: cliente})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOneOrganizador(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const organizador = await em.findOneOrFail(Organizador, { id })
        res.status(200).json({message: 'Organizador encontrado', data: organizador})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOneAdministrador(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const administrador = await em.findOneOrFail(Administrador, { id })
        res.status(200).json({message: 'Administrador encontrado', data: administrador})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function addCliente(req: Request, res: Response){
    try {
        if (req.body.sanitizedInput.contrasena) {
            req.body.sanitizedInput.contrasena = await serviceAutenticacion.hashContraseña(req.body.sanitizedInput.contrasena)
        }

        const cliente = em.create(Cliente, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Cliente creado', data: cliente})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function addOrganizador(req: Request, res: Response){
    try {
        if (req.body.sanitizedInput.contrasena) {
            req.body.sanitizedInput.contrasena = await serviceAutenticacion.hashContraseña(req.body.sanitizedInput.contrasena)
        }

        const organizador = em.create(Organizador, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Organizador creado', data: organizador})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function addAdministrador(req: Request, res: Response){
    try {
        if (req.body.sanitizedInput.contrasena) {
            req.body.sanitizedInput.contrasena = await serviceAutenticacion.hashContraseña(req.body.sanitizedInput.contrasena)
        }

        const administrador = em.create(Administrador, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Administrador creado', data: administrador})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function updateCliente(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const clienteParaActualizar = await em.findOneOrFail(Cliente, { id })
        em.assign(clienteParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Cliente actualizado', data: clienteParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function updateOrganizador(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const organizadorParaActualizar = await em.findOneOrFail(Organizador, { id })
        em.assign(organizadorParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Organizador actualizado', data: organizadorParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function updateAdministrador(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const administradorParaActualizar = await em.findOneOrFail(Administrador, { id })
        em.assign(administradorParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({message: 'Administrador actualizado', data: administradorParaActualizar})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function removeCliente(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const cliente = em.getReference(Cliente, id)
        await em.removeAndFlush(cliente)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function removeOrganizador(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const organizador = em.getReference(Organizador, id)
        await em.removeAndFlush(organizador)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function removeAdministrador(req: Request, res: Response){
    try {
        const id = Number.parseInt(req.params.id)
        const administrador = em.getReference(Administrador, id)
        await em.removeAndFlush(administrador)
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

export { sanitizeUsuarioInput, findAll, findAllClientes, findAllOrganizadores, findAllAdministradores, findOneCliente, findOneOrganizador, findOneAdministrador, addCliente, addOrganizador, addAdministrador, updateCliente, updateOrganizador, updateAdministrador, removeCliente, removeOrganizador, removeAdministrador };