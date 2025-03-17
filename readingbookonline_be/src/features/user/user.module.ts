import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserReport } from './entities/user-report.entity';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from '@features/book/book.module';
import { UserStatus } from './entities/user-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserReport,
      UserStatus,
      Role
    ]),
    forwardRef(() => BookModule),
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule { }
