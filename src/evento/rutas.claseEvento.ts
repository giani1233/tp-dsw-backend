import { Router } from "express";
import { findAll, findOne, add, update, remove, getByFilter} from "./controlador.claseEvento.js";
import { verificarToken, soloAdministrador } from "../autenticacion/middleware.autenticacion.js";

export const rutaClaseEvento = Router();

rutaClaseEvento.get('/filtro', getByFilter)
rutaClaseEvento.get('/', findAll)
rutaClaseEvento.get('/:id', findOne)
rutaClaseEvento.post('/', verificarToken, soloAdministrador, add)
rutaClaseEvento.put('/:id', verificarToken, soloAdministrador, update)
rutaClaseEvento.delete('/:id', verificarToken, soloAdministrador, remove)
