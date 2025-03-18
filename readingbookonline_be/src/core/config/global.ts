import * as path from 'path';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

config({ path: path.join(process.cwd(), 'src', '.env') });

export const redisConfig = {
  host: process.env.REDIS_HOST || '',
  port: process.env.REDIS_PORT || '',
  password: process.env.REDIS_PASSWORD || '',
};

export const postgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || '',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || '',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || '',
  logging: true,
  synchronize: true,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || '',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};

export const userConfig = {
  //role: 3 = member
  roleUserId: 3,

  //status: 2 = activate
  statusUserId: 2,

  redisTtlResetPassword: 300,
};
