import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UserActivity } from './entities/user-activity.entity';
import { ActivityStatusResponseDto } from './dto/activity-status.dto';
import { Activity, ACTIVITY_TYPE } from './entities/activity.entity';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getActivities(
    @Request() req,
    @Query('type') type?: ACTIVITY_TYPE,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('earnedPoint') earnedPoint?: number,
    @Query('isEarnedPoint') isEarnedPoint?: boolean,
    @Query('userId') userId?: number,
  ): Promise<UserActivity[] | Activity[]> {
    return this.activitiesService.getActivities(req.user, {
      type,
      date,
      startDate,
      endDate,
      earnedPoint,
      isEarnedPoint,
      userId
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserActivity(
    @Request() req,
    @Body() createUserActivityDto: CreateUserActivityDto,
  ): Promise<UserActivity> {
    // User is creating activity for themselves
    return this.activitiesService.createUserActivity(
      req.user,
      createUserActivityDto.activityType,
      createUserActivityDto.relatedEntityId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('available')
  async getUserAvailableActivities(
    @Request() req
  ): Promise<ActivityStatusResponseDto[]> {
    const userId = req.user.id;
    return this.activitiesService.getUserAvailableActivities(userId);
  }
} 