import { Cascade, Entity, ManyToOne, Property, Rel, ManyToMany, OneToOne } from "@mikro-orm/core";
import { EntidadBase } from "../shared/db/entidad.entidadBase.js";
import { Evento } from "../evento/entidad.evento.js";
import { Cliente } from "../usuario/entidad.usuario.js";
import { Pago } from "../pagos/entidad.pago.js";

@Entity()
export class Entrada extends EntidadBase {

    @Property({ nullable: false })
    estado !: string;

    @ManyToOne(() => Evento, { nullable: false })
    evento !: Rel<Evento>;

    @ManyToOne(() => Cliente, { nullable: false })
    cliente !: Rel<Cliente>;

    @OneToOne(() => Pago, pago => pago.entrada, {nullable: true})
    pago ?: Rel<Pago>
}