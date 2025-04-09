import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrackerService } from './tracker.service';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @ApiOperation({ summary: 'Tracks user login and increments the count' })
  @Post('login')
  async trackLogin(): Promise<Boolean> {
    return await this.trackerService.trackLogin();
  }

  @ApiOperation({
    summary: 'Lấy thống kê lịch sử login (số lượng login mỗi khoảng thời gian)',
  })
  @ApiQuery({
    name: 'timeRange',
    enum: ['daily', 'weekly', 'monthly'],
    description: 'Khoảng thời gian thống kê',
    required: false,
  })
  @Get('login/history/chart')
  async getLoginHistoryChart(
    @Query('timeRange') timeRange: 'daily' | 'weekly' | 'monthly' = 'daily',
  ): Promise<{ time: string; login: number }[]> {
    return await this.trackerService.getLoginHistoryChart(timeRange);
  }

  @ApiOperation({
    summary: 'Lấy thống kê số lượng người dùng mới',
  })
  @ApiQuery({
    name: 'timeRange',
    enum: ['daily', 'weekly', 'monthly'],
    description: 'Khoảng thời gian thống kê',
    required: false,
  })
  @Get('user-new')
  async getNewUserChart(
    @Query('timeRange') timeRange: 'daily' | 'weekly' | 'monthly' = 'daily',
  ): Promise<{ time: string; value: number }[]> {
    return await this.trackerService.getNewUserChart(timeRange);
  }

  @ApiOperation({
    summary: 'Lấy thống kê số lượng sách mới',
  })
  @ApiQuery({
    name: 'timeRange',
    enum: ['daily', 'weekly', 'monthly'],
    description: 'Khoảng thời gian thống kê',
    required: false,
  })
  @Get('book-new')
  async getNewBookStatsChart(
    @Query('timeRange') timeRange: 'daily' | 'weekly' | 'monthly' = 'daily',
  ): Promise<{ time: string; value: number }[]> {
    return await this.trackerService.getNewBookStatsChart(timeRange);
  }
}
