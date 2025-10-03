import { Cascade, Entity, ManyToOne, Property, Rel, OneToMany, Collection } from "@mikro-orm/core";
import { EntidadBase } from "../shared/db/entidad.entidadBase.js";
import { Entrada } from "../entrada/entidad.entrada.js";
import { Evento } from "../evento/entidad.evento.js";

@Entity({discriminatorColumn: 'tipo', discriminatorValue: 'usuario', abstract: true})
export abstract class Usuario extends EntidadBase {

    @Property({ nullable: false, unique: true })
    dni !: string

    @Property({ nullable: false })
    nombre !: string

    @Property({ nullable: false })
    apellido !: string

    @Property({ nullable: false, unique: true})
    email !: string

    @Property({ nullable: false, unique: true })
    telefono !: string

    @Property({ nullable: false})
    tipo !: string

    @Property({ nullable: false })
    contrasena !: string;
}

@Entity({ discriminatorValue: 'cliente' })
export class Cliente extends Usuario {

    @Property({ nullable: false })
    fechaNacimiento !: Date;

    @OneToMany(() => Entrada, entrada => entrada.cliente, { cascade: [Cascade.ALL] })
    entradas = new Collection<Entrada>(this);
}

@Entity({ discriminatorValue: 'organizador' })
export class Organizador extends Usuario {

    @Property({ nullable: true })
    empresa ?: string;

    @OneToMany(() => Evento, evento => evento.organizador, { cascade: [Cascade.ALL] })
    eventos = new Collection<Evento>(this);
}

@Entity({ discriminatorValue: 'administrador' })
export class Administrador extends Usuario {

}