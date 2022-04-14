import { Knex } from "knex";
import dbConfig from '../../config/database';

const { tables } = dbConfig;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tables.followers, (table) => {
    table.string('followed', 14).notNullable();
    table.string('follower', 14).notNullable();
    table.dateTime('createdAt').defaultTo(knex.fn.now());

    table.foreign('followed').references('username').inTable(tables.profile);
    table.foreign('follower').references('username').inTable(tables.profile);
    table.primary(['followed', 'follower']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tables.followers);
}
