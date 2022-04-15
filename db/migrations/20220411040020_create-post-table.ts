import { Knex } from "knex";
import dbConfig from '../../config/database';

const { tables } = dbConfig;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tables.post, (table) => {
    table.uuid('id').primary();
    table.string('content', 777).nullable();
    table.specificType('contentTokens', 'TSVECTOR').nullable();
    table.string('author', 14).notNullable();
    table.uuid('originalPostId').nullable();
    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.increments('position').defaultTo(0);

    table.foreign('originalPostId').references('id').inTable(tables.post);
    table.foreign('author').references('username').inTable(tables.profile);

    table.index('author');
    table.index('position', 'position_idx', 'BTREE');
    table.index('contentTokens', 'content_tokens_idx', 'GIN');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tables.post);
}
