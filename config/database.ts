import path from 'path';
import env from 'env-var';

const config = {
  client: 'pg',
  connection: {
    host: env.get('DB_HOST').asString(),
    database: env.get('DB_DATABASE').asString(),
    user: env.get('DB_USERNAME').asString(),
    port: env.get('DB_PORT').asInt(),
    password: env.get('DB_PASSWORD').asString(),
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, '../db/migrations'),
    schemaName: 'public',
  },
  seeds: {
    directory: path.join(__dirname, '../db/seeds'),
  },
  searchPath: ['public'],
  tables: {
    profile: 'profile',
    dailyProfileStats: 'daily_profile_stats',
    followers: 'followers',
    post: 'post'
  }
};

export default config;
