import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'ruoyi123',
  database: process.env.DB_DATABASE || 'ruoyi',
  charset: 'utf8mb4',
  timezone: '+08:00',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  maxQueryExecutionTime: 1000,
  extra: {
    connectionLimit: 30,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
  },
});
