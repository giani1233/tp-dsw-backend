import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/**/entidad.*.js'],
    entitiesTs: ['src/**/entidad.*.ts'],
    dbName: 'hc4gmo', 
    type : 'mysql',
    password: '1234',
    clientUrl: 'mysql://dsw:dsw@localhost:3306/hc4gmo',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    }
});

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
}

