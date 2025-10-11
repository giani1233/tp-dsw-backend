import { Router } from "express";
import { findAll, findOne, add, update, remove, getByFilter} from "./controlador.claseEvento.js";


export const rutaClaseEvento = Router();

rutaClaseEvento.get('/filtro', getByFilter)
rutaClaseEvento.get('/', findAll)
rutaClaseEvento.get('/:id', findOne)
rutaClaseEvento.post('/', add)
rutaClaseEvento.put('/:id', update)
rutaClaseEvento.delete('/:id', remove)