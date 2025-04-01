import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginTracker } from './entities/login-tracker.entity';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoginTracker])],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
