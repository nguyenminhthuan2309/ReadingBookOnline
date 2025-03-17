import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserReport } from './entities/user-report.entity';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from '@features/book/book.module';
import { UserStatus } from './entities/user-status.entity';
import { LoggerModule } from '@core/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserReport,
      UserStatus,
      Role
    ]),
    forwardRef(() => BookModule),
    JwtModule,
    LoggerModule
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule { }
