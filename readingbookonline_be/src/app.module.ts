import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RateLimitMiddleware } from '@middleware/rate-limit.middleware';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { DatabaseModule } from '@database/database.module';
import { CacheModule } from '@core/cache/cache.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule, // PostgreSQL
    CacheModule, // Redis Cache

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RateLimitMiddleware).forRoutes('*');
  }
}
