import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { rutaEvento } from './evento/rutas.evento.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { rutaClaseEvento } from './evento/rutas.claseEvento.js'
import { rutaEntrada } from './entrada/rutas.entrada.js'
import { rutaUsuario } from './usuario/rutas.usuario.js'
import { rutaPago } from './entrada/rutas.pago.js'
import { rutaDireccion } from './direccion/rutas.direccion.js'
import { rutaLocalidad } from './direccion/rutas.localidad.js'
import { rutaProvincia } from './direccion/rutas.provincia.js'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/api/eventos/clases', rutaClaseEvento)
app.use('/api/eventos/', rutaEvento)
app.use('/api/entradas', rutaEntrada)
app.use('/api/usuarios', rutaUsuario)
app.use('/api/pagos', rutaPago)
app.use('/api/direcciones', rutaDireccion)
app.use('/api/localidades', rutaLocalidad)
app.use('/api/provincias', rutaProvincia)

app.use((req, res) => {
    return res.status(404).send({message: 'Ruta no encontrada'})	
})

await syncSchema()

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
