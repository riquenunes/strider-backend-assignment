import { Knex } from "knex";
import dbConfig from '../../config/database';

const { tables } = dbConfig;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tables.dailyProfileStats, (table) => {
    table.string('profile', 14).notNullable();
    table.date('date').notNullable();
    table.smallint('postCount').unsigned().notNullable().defaultTo(0);

    table.foreign('profile').references('username').inTable(tables.profile);
    table.primary(['profile', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tables.dailyProfileStats);
}
