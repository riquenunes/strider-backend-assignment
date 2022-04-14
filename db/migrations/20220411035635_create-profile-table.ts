import { Knex } from "knex";
import dbConfig from '../../config/database';

const { tables } = dbConfig;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tables.profile, (table) => {
    table.string('username', 14).primary();
    table.dateTime('joinDate').defaultTo(knex.fn.now());
    table.integer('followersCount').defaultTo(0);
    table.integer('followingCount').defaultTo(0);
    table.integer('postCount').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tables.profile);
}
