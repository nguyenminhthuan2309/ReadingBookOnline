import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, IsNull, Repository } from 'typeorm';
import { Book } from '@features/book/entities/book.entity';
import { DatabaseService } from '@core/database/database.service';
import {
  GetBookRequestDto,
  GetBookResponseDto,
  SortByOptions,
  SortTypeOptions,
} from './dto/get-book-request.dto';
import { LoggerService } from '@core/logger/logger.service';
import { CacheService } from '@core/cache/cache.service';
import {
  GetBookCategoryDto,
  GetBookCategoryRequestDto,
  GetBookCateogryResponseDto,
} from './dto/get-book-category.dto';
import { BookCategory } from './entities/book-category.entity';
import { bookConfig } from '@core/config/global';
import { GetBookDetail, GetBookDto } from './dto/get-book.dto';
import { GetProgressStatusDto } from './dto/get-book-progess-status.dto';
import { BookProgressStatus } from './entities/book-progess-status.entity';
import { BookAccessStatus } from './entities/book-access-status.entity';
import { GetAccessStatusDto } from './dto/get-book-access-status.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BookCategoryRelation } from './entities/book-category-relation.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookChapterDto } from './dto/create-book-chapter.dto';
import { BookChapter } from './entities/book-chapter.entity';
import { UpdateBookChapterDto } from './dto/update-book-chapter.dto';
import { User } from '@features/user/entities/user.entity';
import {
  CreateBookReviewDto,
  UpdateBookReviewDto,
} from './dto/book-review.dto';
import { BookReview } from './entities/book-review.entity';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import {
  PaginationNotificationResponseDto,
  PaginationResponseDto,
} from '@shared/dto/common/pagnination/pagination-response.dto';
import {
  BookChapterCommentResponseDto,
  CreateBookChapterCommentDto,
  UpdateBookChapterCommentDto,
} from './dto/book-chapter-comment.dto';
import { BookChapterComment } from './entities/book-chapter-comment.entity';
import { BookReviewResponseDto } from './dto/get-book-review.dto';
import { BookFollow } from './entities/book-follow.entity';
import { BookFollowDto, BookFollowResponseDto } from './dto/book-follow.dto';
import { BookReportDto, BookReportResponseDto } from './dto/book-report.dto';
import { BookReport } from './entities/book-report.entity';
import { GetBookTypeDto } from './dto/book-type.dto';
import { BookType } from './entities/book-type.entity';
import {
  BookReadingHistoryResponseDto,
  CreateBookReadingHistoryDto,
} from './dto/create-book-reading-history.dto';
import { BookReadingHistory } from './entities/book-reading-history.entity';
import { GetBookChapterDto } from './dto/get-book-chapter.dto';
import { format, parseISO } from 'date-fns';
import { BookNotification } from './entities/book-notification.entity';
import { BookNotificationGateway } from '@core/gateway/book-notification.gateway';
import { UserResponseDto } from '@features/user/dto/get-user-response.dto';
import { BookNotificationResponseDto } from './dto/book-notification.dto';
import { ChapterPurchase } from '@features/transaction/entities/chapter-purchase.entity';

