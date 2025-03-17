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
    host: 'localhost',
    port: 5431,
    username: 'postgres',
    password: '1234',
    database: 'readingbookonline',
    logging: true,
    synchronize: true,
};

export const jwtConfig = {
    secret: 'qBsm0hLr8bES7XoZKsxoc6Yguqj2nsSB',
    expiresIn: '1h'
}

export const userConfig = {
    roleUserId: 3,
    statusUserId: 2
}