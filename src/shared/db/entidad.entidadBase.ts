import { PrimaryKey } from "@mikro-orm/core";


export abstract class EntidadBase {
    @PrimaryKey()
    id ?: number
}