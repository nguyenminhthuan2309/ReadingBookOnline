import {
  Controller,
  Get,
  Param,
  Request,
  Query,
  UseGuards,
  Post,
  Body,
  Put,
  ParseIntPipe,
  Delete,
  Req,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  GetBookRequestDto,
  GetBookResponseDto,
} from './dto/get-book-request.dto';
import {
  GetBookCategoryRequestDto,
  GetBookCateogryResponseDto,
} from './dto/get-book-category.dto';
import { GetProgressStatusDto } from './dto/get-book-progess-status.dto';
import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';
import { GetAccessStatusDto } from './dto/get-book-access-status.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookChapterDto } from './dto/create-book-chapter.dto';
import { UpdateBookChapterDto } from './dto/update-book-chapter.dto';
import {
  CreateBookReviewDto,
  UpdateBookReviewDto,
} from './dto/book-review.dto';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import {
  CreateBookChapterCommentDto,
  UpdateBookChapterCommentDto,
} from './dto/book-chapter-comment.dto';
import { BookFollow } from './entities/book-follow.entity';
import { BookFollowDto } from './dto/book-follow.dto';
import { BookReportDto, BookReportResponseDto } from './dto/book-report.dto';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';
import { AdminGuard } from '@core/auth/admin.guard';
import { GetBookTypeDto } from './dto/book-type.dto';
import { CreateBookReadingHistoryDto } from './dto/create-book-reading-history.dto';
import { UpdateBookStatusDto } from './dto/book-status.dto';
import { GetBookChapterDto } from './dto/get-book-chapter.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiOperation({ summary: 'Lấy danh sách sách' })
  @Get()
  async getAllBooks(
    @Query() params: GetBookRequestDto,
  ): Promise<GetBookResponseDto> {
    return await this.bookService.getAllBooks(params);
  }

  @ApiOperation({ summary: 'Lấy danh mục' })
  @Get('category')
  async getBookCategory(
    @Query() params: GetBookCategoryRequestDto,
  ): Promise<GetBookCateogryResponseDto> {
    return await this.bookService.getBookCategory(params);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy loại sách manga hay novel' })
  @Get('book-type')
  async getBookType(): Promise<GetBookTypeDto[]> {
    return await this.bookService.getBookType();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy trạng thái tiến độ sách' })
  @Get('progress')
  async getProgressStatus(
    @Request() req: any,
  ): Promise<GetProgressStatusDto[]> {
    const user = req.user;
    return await this.bookService.getProgressStatus(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy trạng thái truy cập sách' })
  @Get('access')
  async getAccessStatus(@Request() req: any): Promise<GetAccessStatusDto[]> {
    const user = req.user;
    return await this.bookService.getAccessStatus(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo sách mới' })
  @Post()
  async create(@Body() dto: CreateBookDto, @Request() req): Promise<number> {
    const author = req.user;
    return await this.bookService.createBook(dto, author);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo chương sách mới' })
  @Post('/chapter/:bookId')
  async createChapter(
    @Param('bookId') bookId: number,
    @Body() dto: CreateBookChapterDto,
    @Request() req,
  ): Promise<boolean> {
    const author = req.user;
    if (!author) throw new ForbiddenException('Bạn không có quyền');

    return this.bookService.createChapter(dto, bookId, author);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật chương sách' })
  @Put('/chapter/:chapterId')
  async updateChapter(
    @Param('chapterId') chapterId: number,
    @Body() dto: UpdateBookChapterDto,
    @Request() req,
  ): Promise<boolean> {
    const author = req.user;
    if (!author) throw new ForbiddenException('Bạn không có quyền');

    return this.bookService.updateChapter(chapterId, dto, author);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa chương sách' })
  @Delete('/chatper/:chapterId')
  async deleteChapter(
    @Param('chapterId') chapterId: number,
    @Req() req,
  ): Promise<boolean> {
    const author = req.user;
    if (!author) throw new ForbiddenException('Bạn không có quyền');

    return this.bookService.deleteChapter(chapterId, author);
  }

  @Get('/chatper/:chapterId')
  @ApiOperation({ summary: 'Lấy thông tin chương theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chương',
    type: GetBookChapterDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chương' })
  async getChapter(
    @Param('chapterId', ParseIntPipe) chapterId: number,
  ): Promise<GetBookChapterDto> {
    return await this.bookService.getChapter(chapterId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo review' })
  @Post('book-review/:bookId')
  async createReview(
    @Param('bookId') bookId: number,
    @Req() req,
    @Body() dto: CreateBookReviewDto,
  ) {
    const author = req.user;
    return this.bookService.createReview(bookId, author, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật review' })
  @Put('book-review/:reviewId')
  async updateReview(
    @Param('reviewId') reviewId: number,
    @Req() req,
    @Body() dto: UpdateBookReviewDto,
  ) {
    const author = req.user;
    return this.bookService.updateReview(reviewId, author, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa review' })
  @Delete('book-review/:reviewId')
  async deleteReview(@Param('reviewId') reviewId: number, @Req() req) {
    const author = req.user;
    return this.bookService.deleteReview(reviewId, author);
  }

  @ApiOperation({ summary: 'Lấy danh sách review' })
  @Get('book-review')
  async getReviews(
    @Query('bookId') bookId: number,
    @Query() pagination: PaginationRequestDto,
  ) {
    return this.bookService.getReviews(bookId, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo chapter comment' })
  @Post('chapter-comment/:chapterId')
  async createComment(
    @Param('chapterId') chapterId: number,
    @Req() req,
    @Body() dto: CreateBookChapterCommentDto,
  ) {
    const auth = req.user;
    return this.bookService.createComment(chapterId, auth, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cap nhật chapter comment' })
  @Put('chapter-comment/:commentId')
  async updateComment(
    @Req() req,
    @Param('commentId') commentId: number,
    @Body() dto: UpdateBookChapterCommentDto,
  ) {
    const auth = req.user;
    return this.bookService.updateComment(commentId, auth, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa chapter comment' })
  @Delete('/chapter-comment/:commentId')
  async deleteComment(@Req() req, @Param('commentId') commentId: number) {
    const auth = req.user;
    return this.bookService.deleteComment(commentId, auth);
  }

  @ApiOperation({ summary: 'Lấy danh sách chapter comment' })
  @ApiQuery({
    name: 'commentId',
    type: Number,
    required: false,
    description:
      'ID của bình luận cha để lấy các bình luận con. Nếu không truyền, trả về bình luận cha',
  })
  @Get('chapter-comment')
  async getComments(
    @Query() pagination: PaginationRequestDto,
    @Query('chapterId') chapterId: number,
    @Query('commentId') commentId?,
  ) {
    return this.bookService.getComments(pagination, chapterId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Theo dõi sách' })
  @Post('follow')
  async followBook(@Req() req, @Body() dto: BookFollowDto) {
    return this.bookService.followBook(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Hủy theo dõi sách' })
  @Delete('follow')
  async unfollowBook(@Req() req, @Body() dto: BookFollowDto) {
    return this.bookService.unfollowBook(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách theo dõi sách' })
  @Get('follow')
  async getFollow(@Req() req, @Query() pagination: PaginationRequestDto) {
    const userId = req.user.id;
    return this.bookService.getFollow(userId, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Người dùng báo cáo sách' })
  @Post('report')
  async createReport(
    @Request() req,
    @Body() body: BookReportDto,
  ): Promise<BookReportResponseDto> {
    return this.bookService.createReport(req.user, body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Admin lấy danh sách báo cáo' })
  @Get('report')
  async getReports(
    @Query() pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<BookReportResponseDto>> {
    return this.bookService.getReports(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo mới lịch sử đọc sách' })
  @Post('reading-history')
  async createReadingHistory(
    @Req() req,
    @Body() dto: CreateBookReadingHistoryDto,
  ): Promise<boolean> {
    const author = req.user;

    return this.bookService.createReadingHistory(author, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách lịch sử đọc sách của user (phân trang)',
  })
  @Get('reading-history')
  async getReadingHistory(
    @Req() req,
    @Query() pagination: PaginationRequestDto,
  ) {
    const author = req.user;

    return this.bookService.getReadingHistory(author, pagination);
  }

  @ApiOperation({ summary: 'Lấy chi tiết sách' })
  @Get(':id')
  async getDetailBook(@Param('id') bookId: number): Promise<any> {
    return await this.bookService.getBookDetail(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật sách (không cập nhật tác giả)' })
  @Put(':id')
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
    @Request() req,
  ): Promise<boolean> {
    const author = req.user;
    return await this.bookService.updateBook(id, dto, author);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa sách' })
  @Delete(':id')
  async deleteBook(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<boolean> {
    const author = req.user;
    return await this.bookService.deleteBook(id, author);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Cập nhật trạng thái của sách' })
  @Patch(':id/status')
  async updateBookStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookStatusDto: UpdateBookStatusDto,
    @Request() req,
  ): Promise<Boolean> {
    return await this.bookService.updateBookStatus(
      id,
      updateBookStatusDto.accessStatusId,
      updateBookStatusDto.progressStatusId,
    );
  }
}
