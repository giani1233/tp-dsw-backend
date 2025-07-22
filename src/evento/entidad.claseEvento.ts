import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection } from '@mikro-orm/core'
import { Evento } from './entidad.evento.js';
import { EntidadBase } from '../shared/db/entidad.entidadBase.js';

@Entity()
export class ClaseEvento extends EntidadBase {
    @Property({nullable: false, unique: true})
    nombre !: string;
    
    @OneToMany(() => Evento, evento => evento.claseEvento, {cascade: [Cascade.ALL]})
    eventos = new Collection<Evento>(this);
}