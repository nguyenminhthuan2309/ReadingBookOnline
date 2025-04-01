import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { LoginTracker } from './entities/login-tracker.entity';
import { DatabaseService } from '@core/database/database.service';
import { LoggerService } from '@core/logger/logger.service';
import { format, parseISO } from 'date-fns';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(LoginTracker)
    private readonly loginTrackerRepository: Repository<LoginTracker>,
    private readonly databaseService: DatabaseService,
    private readonly loggerService: LoggerService,
  ) {}

  async trackLogin(): Promise<Boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let loginRecord = await this.databaseService.findOne(
        this.loginTrackerRepository,
        {
          where: { date: today },
        },
      );

      if (!loginRecord) {
        await this.databaseService.create<DeepPartial<LoginTracker>>(
          this.loginTrackerRepository,
          {
            date: today,
            count: 1,
          },
        );
      } else {
        loginRecord.count += 1;
        await this.databaseService.update<DeepPartial<LoginTracker>>(
          this.loginTrackerRepository,
          loginRecord.id,
          { count: loginRecord.count },
        );
      }

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'LoginTrackerService.trackLogin');
      throw error;
    }
  }

  async getLoginHistoryChart(
    timeRange: 'daily' | 'weekly' | 'monthly' = 'daily',
  ): Promise<{ time: string; login: number }[]> {
    try {
      let dateFormat = 'YYYY-MM-DD';
      let whereClause = '';
      let groupByClause = 'GROUP BY time';

      if (timeRange === 'daily') {
        dateFormat = 'YYYY-MM-DD';
        whereClause = `WHERE lt.date >= CURRENT_DATE - INTERVAL '30 days'`;
      } else if (timeRange === 'weekly') {
        dateFormat = 'IYYY-IW';
        whereClause = `WHERE lt.date >= CURRENT_DATE - INTERVAL '14 weeks'`;
      } else if (timeRange === 'monthly') {
        dateFormat = 'YYYY-MM';
        whereClause = `WHERE lt.date >= CURRENT_DATE - INTERVAL '12 months'`;
      }

      const query = `
        SELECT
          to_char(lt.date, $1) as time,
          SUM(lt.count) AS login
        FROM login_tracker lt
        ${whereClause}
        ${groupByClause}
        ORDER BY time DESC`;

      const rawResult: any[] = await this.databaseService.executeRawQuery(
        query,
        [dateFormat],
      );

      const chartData = rawResult.map((row) => {
        let formattedTime = row.time;
        if (timeRange === 'daily') {
          formattedTime = format(parseISO(row.time), 'dd-MM-yyyy');
        } else if (timeRange === 'weekly') {
          const [year, week] = row.time.split('-');
          formattedTime = `Tuần ${week}-${year}`;
        } else if (timeRange === 'monthly') {
          formattedTime = format(parseISO(row.time), 'MM-yyyy');
        }
        return {
          time: formattedTime,
          login: Number(row.login),
        };
      });

      return chartData;
    } catch (error) {
      console.error(error.message, 'LoginTrackerService.getLoginHistoryChart');
      throw error;
    }
  }
}