@Injectable()
export class BookService {
  private readonly redisBookTtl = bookConfig.redisBookTtl;
  private readonly adminMail = 'iiiimanhiiii007@gmail.com';

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCategory)
    private readonly bookCategoryRepository: Repository<BookCategory>,
    @InjectRepository(BookType)
    private readonly bookTypeRepository: Repository<BookType>,
    @InjectRepository(BookProgressStatus)
    private readonly bookProgressStatusRepository: Repository<BookProgressStatus>,
    @InjectRepository(BookAccessStatus)
    private readonly bookAccessStatusRepository: Repository<BookAccessStatus>,
    @InjectRepository(BookChapter)
    private readonly bookChapterRepository: Repository<BookChapter>,
    @InjectRepository(BookCategoryRelation)
    private readonly bookCategoryRelationRepository: Repository<BookCategoryRelation>,
    @InjectRepository(BookReview)
    private readonly bookReviewRepository: Repository<BookReview>,
    @InjectRepository(BookChapterComment)
    private readonly bookChapterCommentRepository: Repository<BookChapterComment>,
    @InjectRepository(BookReport)
    private readonly bookReportRepository: Repository<BookReport>,
    @InjectRepository(BookFollow)
    private readonly bookFollowRepository: Repository<BookFollow>,
    @InjectRepository(BookReadingHistory)
    private readonly bookReadingHistoryRepository: Repository<BookReadingHistory>,
    @InjectRepository(BookNotification)
    private readonly bookNotificationRepository: Repository<BookNotification>,
    @InjectRepository(ChapterPurchase)
    private readonly chapterPurchaseRepository: Repository<ChapterPurchase>,
    private readonly cacheService: CacheService,
    private readonly databaseService: DatabaseService,
    private readonly loggerService: LoggerService,
    private readonly bookNotificationGateway: BookNotificationGateway,
  ) {}

  private getStatusMessage(title: string, accessStatusId: number): string {
    if (accessStatusId === 3) {
      return `Blocked: ${title} has been blocked due to community standards violations. To appeal, please contact via email: ${this.adminMail}`;
    } else if (accessStatusId === 4) {
      return `Pending: ${title} is under review for suspected community standards violations. You will temporarily not be able to update this book during the review. To appeal, please contact via email: ${this.adminMail}`;
    } else if (accessStatusId === 1) {
      return ` ${title} has been restored. We apologize for the inconvenience caused.`;
    }

    return '';
  }

  async getAllBooks(
    user: UserResponseDto,
    params: GetBookRequestDto,
  ): Promise<GetBookResponseDto> {
    try {
      let {
        page = 1,
        limit = 10,
        userId,
        search,
        bookTypeId,
        accessStatusId,
        progressStatusId,
        categoryId,
        sortBy = 'updatedAt',
        sortType = 'DESC',
        hasChapters = false,
      } = params;

      const cachedKey = `books:${userId || 'all'}:${search || 'all'}:${bookTypeId || 'all'}:${accessStatusId || 'all'}:${progressStatusId || 'all'}:${categoryId || 'all'}:sortBy${sortBy}:sortType${sortType}:p${page}:l${limit}`;
      const cachedPage = await this.cacheService.get(cachedKey);
      if (cachedPage) {
        return JSON.parse(cachedPage);
      }

      const qb = this.databaseService
        .queryBuilder(this.bookRepository, 'book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.bookType', 'bookType')
        .leftJoinAndSelect('book.accessStatus', 'accessStatus')
        .leftJoinAndSelect('book.progressStatus', 'progressStatus')
        .leftJoinAndSelect('book.bookCategoryRelations', 'bcr')
        .leftJoinAndSelect('bcr.category', 'category')
        .leftJoinAndSelect('book.chapters', 'chapters');

      if (userId) {
        qb.andWhere('author.id = :userId', { userId });
      }
      if (bookTypeId) {
        qb.andWhere('bookType.id = :bookTypeId', { bookTypeId });
      }
      if (accessStatusId && accessStatusId.length > 0) {
        qb.andWhere('accessStatus.id IN (:...accessStatusId)', {
          accessStatusId,
        });
      }
      if (progressStatusId) {
        qb.andWhere('progressStatus.id = :progressStatusId', {
          progressStatusId,
        });
      }
      if (categoryId && categoryId.length > 0) {
        qb.andWhere(
          `book.id IN (
            SELECT bcr.book_id
            FROM book_category_relation bcr
            WHERE bcr.category_id IN (:...categoryId)
            GROUP BY bcr.book_id
            HAVING COUNT(DISTINCT bcr.category_id) = :categoryCount
          )`,
          { categoryId, categoryCount: categoryId.length },
        );
      }
      if (search) {
        qb.andWhere(
          `(to_tsvector('simple', unaccent(lower(book.title))) @@ websearch_to_tsquery(unaccent(lower(:search))) 
             OR to_tsvector('simple', unaccent(lower(author.name))) @@ websearch_to_tsquery(unaccent(lower(:search)))
             OR unaccent(lower(book.title)) ILIKE :prefixSearch 
             OR unaccent(lower(author.name)) ILIKE :prefixSearch)`,
          {
            search: search.replace(/\s+/g, ' & '),
            prefixSearch: `%${search}%`,
          },
        );
      }
      if (hasChapters) {
        qb.andWhere('chapters.id IS NOT NULL');
      }

      if (sortBy === SortByOptions.VIEWS) {
        qb.orderBy('book.views', sortType as SortTypeOptions);
      } else if (sortBy === SortByOptions.TITLE) {
        qb.orderBy('book.title', sortType as SortTypeOptions);
      } else if (sortBy === SortByOptions.CREATED_AT) {
        qb.orderBy('book.createdAt', sortType as SortTypeOptions);
      } else if (sortBy === SortByOptions.UPDATED_AT) {
        qb.orderBy('book.updatedAt', sortType as SortTypeOptions);
      }

      qb.skip((page - 1) * limit).take(limit);

      const [books, total] = await qb.getManyAndCount();

      let purchasedChapterIds = new Set<number>();
      let followedBookIds = new Set<number>();
      if (user && user.id) {
        const purchases = await this.chapterPurchaseRepository.find({
          where: { user: { id: user.id } },
          relations: ['chapter'],
        });
        const follows = await this.bookFollowRepository.find({
          where: { user: { id: user.id } },
          relations: ['book'],
        });
        purchasedChapterIds = new Set(purchases.map((p) => p.chapter.id));
        followedBookIds = new Set(follows.map((f) => f.book.id));
      }

      books.forEach((book) => {
        book['isFollowed'] = followedBookIds.has(book.id);

        if (book.chapters && book.chapters.length > 0) {
          book.chapters.sort((a, b) => Number(a.chapter) - Number(b.chapter));

          book.chapters = book.chapters.map((chapter) => {
            if (user && user.id && book.author && book.author.id === user.id) {
              return { ...chapter, isLocked: false } as BookChapter;
            } else if (chapter.isLocked) {
              if (purchasedChapterIds.has(chapter.id)) {
                return { ...chapter, isLocked: false } as BookChapter;
              } else {
                return {
                  id: chapter.id,
                  title: chapter.title,
                  chapter: chapter.chapter,
                  isLocked: true,
                  content: undefined,
                  cover: undefined,
                  price: undefined,
                  book: undefined,
                  createdAt: chapter.createdAt,
                  updatedAt: chapter.updatedAt,
                } as unknown as BookChapter;
              }
            }
            return chapter;
          });
        }
      });

      const response: GetBookResponseDto = {
        totalItems: total,
        totalPages: total > 0 ? Math.ceil(total / limit) : 1,
        data: books.map((book) =>
          plainToInstance(GetBookDto, book, { excludeExtraneousValues: true }),
        ),
      };

      // await this.cacheService.set(
      //   cachedKey,
      //   JSON.stringify(response),
      //   this.redisBookTtl,
      // );

      return response;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getAllBooks');
      throw error;
    }
  }

  async getBookDetail(user: UserResponseDto, bookId: number): Promise<any> {
    try {
      const cachedKey = `book:detail:${bookId}`;

      const cachedBook = await this.cacheService.get(cachedKey);
      if (cachedBook) {
        return JSON.parse(cachedBook);
      }

      const qb = this.databaseService
        .queryBuilder(this.bookRepository, 'book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.bookType', 'bookType')
        .leftJoinAndSelect('book.accessStatus', 'accessStatus')
        .leftJoinAndSelect('book.progressStatus', 'progressStatus')
        .leftJoinAndSelect('book.bookCategoryRelations', 'bcr')
        .leftJoinAndSelect('bcr.category', 'category')
        .leftJoinAndSelect('book.chapters', 'chapters')
        .where('book.id = :bookId', { bookId })
        .addOrderBy('chapters.chapter', 'ASC');

      const book = await qb.getOne();

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      if (book.author.id !== user.id) {
        await this.databaseService
          .queryBuilder(this.bookRepository, 'book')
          .update(Book)
          .set({
            views: () => 'views + 1',
            updatedAt: () => 'updated_at',
          })
          .where('id = :bookId', { bookId })
          .execute();
      }

      const ratingResult = await this.databaseService
        .queryBuilder(this.bookReviewRepository, 'review')
        .select('ROUND(AVG(review.rating)::numeric, 1)', 'avgRating')
        .where('review.book_id = :bookId', { bookId })
        .getRawOne();
      const avgRating = Number(ratingResult.avgRating) || 0;

      const purchasedChapterIds = new Set<number>();
      let isFollowed = false;
      if (user && user.id) {
        const purchases = await this.chapterPurchaseRepository.find({
          where: { user: { id: user.id } },
          relations: ['chapter'],
        });
        const follow = await this.bookFollowRepository.findOne({
          where: {
            user: { id: user.id },
            book: { id: bookId },
          },
        });
        isFollowed = !!follow;
        purchases.forEach((purchase) =>
          purchasedChapterIds.add(purchase.chapter.id),
        );
      }

      book.chapters = book.chapters.map((chapter) => {
        if (user && user.id && book.author && book.author.id === user.id) {
          return { ...chapter, isLocked: false } as BookChapter;
        } else if (chapter.isLocked) {
          if (purchasedChapterIds.has(chapter.id)) {
            return { ...chapter, isLocked: false } as BookChapter;
          } else {
            return {
              id: chapter.id,
              title: chapter.title,
              chapter: chapter.chapter,
              isLocked: true,
              content: undefined,
              cover: undefined,
              price: undefined,
              book: undefined,
              createdAt: chapter.createdAt,
              updatedAt: chapter.updatedAt,
            } as unknown as BookChapter;
          }
        }
        return chapter;
      });

      const bookDto = plainToInstance(GetBookDetail, book, {
        excludeExtraneousValues: true,
      });
      bookDto.rating = avgRating;
      bookDto.isFollowed = isFollowed;

      const response: GetBookResponseDto = {
        totalItems: 1,
        totalPages: 1,
        data: [bookDto],
      };

      // await this.cacheService.set(
      //   cachedKey,
      //   JSON.stringify(response),
      //   this.redisBookTtl,
      // );

      return response;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getBookDetail');
      throw error;
    }
  }

  async getBookCategory(
    params: GetBookCategoryRequestDto,
  ): Promise<GetBookCateogryResponseDto> {
    try {
      let { limit = 10, page = 1 } = params;
      const offset = (page - 1) * limit;
      const cachedKey = `books:category:list:${page}:${limit}`;

      const cachedPage = await this.cacheService.get(cachedKey);
      if (cachedPage) {
        return JSON.parse(cachedPage);
      }

      const [categories, total] =
        await this.bookCategoryRepository.findAndCount({
          select: ['id', 'name', 'createdAt', 'updatedAt'],
          order: { id: 'ASC' },
          skip: offset,
          take: limit,
        });

      const categoryIds = categories.map((c) => c.id);

      const rawCounts: {
        category_id: number;
        book_count: number;
      }[] = await this.bookCategoryRelationRepository
        .createQueryBuilder('relation')
        .select('relation.category_id', 'category_id')
        .addSelect('COUNT(DISTINCT relation.book_id)', 'book_count')
        .where('relation.category_id IN (:...categoryIds)', { categoryIds })
        .groupBy('relation.category_id')
        .getRawMany();

      const bookCountMap = new Map<number, number>();
      rawCounts.forEach((row) => {
        bookCountMap.set(Number(row.category_id), Number(row.book_count));
      });

      const response: GetBookCateogryResponseDto = {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        data: categories.map((category) => {
          const dto = plainToInstance(GetBookCategoryDto, category, {
            excludeExtraneousValues: true,
          });

          dto.totalBooks = bookCountMap.get(category.id) || 0;
          return dto;
        }),
      };

      return response;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getBookCategory');
      throw error;
    }
  }

  async getBookType(): Promise<GetBookTypeDto[]> {
    try {
      const types = await this.databaseService.findAll(
        this.bookTypeRepository,
        { order: { id: 'ASC' } },
      );
      if (!types || types.length === 0) {
        throw new NotFoundException('Không tìm thấy loại sách nào');
      }
      return plainToInstance(GetBookTypeDto, types, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getProgressStatus');
      throw error;
    }
  }

  async getProgressStatus(user): Promise<GetProgressStatusDto[]> {
    try {
      const roleId = user.role.id;
      const filter = roleId === 3 ? { id: In([1, 2, 3]) } : {};

      const statuses = await this.databaseService.findAll(
        this.bookProgressStatusRepository,
        { where: filter, order: { id: 'ASC' } },
      );

      const dtos = plainToInstance(GetProgressStatusDto, statuses, {
        excludeExtraneousValues: true,
      });

      return Array.isArray(dtos) ? dtos : [dtos];
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getProgressStatus');
      throw error;
    }
  }

  async getAccessStatus(user): Promise<GetAccessStatusDto[]> {
    try {
      const roleId = user.role.id;
      const filter = roleId === 3 ? { id: In([1, 2]) } : {};

      const statuses = await this.databaseService.findAll(
        this.bookAccessStatusRepository,
        { where: filter, order: { id: 'ASC' } },
      );

      const dtos = plainToInstance(GetAccessStatusDto, statuses, {
        excludeExtraneousValues: true,
      });

      return Array.isArray(dtos) ? dtos : [dtos];
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getAccessStatus');
      throw error;
    }
  }

  async createBook(
    dto: CreateBookDto,
    author: Book['author'],
  ): Promise<number> {
    try {
      const book = await this.databaseService.create(this.bookRepository, {
        title: dto.title,
        description: dto.description,
        cover: dto.cover,
        ageRating: dto.ageRating,
        bookType: { id: dto.bookTypeId },
        accessStatus: { id: dto.accessStatusId },
        progressStatus: { id: dto.progressStatusId },
        author: { id: author.id },
      });

      if (dto.categoryIds && dto.categoryIds.length > 0) {
        dto.categoryIds.map((categoryId) =>
          this.databaseService.create(this.bookCategoryRelationRepository, {
            book: book,
            category: { id: categoryId },
          }),
        );
      }

      await this.cacheService.deletePattern('books:*');

      return book.id;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.createBook');
      throw error;
    }
  }

  async updateBook(
    bookId: number,
    dto: UpdateBookDto,
    author: Book['author'],
  ): Promise<boolean> {
    try {
      const book = await this.databaseService.findOne(this.bookRepository, {
        where: { id: bookId },
        relations: ['author'],
      });
      if (!book) {
        throw new NotFoundException('Không tìm thấy sách');
      }

      if (book.author.id !== author.id) {
        throw new ForbiddenException('Bạn không có quyền cập nhật sách này');
      }

      await this.databaseService.update(this.bookRepository, bookId, {
        title: dto.title,
        description: dto.description,
        cover: dto.cover,
        ageRating: dto.ageRating,
        accessStatus: { id: dto.accessStatusId },
        progressStatus: { id: dto.progressStatusId },
      });

      if (dto.categoryIds && dto.categoryIds.length > 0) {
        await this.bookCategoryRelationRepository.delete({
          book: { id: bookId },
        });

        for (const categoryId of dto.categoryIds) {
          await this.databaseService.create(
            this.bookCategoryRelationRepository,
            {
              book: { id: bookId },
              category: { id: categoryId },
            },
          );
        }
      }

      await this.cacheService.deletePattern('books:*');

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.updateBook');
      throw error;
    }
  }

  async deleteBook(bookId: number, author: Book['author']): Promise<boolean> {
    try {
      const book = await this.databaseService.findOne(this.bookRepository, {
        where: { id: bookId },
        relations: ['author'],
      });
      if (!book) {
        throw new NotFoundException('Không tìm thấy sách');
      }

      if (book.author.id !== author.id) {
        throw new ForbiddenException('Bạn không có quyền xóa sách này');
      }

      await this.databaseService.delete(this.bookRepository, bookId);
      this.loggerService.info(
        `Book with id ${bookId} deleted`,
        'BookService.deleteBook',
      );

      await this.cacheService.deletePattern('books:*');

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.deleteBook');
      throw error;
    }
  }

  async createChapter(
    dto: CreateBookChapterDto,
    bookId: number,
    author: Book['author'],
  ): Promise<boolean> {
    try {
      const book = await this.databaseService.findOne(this.bookRepository, {
        where: { id: bookId },
        relations: ['author'],
      });

      if (!book) {
        throw new NotFoundException('Không tìm thấy sách');
      }

      if (book.author.id !== author.id) {
        throw new ForbiddenException(
          'Bạn không có quyền thêm chương vào sách này',
        );
      }

      const existingChapter = await this.databaseService.findOne(
        this.bookChapterRepository,
        {
          where: { book: { id: bookId }, chapter: dto.chapter },
        },
      );

      if (existingChapter) {
        throw new BadRequestException('Chương này đã tồn tại');
      }

      const newChapter = await this.databaseService.create(
        this.bookChapterRepository,
        {
          title: dto.title,
          chapter: dto.chapter,
          content: dto.content,
          cover: dto.cover,
          isLocked: dto.isLocked,
          price: dto.price,
          book: { id: book.id },
        },
      );

      await this.databaseService.update(this.bookRepository, book.id, {
        updatedAt: new Date(),
      });

      await this.cacheService.deletePattern('books:*');

      const followers = await this.databaseService.findAll(
        this.bookFollowRepository,
        {
          where: { book: { id: book.id } },
          relations: ['user'],
        },
      );

      const notificationData = {
        title: 'New Chapter Added',
        message: `Chapter "${newChapter.chapter}" of the book "${book.title}" has just been released`,
        chapterId: newChapter.id,
        bookId: book.id,
        createdAt: newChapter.createdAt,
      };

      for (const follow of followers) {
        await this.databaseService.create(this.bookNotificationRepository, {
          user: follow.user,
          title: notificationData.title,
          message: notificationData.message,
        });

        await this.bookNotificationGateway.sendNewChapterNotification(
          follow.user.id,
          notificationData,
        );
      }

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookChapterService.createChapter');
      throw error;
    }
  }

  async updateChapter(
    chapterId: number,
    dto: UpdateBookChapterDto,
    author: Book['author'],
  ): Promise<boolean> {
    try {
      const chapter = await this.databaseService.findOne(
        this.bookChapterRepository,
        {
          where: { id: chapterId },
          relations: ['book', 'book.author'],
        },
      );

      if (!chapter) {
        throw new NotFoundException('Không tìm thấy chương sách');
      }

      if (chapter.book.author.id !== author.id) {
        throw new ForbiddenException('Bạn không có quyền cập nhật chương này');
      }

      await this.databaseService.update(this.bookChapterRepository, chapterId, {
        title: dto.title,
        chapter: dto.chapter,
        content: dto.content,
        cover: dto.cover,
        isLocked: dto.isLocked,
        price: dto.price,
      });

      await this.databaseService.update(this.bookRepository, chapter.book.id, {
        updatedAt: new Date(),
      });

      await this.cacheService.deletePattern('books:*');

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookChapterService.updateChapter');
      throw error;
    }
  }

  async deleteChapter(
    chapterId: number,
    author: Book['author'],
  ): Promise<boolean> {
    try {
      const chapter = await this.databaseService.findOne(
        this.bookChapterRepository,
        {
          where: { id: chapterId },
          relations: ['book', 'book.author'],
        },
      );

      if (!chapter) {
        throw new NotFoundException('Không tìm thấy chương sách');
      }

      if (chapter.book.author.id !== author.id) {
        throw new ForbiddenException('Bạn không có quyền xóa chương này');
      }

      await this.databaseService.delete(this.bookChapterRepository, chapterId);
      this.loggerService.info(
        `Chapter with id ${chapterId} deleted`,
        'BookChapterService.deleteChapter',
      );

      await this.databaseService.update(this.bookRepository, chapter.book.id, {
        updatedAt: new Date(),
      });

      await this.cacheService.deletePattern('books:*');

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookChapterService.deleteChapter');
      throw error;
    }
  }

  async getChapter(
    user: UserResponseDto,
    chapterId: number,
  ): Promise<GetBookChapterDto> {
    try {
      const chapter = await this.databaseService.findOne<BookChapter>(
        this.bookChapterRepository,
        {
          where: { id: chapterId },
          relations: [
            'book',
            'book.bookType',
            'book.author',
            'book.accessStatus',
            'book.bookCategoryRelations',
            'book.bookCategoryRelations.category',
          ],
        },
      );

      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }

      if (
        user &&
        user.id &&
        chapter.book &&
        chapter.book.author &&
        chapter.book.author.id === user.id
      ) {
        chapter.isLocked = false;
      } else if (chapter.isLocked) {
        let isPurchased = false;
        if (user && user.id) {
          const purchase = await this.chapterPurchaseRepository.findOne({
            where: { user: { id: user.id }, chapter: { id: chapter.id } },
          });
          isPurchased = Boolean(purchase);
        }

        if (isPurchased) {
          chapter.isLocked = false;
        } else {
          const summaryChapter = {
            id: chapter.id,
            title: chapter.title,
            chapter: chapter.chapter,
            isLocked: true,
            content: undefined,
            cover: undefined,
            price: undefined,
            book: undefined,
            createdAt: chapter.createdAt,
            updatedAt: chapter.updatedAt,
          } as unknown as BookChapter;

          return plainToInstance(GetBookChapterDto, summaryChapter, {
            excludeExtraneousValues: true,
          });
        }
      }

      return plainToInstance(GetBookChapterDto, chapter, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.loggerService.err(error.message, 'BookChapterService.getChapter');
      throw error;
    }
  }

  async createReview(
    bookId: number,
    user: User,
    dto: CreateBookReviewDto,
  ): Promise<BookReview> {
    try {
      const review = this.bookReviewRepository.create({
        book: { id: bookId },
        user: { id: user.id },
        rating: dto.rating,
        comment: dto.comment,
      });

      return await this.bookReviewRepository.save(review);
    } catch (error) {
      this.loggerService.err(error.message, 'BookReviewService.createReview');
      throw error;
    }
  }

  async updateReview(
    reviewId: number,
    user: User,
    dto: UpdateBookReviewDto,
  ): Promise<BookReview> {
    try {
      const review = await this.bookReviewRepository.findOne({
        where: { id: reviewId },
        relations: ['user'],
      });

      if (!review) throw new NotFoundException('Không tìm thấy đánh giá');

      if (review.user.id !== user.id)
        throw new ForbiddenException(
          'Bạn không thể sửa đánh giá của người khác',
        );

      Object.assign(review, dto);

      return await this.bookReviewRepository.save(review);
    } catch (error) {
      this.loggerService.err(error.message, 'BookReviewService.updateReview');
      throw error;
    }
  }

  async deleteReview(reviewId: number, user: User): Promise<void> {
    try {
      const review = await this.bookReviewRepository.findOne({
        where: { id: reviewId },
        relations: ['user'],
      });

      if (!review) throw new NotFoundException('Không tìm thấy đánh giá');

      if (review.user.id !== user.id)
        throw new ForbiddenException(
          'Bạn không thể xóa đánh giá của người khác',
        );

      await this.bookReviewRepository.remove(review);
    } catch (error) {
      this.loggerService.err(error.message, 'BookReviewService.deleteReview');
      throw error;
    }
  }

  async getReviews(
    bookId: number,
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<BookReviewResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;
      const [data, totalItems] = await this.bookReviewRepository.findAndCount({
        where: { book: { id: bookId } },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
        relations: ['user'],
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: plainToInstance(BookReviewResponseDto, data, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      this.loggerService.err(error.message, 'BookReviewService.getReviews');
      throw error;
    }
  }

  async createComment(
    chapterId: number,
    user: User,
    dto: CreateBookChapterCommentDto,
  ): Promise<Boolean> {
    try {
      dto.chapterId = chapterId;

      if (dto.parentId) {
        const parent = await this.databaseService.findOne(
          this.bookChapterCommentRepository,
          {
            where: { id: dto.parentId },
          },
        );
        if (!parent) {
          throw new NotFoundException('Bình luận gốc không tồn tại');
        }
      }

      await this.databaseService.create(this.bookChapterCommentRepository, {
        user,
        chapter: { id: chapterId },
        comment: dto.comment,
        parent: dto.parentId ? { id: dto.parentId } : undefined,
      });

      return true;
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookChapterCommentService.createComment',
      );
      throw error;
    }
  }

  async updateComment(
    commentId: number,
    user: User,
    dto: UpdateBookChapterCommentDto,
  ): Promise<BookChapterComment> {
    try {
      const comment = await this.bookChapterCommentRepository.findOne({
        where: { id: commentId },
        relations: ['user'],
      });

      if (!comment) throw new NotFoundException('Không tìm thấy bình luận');

      if (comment.user.id !== user.id)
        throw new ForbiddenException(
          'Bạn không thể sửa bình luận của người khác',
        );

      Object.assign(comment, dto);
      return await this.bookChapterCommentRepository.save(comment);
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookChapterCommentService.updateComment',
      );
      throw error;
    }
  }

  async deleteComment(commentId: number, user: User): Promise<void> {
    try {
      const comment = await this.bookChapterCommentRepository.findOne({
        where: { id: commentId },
        relations: ['user'],
      });

      if (!comment) throw new NotFoundException('Không tìm thấy bình luận');

      if (comment.user.id !== user.id)
        throw new ForbiddenException(
          'Bạn không thể xóa bình luận của người khác',
        );

      await this.bookChapterCommentRepository.remove(comment);
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookChapterCommentService.deleteComment',
      );
      throw error;
    }
  }

  async getComments(
    pagination: PaginationRequestDto,
    chapterId: number,
    commentId: number,
  ): Promise<PaginationResponseDto<BookChapterCommentResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;

      const whereClause = commentId
        ? { chapter: { id: chapterId }, parent: { id: commentId } }
        : { chapter: { id: chapterId }, parent: IsNull() };

      const [data, totalItems] =
        await this.bookChapterCommentRepository.findAndCount({
          where: whereClause,
          order: { createdAt: 'DESC' },
          take: limit,
          skip: (page - 1) * limit,
          relations: ['user'],
        });

      const dtos = plainToInstance(BookChapterCommentResponseDto, data, {
        excludeExtraneousValues: true,
      }) as BookChapterCommentResponseDto[];

      for (const dto of dtos) {
        dto.totalChildComments = await this.bookChapterCommentRepository.count({
          where: { parent: { id: dto.id } },
        });
      }

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: dtos,
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookChapterCommentService.getComments',
      );
      throw error;
    }
  }

  async followBook(user: User, dto: BookFollowDto): Promise<Boolean> {
    try {
      const book = await this.bookRepository.findOne({
        where: { id: dto.bookId },
      });
      if (!book) throw new NotFoundException('Không tìm thấy sách');

      const isFollowing = await this.bookFollowRepository.findOne({
        where: { user: { id: user.id }, book: { id: dto.bookId } },
      });

      if (isFollowing) return true;

      await this.bookFollowRepository.save({
        user,
        book,
      });

      await this.bookRepository.increment({ id: book.id }, 'followsCount', 1);

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.followBook');
      throw error;
    }
  }

  async unfollowBook(user: User, dto: BookFollowDto): Promise<Boolean> {
    try {
      const followRecord = await this.bookFollowRepository.findOne({
        where: { user: { id: user.id }, book: { id: dto.bookId } },
      });

      if (!followRecord)
        throw new NotFoundException('Bạn chưa theo dõi sách này');

      await this.bookFollowRepository.delete(followRecord.id);

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.unfollowBook');
      throw error;
    }
  }

  async getFollow(
    userId: number,
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<BookFollowResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;
      const [data, totalItems] = await this.bookFollowRepository.findAndCount({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
        relations: [
          'book',
          'book.author',
          'book.bookType',
          'book.accessStatus',
          'book.progressStatus',
          'book.progressStatus',
          'book.bookCategoryRelations',
          'book.bookCategoryRelations.category',
        ],
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: plainToInstance(BookFollowResponseDto, data, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      this.loggerService.err(error.message, 'BookFollowService.getFollow');
      throw error;
    }
  }

  async createReport(
    user: User,
    createReportDto: BookReportDto,
  ): Promise<BookReportResponseDto> {
    try {
      const { bookId, reason } = createReportDto;

      const book = await this.bookRepository.findOne({ where: { id: bookId } });
      if (!book) {
        throw new Error('Sách không tồn tại');
      }

      const report = this.bookReportRepository.create({ user, book, reason });
      await this.bookReportRepository.save(report);

      return plainToInstance(BookReportResponseDto, report, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.loggerService.err(error.message, 'BookReportService.createReport');
      throw error;
    }
  }

  async getReports(
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<BookReportResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;

      const [data, totalItems] = await this.bookReportRepository.findAndCount({
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
        relations: [
          'user',
          'book',
          'book.author',
          'book.bookType',
          'book.accessStatus',
          'book.progressStatus',
          'book.progressStatus',
          'book.bookCategoryRelations',
          'book.bookCategoryRelations.category',
        ],
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: plainToInstance(BookReportResponseDto, data, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      this.loggerService.err(error.message, 'BookReportService.getReports');
      throw error;
    }
  }

  async createReadingHistory(
    user: User,
    dto: CreateBookReadingHistoryDto,
  ): Promise<boolean> {
    try {
      await this.databaseService.create(this.bookReadingHistoryRepository, {
        user: { id: user.id },
        book: { id: dto.bookId },
        chapter: { id: dto.chapterId },
      });

      return true;
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookReadingHistoryService.createReadingHistory',
      );
      throw error;
    }
  }

  async getReadingHistory(
    user: User,
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<BookReadingHistoryResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;

      const subQuery = this.bookReadingHistoryRepository
        .createQueryBuilder('sub')
        .select('MAX(sub.id)', 'id')
        .where('sub.user_id = :userId', { userId: user.id })
        .groupBy('sub.book_id, sub.chapter_id');

      const rawResult = await subQuery.getRawMany();

      const ids = rawResult.map((row) => row.id);

      if (ids.length === 0) {
        return {
          totalItems: 0,
          totalPages: 0,
          data: [],
        };
      }

      const [data, totalItems] =
        await this.bookReadingHistoryRepository.findAndCount({
          where: { id: In(ids) },
          relations: [
            'book',
            'chapter',
            'book.author',
            'book.bookType',
            'book.accessStatus',
            'book.progressStatus',
            'book.bookCategoryRelations',
            'book.bookCategoryRelations.category',
          ],
          order: { createdAt: 'DESC' },
          take: limit,
          skip: (page - 1) * limit,
        });

      const dtos = plainToInstance(BookReadingHistoryResponseDto, data, {
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
        'BookReadingHistoryService.getReadingHistory',
      );
      throw error;
    }
  }

  async updateBookStatus(
    bookId: number,
    user: UserResponseDto,
    accessStatusId?: number,
    progressStatusId?: number,
  ): Promise<boolean> {
    try {
      const book = await this.databaseService.findOne(this.bookRepository, {
        where: { id: bookId },
        relations: ['author'],
      });

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      const updatePayload: any = {};
      if (accessStatusId !== undefined) {
        updatePayload.accessStatus = { id: accessStatusId };
      }
      if (progressStatusId !== undefined) {
        updatePayload.progressStatus = { id: progressStatusId };
      }

      if (Object.keys(updatePayload).length > 0) {
        await this.databaseService.update(
          this.bookRepository,
          bookId,
          updatePayload,
        );
      }

      const roleId = user.role?.id;

      if (
        accessStatusId !== undefined &&
        (accessStatusId === 4 ||
          accessStatusId === 3 ||
          (accessStatusId === 1 && roleId !== 1))
      ) {
        const statusMessage = this.getStatusMessage(book.title, accessStatusId);

        await this.databaseService.create(this.bookNotificationRepository, {
          user: { id: book.author.id },
          title: 'Book Status Updated',
          message: statusMessage,
        });

        this.loggerService.info(
          'Inserted book notification',
          'BookService.updateBookStatuses',
        );

        this.bookNotificationGateway.sendBookStatusNotification(
          book.author.id,
          {
            title: 'Book Status Updated',
            message: statusMessage,
            bookId: book.id,
            createdAt: new Date(),
          },
        );
      }

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.updateBookStatuses');
      throw error;
    }
  }

  async getReadingHistoryChart(
    timeRange: 'daily' | 'weekly' | 'monthly' = 'daily',
  ): Promise<{ time: string; books: { title: string; count: number }[] }[]> {
    try {
      let dateFormat = 'YYYY-MM-DD';
      let whereClause = '';

      if (timeRange === 'daily') {
        dateFormat = 'YYYY-MM-DD';
        whereClause = `WHERE brh.created_at >= CURRENT_DATE - INTERVAL '30 days'`;
      } else if (timeRange === 'weekly') {
        dateFormat = 'IYYY-IW';
        whereClause = `WHERE brh.created_at >= CURRENT_DATE - INTERVAL '14 weeks'`;
      } else if (timeRange === 'monthly') {
        dateFormat = 'YYYY-MM';
        whereClause = `WHERE brh.created_at >= CURRENT_DATE - INTERVAL '12 months'`;
      }

      const query = `
       SELECT 
        to_char(brh.created_at, $1) as time,
        b.title,
        COUNT(brh.id) AS count
      FROM book_reading_history brh
      JOIN book b ON brh.book_id = b.id
      ${whereClause}
      GROUP BY time, b.id
      ORDER BY time DESC, count DESC`;

      const rawResult: any[] = await this.databaseService.executeRawQuery(
        query,
        [dateFormat],
      );

      const groupedData = rawResult.reduce(
        (acc: Record<string, { title: string; count: number }[]>, row) => {
          const time = row.time;
          if (!acc[time]) {
            acc[time] = [];
          }
          acc[time].push({
            title: row.title,
            count: Number(row.count),
          });
          return acc;
        },
        {},
      );

      const chartData = Object.keys(groupedData).map((element) => {
        let formattedTime = element;
        if (timeRange === 'daily') {
          formattedTime = format(parseISO(element), 'dd-MM-yyyy');
        } else if (timeRange === 'weekly') {
          const [year, week] = element.split('-');
          formattedTime = `Tuần ${week}-${year}`;
        } else if (timeRange === 'monthly') {
          formattedTime = format(parseISO(element), 'MM-yyyy');
        }

        const sortedBooks = groupedData[element]
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
        return { time: formattedTime, books: sortedBooks };
      });

      return chartData;
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookService.getReadingHistoryChart',
      );
      throw error;
    }
  }

  async markNotificationAsRead(
    notificationId: number,
    user: UserResponseDto,
  ): Promise<Boolean> {
    try {
      const userInfo = user;

      const notification = await this.databaseService.findOne(
        this.bookNotificationRepository,
        {
          where: { id: notificationId, user: { id: userInfo.id } },
          relations: ['user'],
        },
      );
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      if (userInfo.id !== notification.user.id) {
        throw new ForbiddenException(
          'You are not allowed to mark this notification as read',
        );
      }

      if (notification.isRead) {
        return true;
      }

      await this.databaseService.update(
        this.bookNotificationRepository,
        notification.id,
        {
          isRead: true,
        },
      );

      return true;
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookService.markNotificationAsRead',
      );
      throw error;
    }
  }

  async markAllNotificationsAsRead(user: UserResponseDto): Promise<Boolean> {
    try {
      const userInfo = user;

      const unreadNotifications = await this.databaseService.findAll(
        this.bookNotificationRepository,
        {
          where: { user: { id: userInfo.id }, isRead: false },
          relations: ['user'],
        },
      );

      if (unreadNotifications.length === 0) {
        return true;
      }

      if (userInfo.id !== unreadNotifications[0].user.id) {
        throw new ForbiddenException(
          'You are not allowed to mark this notification as read',
        );
      }

      await this.bookNotificationRepository.update(
        { user: { id: userInfo.id }, isRead: false },
        { isRead: true },
      );

      return true;
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookService.markAllNotificationAsRead',
      );
      throw error;
    }
  }

  async getBookNotification(
    user: User,
    pagination: PaginationRequestDto,
  ): Promise<PaginationNotificationResponseDto<BookNotificationResponseDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;
      const [data, totalItems] =
        await this.bookNotificationRepository.findAndCount({
          where: { user: { id: user.id } },
          order: { createdAt: 'DESC' },
          relations: ['user'],
          take: limit,
          skip: (page - 1) * limit,
        });

      const totalUnread = await this.bookNotificationRepository.count({
        where: {
          user: { id: user.id },
          isRead: false,
        },
      });

      const dtos = plainToInstance(BookNotificationResponseDto, data, {
        excludeExtraneousValues: true,
      });

      return {
        totalItems,
        totalUnread,
        totalPages: Math.ceil(totalItems / limit),
        data: dtos,
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookReadingHistoryService.getBookNotification',
      );
      throw error;
    }
  }
}
