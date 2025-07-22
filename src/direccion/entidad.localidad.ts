import { Cascade, Entity, ManyToOne, Property, Rel, ManyToMany, Collection, OneToMany } from "@mikro-orm/core"
import { EntidadBase } from "../shared/db/entidad.entidadBase.js";
import { Direccion } from "./entidad.direccion.js";
import { Provincia } from "./entidad.provincia.js";
import { triggerAsyncId } from "async_hooks";

@Entity()
export class Localidad extends EntidadBase {

    @Property({nullable: false})
    nombre !: string

    @Property({nullable: false, unique: true})
    codigoPostal !: number

    @OneToMany(() => Direccion, direccion => direccion.localidad, {cascade: [Cascade.ALL]})
    direcciones = new Collection<Direccion>(this)

    @ManyToOne(() => Provincia, {nullable: false})
    provincia !: Rel<Provincia>
}