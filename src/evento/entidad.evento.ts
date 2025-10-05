import { Cascade, Entity, ManyToOne, Property, Rel, ManyToMany, Collection, OneToMany } from "@mikro-orm/core"
import { EntidadBase } from "../shared/db/entidad.entidadBase.js";
import { ClaseEvento } from "./entidad.claseEvento.js";
import { Entrada } from "../entrada/entidad.entrada.js";
import { Organizador } from "../usuario/entidad.usuario.js";
import { Direccion } from "../direccion/entidad.direccion.js";
import { Dir } from "fs";

@Entity()
export class Evento extends EntidadBase {

    @Property({nullable: false})
    nombre !: string

    @Property({nullable: false})
    descripcion !: string

    @Property({nullable: false})
    precioEntrada !: number

    @Property({nullable: false})
    cantidadCupos !: number

    @Property({nullable: false})
    fechaInicio !: Date

    @Property({nullable: false})
    horaInicio !: Date

    @Property({nullable: true})
    horaFin ?: Date

    @Property({nullable: false})
    cuposDisponibles !: number

    @Property({nullable: true})
    edadMinima ?: number

    @Property({nullable: false})
    estado !: string 

    @Property({nullable: false})
    destacado !: boolean

    @ManyToOne(() => ClaseEvento, {nullable: false})
    claseEvento !: Rel<ClaseEvento>

    @OneToMany(() => Entrada, entrada => entrada.evento, {cascade: [Cascade.ALL]})
    entradas = new Collection<Entrada>(this);

    @ManyToOne(() => Organizador, {nullable: false})
    organizador !: Rel<Organizador>

    @ManyToOne(() => Direccion, {nullable: false})
    direccion !: Rel<Direccion>
}