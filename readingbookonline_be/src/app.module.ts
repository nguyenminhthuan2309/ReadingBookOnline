import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RateLimitMiddleware } from '@middleware/rate-limit.middleware';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { DatabaseModule } from '@database/database.module';
import { CacheModule } from '@core/cache/cache.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@features/user/user.module';
import { BookModule } from '@features/book/book.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from '@core/auth/auth.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, // PostgreSQL
    CacheModule, // Redis Cache
    UserModule,
    BookModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware, RateLimitMiddleware).forRoutes('*');
  }
}
