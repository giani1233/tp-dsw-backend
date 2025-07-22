import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./controlador.claseEvento.js";

export const rutaClaseEvento = Router();

rutaClaseEvento.get('/', findAll)
rutaClaseEvento.get('/:id', findOne)
rutaClaseEvento.post('/', add)
rutaClaseEvento.put('/:id', update)
rutaClaseEvento.delete('/:id', remove)