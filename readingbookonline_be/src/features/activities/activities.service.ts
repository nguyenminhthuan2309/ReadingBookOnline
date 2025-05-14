import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Activity, ACTIVITY_TYPE } from './entities/activity.entity';
import { UserActivity } from './entities/user-activity.entity';
import { User } from '@features/user/entities/user.entity';
import { ActivityDto, ActivityStatus, ActivityStatusResponseDto } from './dto/activity-status.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: Repository<UserActivity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllActivities(): Promise<Activity[]> {
    return this.activityRepository.find();
  }

  async findActivityByType(type: ACTIVITY_TYPE): Promise<Activity | null> {
    return this.activityRepository.findOne({ where: { activityType: type } });
  }

  async getUserActivitiesByType(
    userId: number,
    activityType: ACTIVITY_TYPE,
  ): Promise<UserActivity[]> {
    return this.userActivityRepository.find({
      where: {
        user: { id: userId },
        activityType,
      },
      relations: ['activity'],
    });
  }

  async getUserActivitiesByFilter(filterOptions: {
    userId: number;
    type?: ACTIVITY_TYPE;
    date?: Date;
    startDate?: Date;
    endDate?: Date;
    earnedPoint?: number;
    isEarnedPoint?: boolean;
  }): Promise<UserActivity[]> {
    const { userId, type, date, startDate, endDate, earnedPoint, isEarnedPoint } = filterOptions;
    
    const queryBuilder = this.userActivityRepository.createQueryBuilder('userActivity')
      .leftJoinAndSelect('userActivity.activity', 'activity')
      .where('userActivity.user_id = :userId', { userId });
    
    if (type) {
      queryBuilder.andWhere('userActivity.activity_type = :type', { type });
    }
    
    if (date) {
      queryBuilder.andWhere('userActivity.activity_date = :date', { date });
    }
    
    if (startDate && endDate) {
      queryBuilder.andWhere('userActivity.activity_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('userActivity.activity_date >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('userActivity.activity_date <= :endDate', { endDate });
    }
    
    if (earnedPoint !== undefined) {
      if (isEarnedPoint) {
        queryBuilder.andWhere('userActivity.earned_point > 0');
      } else {
        queryBuilder.andWhere('userActivity.earned_point = :earnedPoint', { earnedPoint });
      }
    }
    
    return queryBuilder.getMany();
  }

  async getUserAvailableActivities(userId: number): Promise<ActivityStatusResponseDto[]> {
    // Get all activities
    const activities = await this.activityRepository.find();
    
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create date range for today (to handle timezone issues)
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    
    // Process each activity
    const result: ActivityStatusResponseDto[] = [];
    
    for (const activity of activities) {
      // Check user's history with this activity
      const userActivities = await this.userActivityRepository.find({
        where: {
          user: { id: userId },
          activityType: activity.activityType,
        },
        order: { activityDate: 'DESC' },
      });
      
      // Get today's activities for this type
      const todayActivities = await this.userActivityRepository.find({
        where: {
          user: { id: userId },
          activityType: activity.activityType,
          activityDate: Between(startOfToday, endOfToday),
        },
      });
      
      // Calculate statistics
      const completedCount = todayActivities.length;
      let status = ActivityStatus.NOT_STARTED;
      let currentStreak = 0;
      
      // Determine status based on maxPerDay or completion
      if (completedCount > 0) {
        if (activity.maxPerDay && completedCount >= activity.maxPerDay) {
          status = ActivityStatus.DONE;
        } else {
          status = ActivityStatus.IN_PROGRESS;
        }
      }
      
      // Calculate streak if relevant
      if (activity.streakBased && userActivities.length > 0) {
        currentStreak = userActivities[0].currentStreak || 0;
      }
      
      // Transform the activity entity to DTO
      const activityDto = plainToInstance(ActivityDto, activity, {
        excludeExtraneousValues: true,
      });
      
      // Create the response object
      const activityStatus = {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        activityType: activity.activityType,
        maxPerDay: activity.maxPerDay,
        streakBased: activity.streakBased,
        basePoint: activity.basePoint,
        maxStreakPoint: activity.maxStreakPoint,
        status,
        currentStreak,
        completedCount,
        activity: activityDto,
      };
      
      result.push(plainToInstance(ActivityStatusResponseDto, activityStatus, {
        excludeExtraneousValues: true,
      }));
    }
    
    return result;
  }

  async createUserActivity(
    user: User,
    activityType: ACTIVITY_TYPE,
    relatedEntityId?: number,
  ): Promise<UserActivity> {
    // Find the activity
    const activity = await this.findActivityByType(activityType);
    if (!activity) {
      throw new NotFoundException(`Activity with type ${activityType} not found`);
    }

    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create date range for today (to handle timezone issues)
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
     
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // Calculate earned points and streak
    let earnedPoints = 0;
    let currentStreak = 0;
    
    if (activity.streakBased) {
      // For streak-based activities like login
      // Check if there was an activity yesterday to determine streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Create date range for yesterday (to handle timezone issues)
      const startOfYesterday = new Date(yesterday);
      startOfYesterday.setHours(0, 0, 0, 0);
      
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      
      const yesterdayActivity = await this.userActivityRepository.findOne({
        where: {
          user: { id: user.id },
          activityType,
          activityDate: Between(startOfYesterday, endOfYesterday),
        },
      });
      
      if (yesterdayActivity) {
        // If there was activity yesterday, increase the streak
        currentStreak = (yesterdayActivity.currentStreak || 0) + 1;
      } else {
        // Reset streak to 1 as there was no activity yesterday
        currentStreak = 1;
      }
      
      // Calculate points based on streak (limited by maxStreakPoint)
      earnedPoints = currentStreak >= activity.maxStreakPoint 
        ? activity.maxStreakPoint * activity.basePoint 
        : currentStreak * activity.basePoint;

    } else {
      // For non-streak activities, check max_per_day limit
      if (activity.maxPerDay) {
        // Count activities of this type done today
        let todayActivitiesCount = 0;
        
        if (relatedEntityId) {
          todayActivitiesCount = await this.userActivityRepository.count({
            where: {
              user: { id: user.id },
              activityType,
              activityDate: Between(startOfToday, endOfToday),
              relatedEntityId,
            },
          });
        } else {
          todayActivitiesCount = await this.userActivityRepository.count({
            where: {
              user: { id: user.id },
              activityType,
              activityDate: Between(startOfToday, endOfToday),
            },
          });
        }
        // If under the daily limit, award points
        if (todayActivitiesCount < activity.maxPerDay) {
            if (activity.activityType !== ACTIVITY_TYPE.COMMENT_CHAPTER || user.isVip) {
                earnedPoints = activity.basePoint;
            } else {
                earnedPoints = 0;
            }
        } else {
          // User already reached the daily maximum for this activity
          earnedPoints = 0;
        }
      } else {
        // No daily limit, always award points
        earnedPoints = activity.basePoint;
      }
    }

    if (earnedPoints > 0) {
      const earnedTodayCount = await this.userActivityRepository.count({
        where: {
          user: { id: user.id },
          activityType,
          activityDate: Between(startOfToday, endOfToday),
          earnedPoint: MoreThan(0),
        },
      });

      if (earnedTodayCount < (activity.maxPerDay || Infinity)) {
        await this.userRepository.createQueryBuilder()  
          .update()
          .set({
            tokenBalance: () => `"token_balance" + ${earnedPoints}`,
            tokenEarned: () => `"token_earned" + ${earnedPoints}`,
          })
          .where('id = :id', { id: user.id })
          .execute();
      } else {
        // User already reached the daily maximum for this activity
        earnedPoints = 0;
      }
    }

    // Create a new user activity record
    const userActivity = this.userActivityRepository.create({
      user,
      activityType,
      activityDate: today,
      relatedEntityId,
      currentStreak,
      earnedPoint: earnedPoints,
      activity,
    });

    return this.userActivityRepository.save(userActivity);
  }

  async getActivities(
    user: any,
    filterParams: {
      type?: ACTIVITY_TYPE,
      date?: string,
      startDate?: string,
      endDate?: string,
      earnedPoint?: number,
      isEarnedPoint?: boolean,
      userId?: number,
    }
  ): Promise<UserActivity[] | Activity[]> {
    const { type, date, startDate, endDate, earnedPoint, userId, isEarnedPoint } = filterParams;
    
    // If no filter parameters are provided, return all activities
    if (!type && !date && !startDate && !endDate && !earnedPoint && !userId && !isEarnedPoint) {
      return this.findAllActivities();
    }
    
    // Handle filtering logic for user activities
    const currentUserId = user.id;
    let queryUserId = currentUserId;
    
    if (userId && userId !== currentUserId) {
      // Check if user is admin before allowing to query other users
      const isAdmin = user.role && user.role.id === 1;
      if (!isAdmin) {
        throw new Error('You do not have permission to view other users\' activities');
      }
      queryUserId = userId;
    }
    
    // Parse dates
    let parsedDate: Date | undefined;
    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;
    
    if (date) {
      parsedDate = new Date(date);
      parsedDate.setHours(0, 0, 0, 0);
    }
    
    if (startDate) {
      parsedStartDate = new Date(startDate);
      parsedStartDate.setHours(0, 0, 0, 0);
    }
    
    if (endDate) {
      parsedEndDate = new Date(endDate);
      parsedEndDate.setHours(23, 59, 59, 999);  // End of day
    }
    
    return this.getUserActivitiesByFilter({
      userId: queryUserId,
      type,
      date: parsedDate,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      earnedPoint,
      isEarnedPoint,
    });
  }
} 