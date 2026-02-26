import { Cascade, Entity, ManyToOne, Property, Rel, ManyToMany, Collection, OneToMany } from "@mikro-orm/core"
import { EntidadBase } from "../shared/db/entidad.entidadBase.js";
import { Evento } from "../evento/entidad.evento.js";
import { Localidad } from "./entidad.localidad.js";

@Entity()
export class Direccion extends EntidadBase {

    @Property({nullable: false})
    calle !: string

    @Property({nullable: false})
    altura !: number

    @Property({nullable: true})
    detalles ?: string

    @Property({nullable: true, type: 'decimal', precision: 10, scale: 6})
    lat!: number

    @Property({nullable: true, type: 'decimal', precision: 10, scale: 6})
    lng!: number 

    @OneToMany(() => Evento, evento => evento.direccion, {cascade: [Cascade.ALL]})
    eventos = new Collection<Evento>(this)

    @ManyToOne(() => Localidad, {nullable: false})
    localidad !: Rel<Localidad>
}