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

  @Get('reading-book-history')
  @ApiOperation({
    summary: 'Lấy lịch sử đọc sách',
  })
  @ApiQuery({
    name: 'bookId',
    required: true,
    type: Number,
    description: 'ID của sách cần thống kê lịch sử đọc',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description:
      'Ngày bắt đầu lọc theo định dạng yyyy-MM-dd (ví dụ: 2025-01-01)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description:
      'Ngày kết thúc lọc theo định dạng yyyy-MM-dd (ví dụ: 2025-12-31)',
  })
  @ApiQuery({
    name: 'groupBy',
    enum: ['daily', 'monthly', 'yearly'],
    required: false,
    description:
      'Loại thống kê theo thời gian: daily (ngày), monthly (tháng), yearly (năm). Mặc định là daily.',
  })
  async getReadingHistory(
    @Query('bookId') bookId: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('groupBy') groupBy: 'daily' | 'monthly' | 'yearly' = 'daily',
  ) {
    return this.trackerService.getReadingHistoryByBookId(
      bookId,
      from,
      to,
      groupBy,
    );
  }
}
