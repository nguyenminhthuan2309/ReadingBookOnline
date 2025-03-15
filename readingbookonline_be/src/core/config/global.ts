import * as path from 'path';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

config({ path: path.join(process.cwd(), 'src', '.env') });


export const redisConfig = {
    host: 'redis://localhost',
    port: 6379,
    password: '1234',
};

export const postgresConfig: DataSourceOptions = {
    type: 'postgres',
    url: 'postgresql://postgres:1234@localhost:5431',
    synchronize: true,
    logging: true,
};
