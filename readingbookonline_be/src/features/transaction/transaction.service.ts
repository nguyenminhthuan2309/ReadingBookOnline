import { parseISO, startOfDay, endOfDay, isAfter } from 'date-fns';
import {
  Injectable,
  HttpException,
  HttpStatus,
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
import { GetAdminChapterPurchasesDto } from './dto/admin-book-purchase.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { log } from 'console';
import { NotificationGateway } from '@core/gateway/notification.gateway';
import { NotificationType } from '@features/notification/entities/notification.entity';
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
    private readonly mailerService: MailerService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createOrderMomo(user: UserResponseDto, amount: number): Promise<any> {
    try {
      const orderCount = await this.transactionRepository.count();
      console.log('Order count:', orderCount);
      const orderId = `BOT${(orderCount + 1).toString().padStart(6, '0')}`;
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
        console.log('Momo response:', momoResponse);
        this.loggerService.err(
          momoResponse,
          'TransactionService.createOrderMomo',
        );

        return {
          status: false,
          code: 400,
          data: { momoResponse: { ...momoResponse } },
          msg: 'Fail',
        };
      }

      await this.dataBaseService.create(this.transactionRepository, {
        id: orderId,
        amount,
        tokens: Math.floor(amount / 1000) || 0,
        status: TransactionStatus.PENDING,
        user: { id: user.id },
      });

      return {
        url: momoResponse.payUrl,
        orderId,
        requestId,
        momoResponse: {
          resultCode: momoResponse.resultCode,
          message: momoResponse.message,
        },
      };
    } catch (error) {
      log('Error:', error);
      this.loggerService.err(
        error.message,
        'TransactionService.createOrderMomo',
      );
      throw error;
    }
  }

  async handleMoMoWebhook(payload: any): Promise<any> {
    try {
      const { orderId, resultCode, message } = payload;
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

          const tokens = transaction.tokens;

          await this.userRepository
            .createQueryBuilder()
            .update()
            .set({
              tokenBalance: () => `"token_balance" + ${tokens}`,
              tokenReceived: () => `"token_received" + ${tokens}`,
              tokenPurchased: () => `"token_purchased" + ${tokens}`,
            })
            .where('id = :id', { id: transaction.user.id })
            .execute();

          await this.notificationGateway.sendDepositSuccessNotification(
            transaction.user.id,
            tokens,
            transaction.id,
          );

          await this.mailerService.sendMail({
            to: transaction.user.email,
            subject: 'Cảm ơn bạn đã giao dịch với chúng tôi!',
            text: `Xin chào ${transaction.user.name},\n\nCảm ơn bạn đã thực hiện giao dịch thành công!\nMã đơn hàng của bạn là: ${transaction.id}\nSố điểm của bạn đã được cập nhật.\n\nChúc bạn một ngày tốt lành!`,
            html: `
              <h3>Xin chào ${transaction.user.name},</h3>
              <p>Cảm ơn bạn đã thực hiện giao dịch thành công!</p>
              <p><strong>Mã đơn hàng:</strong> ${transaction.id}</p>
              <p>Số điểm của bạn đã được cập nhật thành công. Chúng tôi luôn sẵn sàng phục vụ bạn.</p>
              <p>Chúc bạn một ngày tuyệt vời!</p>
            `,
          });
        }

        return {
          status: true,
          code: 200,
          data: { momoResponse: { resultCode, message } },
          msg: 'Success',
        };
      } else {
        transaction.status = TransactionStatus.FAILED;
        await this.transactionRepository.save(transaction);

        await this.notificationGateway.sendDepositFailedNotification(
          transaction.user.id,
          transaction.tokens,
          transaction.id,
          message,
        );

        await this.mailerService.sendMail({
          to: transaction.user.email,
          subject: 'Giao dịch của bạn không thành công',
          text: `Xin chào ${transaction.user.name},\n\nChúng tôi rất tiếc thông báo rằng giao dịch của bạn không thành công.\nMã đơn hàng của bạn là: ${transaction.id}\nVui lòng kiểm tra lại và thử lại sau.\n\nChúc bạn may mắn!`,
          html: `
            <h3>Xin chào ${transaction.user.name},</h3>
            <p>Chúng tôi rất tiếc phải thông báo rằng giao dịch của bạn không thành công.</p>
            <p><strong>Mã đơn hàng:</strong> ${transaction.id}</p>
            <p>Vui lòng kiểm tra lại và thử lại sau. Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</p>
            <p>Chúc bạn may mắn và hy vọng sẽ phục vụ bạn trong những lần giao dịch sau.</p>
          `,
        });
      }

      return {
        status: true,
        code: 200,
        data: { momoResponse: { resultCode, message } },
        msg: 'Success',
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'TransactionService.handleMoMoWebhook',
      );
      throw error;
    }
  }

  async checkTransactionStatus(
    orderId: string,
    requestId: string,
  ): Promise<any> {
    try {
      const signature = MomoConfig.getRawcheckSignature(
        this.momoAccessKey,
        orderId,
        this.momoPartnerCode,
        requestId,
        this.momoSecretkey,
      );

      const payload = {
        partnerCode: this.momoPartnerCode,
        requestId,
        orderId,
        signature,
        lang: this.momoLang,
      };

      const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/query',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const momoResponse = response.data;

      if (momoResponse.resultCode === 0) {
        const transaction = await this.transactionRepository.findOne({
          where: { id: orderId },
          relations: ['user'],
        });

        if (!transaction) {
          throw new HttpException(
            'Transaction not found',
            HttpStatus.NOT_FOUND,
          );
        }

        if (transaction.status === TransactionStatus.PENDING) {
          transaction.status = TransactionStatus.SUCCESS;

          await this.transactionRepository.save(transaction);

          const tokens = transaction.tokens;

          await this.userRepository
            .createQueryBuilder()
            .update()
            .set({
              tokenBalance: () => `"token_balance" + ${tokens}`,
              tokenReceived: () => `"token_received" + ${tokens}`,
              tokenPurchased: () => `"token_purchased" + ${tokens}`,
            })
            .where('id = :id', { id: transaction.user.id })
            .execute();

          await this.mailerService.sendMail({
            to: transaction.user.email,
            subject: 'Cảm ơn bạn đã giao dịch với chúng tôi!',
            text: `Xin chào ${transaction.user.name},\n\nCảm ơn bạn đã thực hiện giao dịch thành công!\nMã đơn hàng của bạn là: ${transaction.id}\nSố điểm của bạn đã được cập nhật.\n\nChúc bạn một ngày tốt lành!`,
            html: `
              <h3>Xin chào ${transaction.user.name},</h3>
              <p>Cảm ơn bạn đã thực hiện giao dịch thành công!</p>
              <p><strong>Mã đơn hàng:</strong> ${transaction.id}</p>
              <p>Số điểm của bạn đã được cập nhật thành công. Chúng tôi luôn sẵn sàng phục vụ bạn.</p>
              <p>Chúc bạn một ngày tuyệt vời!</p>
            `,
          });

          return {
            status: true,
            code: 200,
            data: {
              momoResponse: {
                resultCode: momoResponse.resultCode,
                message: momoResponse.message,
              },
            },
            msg: 'Success',
          };
        }
      } else {
        const transaction = await this.transactionRepository.findOne({
          where: { id: orderId },
          relations: ['user'],
        });

        if (!transaction) {
          throw new HttpException(
            'Transaction not found',
            HttpStatus.NOT_FOUND,
          );
        }

        if (transaction.status === TransactionStatus.PENDING) {
          transaction.status = TransactionStatus.FAILED;
          await this.transactionRepository.save(transaction);

          await this.mailerService.sendMail({
            to: transaction.user.email,
            subject: 'Giao dịch của bạn không thành công',
            text: `Xin chào ${transaction.user.name},\n\nChúng tôi rất tiếc thông báo rằng giao dịch của bạn không thành công.\nMã đơn hàng của bạn là: ${transaction.id}\nVui lòng kiểm tra lại và thử lại sau.\n\nChúc bạn may mắn!`,
            html: `
              <h3>Xin chào ${transaction.user.name},</h3>
              <p>Chúng tôi rất tiếc phải thông báo rằng giao dịch của bạn không thành công.</p>
              <p><strong>Mã đơn hàng:</strong> ${transaction.id}</p>
              <p>Vui lòng kiểm tra lại và thử lại sau. Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</p>
              <p>Chúc bạn may mắn và hy vọng sẽ phục vụ bạn trong những lần giao dịch sau.</p>
            `,
          });
        }
      }

      return {
        status: true,
        code: 200,
        data: {
          momoResponse: {
            resultCode: momoResponse.resultCode,
            message: momoResponse.message,
          },
        },
        msg: 'Success',
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'TransactionService.checkTransactionStatus',
      );
      throw error;
    }
  }

  async getTransaction(
    user: UserResponseDto,
    pagination: PaginationRequestDto,
    filter: {
      id?: string;
      startDate?: string;
      endDate?: string;
      status?: 'PENDING' | 'SUCCESS' | 'FAILED';
    },
  ): Promise<PaginationResponseDto<TransactionResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;
      const qb = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.user', 'user');

      if (filter.id) {
        qb.andWhere('transaction.id LIKE :id', { id: `%${filter.id}%` });
      }

      if (filter.status) {
        qb.andWhere('transaction.status = :status', { status: filter.status });
      }

      if (filter.startDate && filter.endDate) {
        const start = startOfDay(parseISO(filter.startDate));
        const end = endOfDay(parseISO(filter.endDate));

        if (isAfter(start, end)) {
          throw new BadRequestException('Start date must be before end date');
        }

        qb.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
          startDate: start,
          endDate: end,
        });
      } else if (filter.startDate) {
        const start = startOfDay(parseISO(filter.startDate));
        qb.andWhere('transaction.createdAt >= :startDate', {
          startDate: start,
        });
      } else if (filter.endDate) {
        const end = endOfDay(parseISO(filter.endDate));
        qb.andWhere('transaction.createdAt <= :endDate', { endDate: end });
      }

      qb.andWhere('transaction.user_id = :userId', { userId: user.id });

      qb.orderBy('transaction.createdAt', 'DESC');
      qb.take(limit);
      qb.skip((page - 1) * limit);

      const [data, totalItems] = await qb.getManyAndCount();

      const dtos = plainToInstance(TransactionResponseDto, data, {
        excludeExtraneousValues: true,
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: dtos,
      };
    } catch (error) {
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

      if (user.tokenBalance < chapter.price) {
        throw new BadRequestException('Not enough tokens. Please top up');
      }

      await this.userRepository.decrement(
        { id: user.id },
        'tokenBalance',
        chapter.price,
      );

      await this.userRepository.increment(
        { id: user.id },
        'tokenSpent',
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
          'chapter.book.bookCategoryRelations.category',
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
    filter: {
      chapterId?: number;
      bookId?: number;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<PaginationResponseDto<ChapterPurchaseResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;
      const qb = this.chapterPurchaseRepository
        .createQueryBuilder('chapterPurchase')
        .leftJoinAndSelect('chapterPurchase.user', 'user')
        .leftJoinAndSelect('chapterPurchase.chapter', 'chapter')
        .leftJoinAndSelect('chapter.book', 'book');

      if (filter.chapterId) {
        qb.andWhere('chapter.id = :chapterId', { chapterId: filter.chapterId });
      }

      if (filter.bookId) {
        qb.andWhere('book.id = :bookId', { bookId: filter.bookId });
      }

      if (filter.startDate && filter.endDate) {
        const start = startOfDay(parseISO(filter.startDate));
        const end = endOfDay(parseISO(filter.endDate));

        if (isAfter(start, end)) {
          throw new BadRequestException('Start date must be before end date');
        }

        qb.andWhere(
          'chapterPurchase.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: start,
            endDate: end,
          },
        );
      } else if (filter.startDate) {
        const start = startOfDay(parseISO(filter.startDate));
        qb.andWhere('chapterPurchase.createdAt >= :startDate', {
          startDate: start,
        });
      } else if (filter.endDate) {
        const end = endOfDay(parseISO(filter.endDate));
        qb.andWhere('chapterPurchase.createdAt <= :endDate', { endDate: end });
      }

      qb.orderBy('chapterPurchase.createdAt', 'DESC');
      qb.take(limit);
      qb.skip((page - 1) * limit);

      const [data, totalItems] = await qb.getManyAndCount();

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

  async getAdminTransactions(
    pagination: PaginationRequestDto,
    filter: {
      id?: string;
      email?: string;
      userId?: number;
      startDate?: string;
      endDate?: string;
      status?: 'PENDING' | 'SUCCESS' | 'FAILED';
    },
  ): Promise<PaginationResponseDto<TransactionResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;
      const qb = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.user', 'user');

      if (filter.id) {
        qb.andWhere('transaction.id LIKE :id', { id: `%${filter.id}%` });
      }
      if (filter.email) {
        qb.andWhere('user.email LIKE :email', { email: `%${filter.email}%` });
      }
      if (filter.userId) {
        qb.andWhere('transaction.user_id = :userId', { userId: filter.userId });
      }
      if (filter.status) {
        qb.andWhere('transaction.status = :status', { status: filter.status });
      }

      if (filter.startDate && filter.endDate) {
        const start = startOfDay(parseISO(filter.startDate));
        const end = endOfDay(parseISO(filter.endDate));

        if (isAfter(start, end)) {
          throw new BadRequestException('Start date must be before end date');
        }

        qb.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
          startDate: start,
          endDate: end,
        });
      } else if (filter.startDate) {
        const start = startOfDay(parseISO(filter.startDate));
        qb.andWhere('transaction.createdAt >= :startDate', {
          startDate: start,
        });
      } else if (filter.endDate) {
        const end = endOfDay(parseISO(filter.endDate));
        qb.andWhere('transaction.createdAt <= :endDate', { endDate: end });
      }

      qb.orderBy('transaction.createdAt', 'DESC');
      qb.take(limit);
      qb.skip((page - 1) * limit);

      const [data, totalItems] = await qb.getManyAndCount();

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
        'TransactionService.getAdminTransactions',
      );
      throw error;
    }
  }

  async getAdminChapterPurchases(
    filter: GetAdminChapterPurchasesDto,
  ): Promise<PaginationResponseDto<ChapterPurchaseResponseDto>> {
    try {
      const { limit = 10, page = 1 } = filter;
      const qb = this.chapterPurchaseRepository
        .createQueryBuilder('chapterPurchase')
        .leftJoinAndSelect('chapterPurchase.user', 'user')
        .leftJoinAndSelect('chapterPurchase.chapter', 'chapter')
        .leftJoinAndSelect('chapter.book', 'book');

      if (filter.chapterId) {
        qb.andWhere('chapter.id = :chapterId', { chapterId: filter.chapterId });
      }
      if (filter.bookId) {
        qb.andWhere('book.id = :bookId', { bookId: filter.bookId });
      }
      if (filter.userId) {
        qb.andWhere('user.id = :userId', { userId: filter.userId });
      }
      if (filter.email) {
        qb.andWhere('user.email LIKE :email', { email: `%${filter.email}%` });
      }
      if (filter.id) {
        qb.andWhere('chapterPurchase.id = :id', { id: filter.id });
      }
      if (filter.startDate && filter.endDate) {
        const start = startOfDay(parseISO(filter.startDate));
        const end = endOfDay(parseISO(filter.endDate));

        if (isAfter(start, end)) {
          throw new BadRequestException('Start date must be before end date');
        }

        qb.andWhere(
          'chapterPurchase.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: start,
            endDate: end,
          },
        );
      } else if (filter.startDate) {
        const start = startOfDay(parseISO(filter.startDate));
        qb.andWhere('chapterPurchase.createdAt >= :startDate', {
          startDate: start,
        });
      } else if (filter.endDate) {
        const end = endOfDay(parseISO(filter.endDate));
        qb.andWhere('chapterPurchase.createdAt <= :endDate', { endDate: end });
      }

      qb.orderBy('chapterPurchase.createdAt', 'DESC');
      qb.take(limit);
      qb.skip((page - 1) * limit);

      const [data, totalItems] = await qb.getManyAndCount();

      const dtos = plainToInstance(ChapterPurchaseResponseDto, data, {
        excludeExtraneousValues: true,
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: dtos,
      };
    } catch (error) {
      throw error;
    }
  }
}
