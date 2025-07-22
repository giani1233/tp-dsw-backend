import { Cascade, Entity, ManyToOne, Property, Rel, ManyToMany, Collection, OneToMany, OneToOne } from "@mikro-orm/core"
import { EntidadBase } from "../shared/db/entidad.entidadBase.js";
import { Entrada } from "../entrada/entidad.entrada.js";

@Entity()
export class Pago extends EntidadBase {

    @Property({nullable: false})
    fechaPago !: Date

    @Property({nullable: false})
    monto !: number

    @OneToOne(() => Entrada, entrada => entrada.pago, {nullable: false, owner: true})
    entrada !: Rel<Entrada>
}