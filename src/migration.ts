import * as Knex from "knex";
import { StatusCode } from "./util";

export function primaryUUID(
  knex: Knex,
  table: Knex.CreateTableBuilder,
  primaryKey = "id"
) {
  return table.uuid(primaryKey).primary()
    .defaultTo(knex.raw("uuid_generate_v1mc()"));
}

export function timestamps(knex: Knex, table: Knex.CreateTableBuilder) {

  table.timestamp("createdAt").defaultTo(knex.fn.now());
  table.timestamp("updatedAt").defaultTo(knex.fn.now());
}

export function baseModelColumns(knex: Knex, table: Knex.CreateTableBuilder) {
  timestamps(knex, table);
  table.uuid("createdBy");
  table.uuid("updatedBy");
}

export function fileColumns(_knex: Knex, table: Knex.CreateTableBuilder, name = "file") {
  table.binary(`${name}Data`);
  table.text(`${name}Name`).notNullable().defaultTo("");
  table.text(`${name}Extension`).notNullable().defaultTo("");
}

export function createOrderIndex(knex: Knex, options: {
  tableName: string,
  schemaName: string,
  columnName: string,
  descending?: boolean,
  nullLast?: boolean
}): any {

  return knex.raw(`CREATE INDEX ${options.tableName}_${options.columnName}
    ON "${options.schemaName}".${options.tableName} ("${options.columnName}"
    ${options.descending ? "DESC" : "ASC"} NULLS ${options.nullLast ? "LAST" : "FIRST"})`);
}

export function createTimestampIndexes(
  knex: Knex, schemaName: string, tableName: string): Promise<any> {
  return Promise.all([
    createOrderIndex(knex, { tableName, schemaName, columnName: "createdAt" }),
    createOrderIndex(knex, { tableName, schemaName, columnName: "updatedAt" }),
  ]);
}

export function resetSequence(knex: Knex, name: string, startValue = 1): Knex.Raw {
  return knex.raw(`ALTER SEQUENCE ${name} RESTART WITH ${startValue}`);
}

export function createFileTable(knex: Knex, schemaName: string, tableName: string): Knex.SchemaBuilder {

  return knex.schema.withSchema(schemaName)
    .createTable(tableName, (table) => {

      primaryUUID(knex, table);
      table.uuid("subjectId").notNullable();
      table.text("name").notNullable().defaultTo("");
      table.text("description").notNullable().defaultTo("");

      fileColumns(knex, table);
      timestamps(knex, table);

      table.text("status").notNullable()
      .defaultTo(StatusCode.Active);

      table.index(["subjectId", "status"]);
    });
}

export function rollbackAllMigrations(
  knex: Knex, config?: Knex.MigratorConfig): Promise<any> {

  const migrate = knex.migrate;

  return (<any> migrate).forceFreeMigrationsLock()
    .then(() => migrate.currentVersion(config))
    .then((migration) => migration !== "none"
          ? migrate.rollback(config).then(() => rollbackAllMigrations(knex, config))
          : Promise.resolve());
}
