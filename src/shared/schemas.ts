import { z } from "zod";

export const EventoCreateSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
    descripcion: z.string().min(20, { message: "La descripción debe tener al menos 20 caracteres" }),
    precioEntrada: z.number().nonnegative({ message: "El precio no puede ser negativo" }),
    cantidadCupos: z.number().int().min(1, { message: "La cantidad de cupos debe ser al menos 1" }),
    fechaInicio: z.coerce.date(),
    horaInicio: z.coerce.date(),
    horaFin: z.coerce.date().optional(),
    edadMinima: z.number().int().min(0).optional(),
    claseEvento: z.number().int().positive(),
    organizador: z.number().int().positive(),
    direccion: z.number().int().positive(),
})

export const EventoUpdateSchema = z.object({
    nombre: z.string().min(1).optional(),
    descripcion: z.string().min(20).optional(),
    precioEntrada: z.number().nonnegative().optional(),
    cantidadCupos: z.number().int().min(1).optional(),
    fechaInicio: z.coerce.date().optional(),
    horaInicio: z.coerce.date().optional(),
    horaFin: z.coerce.date().optional(),
    edadMinima: z.number().int().min(0).optional(),
    claseEvento: z.number().int().positive().optional(),
    direccion: z.number().int().positive().optional(),
    estado: z.enum(["pendiente", "aprobado"]).optional(),
    destacado: z.boolean().optional(),
})

export const UsuarioCreateSchema = z.object({
    dni: z.string().length(8, { message: "El DNI debe tener 8 dígitos" }).regex(/^\d+$/, { message: "El DNI puede contener solo números" }),
    nombre: z.string().min(1).regex(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, { message: "El nombre puede contener solo letras y espacios" }),
    apellido: z.string().min(1).regex(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, { message: "El apellido puede contener solo letras y espacios" }),
    email: z.string().email({ message: "El correo electrónico no es válido" }),
    telefono: z.string().min(1).regex(/^\d+$/, { message: "El teléfono puede contener solo números" }),
    contrasena: z.string().min(8).max(20),
    fechaNacimiento: z.coerce.date(),
    empresa: z.string().optional(),
})

export const UsuarioUpdateSchema = UsuarioCreateSchema.partial()

export const ClaseEventoSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
})

export const ProvinciaSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
    codigo: z.number().int().positive({ message: "El código debe ser un número positivo" }),
})

export const LocalidadSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
    codigoPostal: z.string().min(1, { message: "El código postal es obligatorio" }),
    provincia: z.number().int().positive(),
})

export const DireccionSchema = z.object({
    calle: z.string().min(1, { message: "La calle es obligatoria" }),
    altura: z.number().int().positive({ message: "La altura debe ser un número positivo" }),
    detalles: z.string().optional(),
    localidad: z.number().int().positive(),
    lat: z.number().optional(), 
    lng: z.number().optional(),
})

export const PagoSchema = z.object({
    fechaPago: z.coerce.date(),
    monto: z.number().nonnegative({ message: "El monto no puede ser negativo" }),
    entrada: z.number().int().positive(),
})

export const EntradaSchema = z.object({
    estado: z.enum(["adquirida", "reembolsada"]),
    evento: z.number().int().positive(),
    cliente: z.number().int().positive(),
})