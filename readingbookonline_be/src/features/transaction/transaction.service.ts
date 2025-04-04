import {
  Injectable,
  HttpException,
  HttpStatus,
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { LoggerService } from '@core/logger/logger.service';
import { MomoConfig } from './helper/momo.helper';
import { ChapterPurchase } from './entities/chapter-purchase.entity';
import { DatabaseService } from '@core/database/database.service';
import { UserResponseDto } from '@features/user/dto/get-user-response.dto';
import { User } from '@features/user/entities/user.entity';
import { TransactionResponseDto } from './dto/transaction.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import {
  ChapterPurchaseResponseDto,
  CreateChapterPurchaseDto,
} from './dto/book-puchase.dto';
import { BookChapter } from '@features/book/entities/book-chapter.entity';

@Injectable()
export class TransactionService {
  private readonly momoAccessKey = MomoConfig.accessKey;
  private readonly momoExtraData = MomoConfig.extraData;
  private readonly momoIpnUrl = MomoConfig.ipnUrl;
  private readonly momoPartnerCode = MomoConfig.partnerCode;
  private readonly momoRedirectUrl = MomoConfig.redirectUrl;
  private readonly momoRequestType = MomoConfig.requestType;
  private readonly momoSecretkey = MomoConfig.secretkey;
  private readonly momoLang = MomoConfig.lang;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(ChapterPurchase)
    private readonly chapterPurchaseRepository: Repository<ChapterPurchase>,
    @InjectRepository(BookChapter)
    private readonly bookChapterRepository: Repository<BookChapter>,
    private readonly loggerService: LoggerService,
    private readonly dataBaseService: DatabaseService,
  ) {}

  async createOrderMomo(user: UserResponseDto, amount: number): Promise<any> {
    try {
      const orderCount = await this.transactionRepository.count();
      const orderId = `BOT${(orderCount + 1).toString().padStart(5, '0')}`;
      const orderInfo = 'Nạp tiền cho giao dịch';
      const requestId = orderId;

      const signature = MomoConfig.getRawSignature(
        this.momoAccessKey,
        amount,
        this.momoExtraData,
        this.momoIpnUrl,
        orderId,
        orderInfo,
        this.momoPartnerCode,
        this.momoRedirectUrl,
        requestId,
        this.momoRequestType,
        this.momoSecretkey,
      );

      const payload = {
        partnerCode: this.momoPartnerCode,
        accessKey: this.momoAccessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl: this.momoRedirectUrl,
        ipnUrl: this.momoIpnUrl,
        extraData: this.momoExtraData,
        requestType: this.momoRequestType,
        signature,
        lang: this.momoLang,
      };

      const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        payload,
      );
      const momoResponse = response.data;

      if (momoResponse.resultCode !== 0) {
        this.loggerService.err(
          momoResponse.message,
          'TransactionService.createOrderMomo',
        );

        throw new HttpException(momoResponse.message, HttpStatus.BAD_REQUEST);
      }

      await this.dataBaseService.create(this.transactionRepository, {
        id: orderId,
        amount,
        points: amount,
        status: TransactionStatus.PENDING,
        user: { id: user.id },
      });

      return {
        url: momoResponse.payUrl,
        orderId,
        requestId,
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'TransactionService.createOrderMomo',
      );
      throw error;
    }
  }

  async handleMoMoWebhook(payload: any): Promise<Boolean> {
    try {
      console.log(payload);

      const { orderId, resultCode } = payload;
      this.loggerService.info(
        `Received MoMo webhook for orderId: ${orderId} with resultCode: ${resultCode}`,
        'TransactionService.handleMoMoWebhook',
      );

      const transaction = await this.transactionRepository.findOne({
        where: { id: orderId },
        relations: ['user'],
      });
      if (!transaction) {
        this.loggerService.err(
          `Transaction not found for orderId: ${orderId}`,
          'TransactionService.handleMoMoWebhook',
        );
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }

      if (resultCode === 0) {
        if (transaction.status !== TransactionStatus.SUCCESS) {
          transaction.status = TransactionStatus.SUCCESS;
          await this.transactionRepository.save(transaction);

          await this.userRepository.increment(
            { id: transaction.user.id },
            'points',
            transaction.amount,
          );

          return true;
        }

        throw new BadGatewayException('Transaction already processed');
      } else {
        transaction.status = TransactionStatus.FAILED;
        await this.transactionRepository.save(transaction);

        return false;
      }
    } catch (error) {
      this.loggerService.err(
        error.message,
        'TransactionService.handleMoMoWebhook',
      );
      throw error;
    }
  }

  async getTransaction(
    user: UserResponseDto,
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<TransactionResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;

      const [data, totalItems] = await this.transactionRepository.findAndCount({
        where: { user: { id: user.id } },
        order: { createdAt: 'DESC' },
        relations: ['user'],
        take: limit,
        skip: (page - 1) * limit,
      });

      const dtos = plainToInstance(TransactionResponseDto, data, {
        excludeExtraneousValues: true,
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: dtos,
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'TransactionService.getTransaction',
      );
      throw error;
    }
  }

  async purchaseChapter(
    user: User,
    dto: CreateChapterPurchaseDto,
  ): Promise<ChapterPurchaseResponseDto> {
    try {
      const userInfo = await this.dataBaseService.findOne(this.userRepository, {
        where: { id: user.id },
      });
      if (!userInfo) {
        throw new NotFoundException('User not found');
      }

      const chapter = await this.dataBaseService.findOne(
        this.bookChapterRepository,
        {
          where: { id: dto.chapterId },
        },
      );
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }

      const isAlreadyPurchased = await this.dataBaseService.findOne(
        this.chapterPurchaseRepository,
        {
          where: {
            user: { id: userInfo?.id },
            chapter: { id: chapter.id },
          },
        },
      );
      if (isAlreadyPurchased) {
        throw new BadRequestException('Chapter already purchased');
      }

      if (user.points < chapter.price) {
        throw new BadRequestException('Not enough points. Please top up');
      }

      await this.userRepository.decrement(
        { id: user.id },
        'points',
        chapter.price,
      );

      const purchase = await this.dataBaseService.create(
        this.chapterPurchaseRepository,
        {
          user,
          chapter,
          price: chapter.price,
        },
      );

      const infoPurchase = await this.chapterPurchaseRepository.findOne({
        where: { id: purchase.id },
        relations: [
          'user',
          'chapter',
          'chapter.book',
          'chapter.book.bookCategoryRelations',
        ],
      });

      return plainToInstance(ChapterPurchaseResponseDto, infoPurchase, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.loggerService.err(
        error.message,
        'TransactionService.purchaseChapter',
      );
      throw error;
    }
  }

  async getPurchaseChapter(
    user: UserResponseDto,
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ChapterPurchaseResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;

      const [data, totalItems] =
        await this.chapterPurchaseRepository.findAndCount({
          where: { user: { id: user.id } },
          order: { createdAt: 'DESC' },
          relations: ['user', 'chapter', 'chapter.book'],
          take: limit,
          skip: (page - 1) * limit,
        });

      const dtos = plainToInstance(ChapterPurchaseResponseDto, data, {
        excludeExtraneousValues: true,
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: dtos,
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'TransactionService.getPurchaseChapter',
      );
      throw error;
    }
  }
}
