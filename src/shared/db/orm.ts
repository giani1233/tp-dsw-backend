import { MikroORM } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { MySqlDriver } from "@mikro-orm/mysql";

export const orm = await MikroORM.init({
    entities: ['dist/**/entidad.*.js'],
    entitiesTs: ['src/**/entidad.*.ts'],
    dbName: process.env.DB_NAME,
    driver: MySqlDriver,
    password: process.env.DB_PASSWORD,
    clientUrl: process.env.DB_CLIENT_URL,
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

