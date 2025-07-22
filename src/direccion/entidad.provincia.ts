import { Cascade, Entity, ManyToOne, Property, Rel, ManyToMany, Collection, OneToMany } from "@mikro-orm/core"
import { EntidadBase } from "../shared/db/entidad.entidadBase.js";
import { Localidad } from "./entidad.localidad.js";

@Entity()
export class Provincia extends EntidadBase {
    
    @Property({nullable: false})
    nombre !: string

    @Property({nullable: false, unique: true})
    codigo !: number

    @OneToMany(() => Localidad, localidad => localidad.provincia, {cascade: [Cascade.ALL]})
    localidades = new Collection<Localidad>(this)
}