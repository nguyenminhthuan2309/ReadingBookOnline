import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import { CreateChapterPurchaseDto } from './dto/book-puchase.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/momo')
  @ApiOperation({
    summary: 'Tạo đơn hàng MoMo',
    description: 'Gọi API MoMo để tạo đơn hàng và nhận URL thanh toán.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          example: 10000,
          description: 'Số tiền nạp vào (VND)',
        },
      },
      required: ['amount'],
    },
  })
  @UseGuards(JwtAuthGuard)
  async createOrderMomo(@Req() req, @Body() body: { amount: number }) {
    const user = req.user;
    return await this.transactionService.createOrderMomo(user, body.amount);
  }

  @Post('/momo/webhook')
  @ApiOperation({
    summary: 'Webhook MoMo',
    description: 'MoMo gọi vào đây sau khi giao dịch hoàn tất.',
  })
  async momoWebhook(@Req() req) {
    const payload = req.body;
    return await this.transactionService.handleMoMoWebhook(payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lịch sử giao dịch (nạp tiền vào hệ thống)',
  })
  @Get('/momo')
  async getBookNotification(
    @Req() req,
    @Query() pagination: PaginationRequestDto,
  ) {
    const user = req.user;
    return this.transactionService.getTransaction(user, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mua chapter bằng điểm' })
  @Post('/chapter')
  async purchaseChapter(@Req() req, @Body() dto: CreateChapterPurchaseDto) {
    const user = req.user;
    return this.transactionService.purchaseChapter(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lịch sử giao dịch chapter',
  })
  @Get('/chapter')
  async getPurchaseChapter(
    @Req() req,
    @Query() pagination: PaginationRequestDto,
  ) {
    const user = req.user;
    return this.transactionService.getPurchaseChapter(user, pagination);
  }
}
