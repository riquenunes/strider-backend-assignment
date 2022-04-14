import { Knex } from "knex";
import dbConfig from '../../config/database';

const { tables } = dbConfig;

export async function seed(knex: Knex): Promise<void> {
  await knex(tables.post).del();
  await knex(tables.followers).del();
  await knex(tables.dailyProfileStats).del();
  await knex(tables.profile).del();
  await knex(tables.profile).insert([
    { username: 'senna' },
    { username: 'lh44' },
    { username: 'supermax' }
  ]);
};
