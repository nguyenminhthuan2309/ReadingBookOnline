import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Activity } from './entities/activity.entity';
import { UserActivity } from './entities/user-activity.entity';
import { User } from '@features/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      UserActivity,
      User,
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {} 