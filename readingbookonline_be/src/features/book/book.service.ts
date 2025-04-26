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
  GetBookCategoryDetailDto,
  GetBookCategoryDto,
} from './dto/get-book-category.dto';
import { BookCategory } from './entities/book-category.entity';
import { bookConfig, openAIConfig } from '@core/config/global';
import { GetBookDetail, GetListBookDto } from './dto/get-book.dto';
import { GetProgressStatusDto } from './dto/get-book-progess-status.dto';
import { BookProgressStatus } from './entities/book-progess-status.entity';
import { BookAccessStatus } from './entities/book-access-status.entity';
import { GetAccessStatusDto } from './dto/get-book-access-status.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BookCategoryRelation } from './entities/book-category-relation.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateMultipleBookChaptersDto } from './dto/create-book-chapter.dto';
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
import { BookFollowDto } from './dto/book-follow.dto';
import { BookReportDto, BookReportResponseDto } from './dto/book-report.dto';
import { BookReport } from './entities/book-report.entity';
import { GetBookTypeDto } from './dto/book-type.dto';
import { BookType } from './entities/book-type.entity';
import {
  BookReadingSummaryDto,
  ChapterReadDto,
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
import { GetTrendingBooksDto } from './dto/book-trending.dto';
import { GetRecommendedBooksDto } from './dto/book-recommend.dto';
import { UserFavorite } from '@features/user/entities/user-favorite.entity';
import { GetRelatedBooksDto } from './dto/book-related.dto';
import OpenAI from 'openai';

@Injectable()
export class BookService {
  private readonly openAIKey = openAIConfig.openAIKey;
  private readonly redisBookTtl = bookConfig.redisBookTtl;
  private readonly adminMail = 'iiiimanhiiii007@gmail.com';
  private readonly privateBookStatus = 2;

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
    @InjectRepository(UserFavorite)
    private readonly userFavoriteRepository: Repository<UserFavorite>,
    private readonly cacheService: CacheService,
    private readonly databaseService: DatabaseService,
    private readonly loggerService: LoggerService,
    private readonly bookNotificationGateway: BookNotificationGateway,
  ) {}

  private async getQueryEmbedding(query: string) {
    try {
      const openai = new OpenAI({ apiKey: this.openAIKey });
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: query,
      });
      return response.data[0].embedding;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getQueryEmbedding');
      throw error;
    }
  }

  private getStatusMessage(title: string, accessStatusId: number): string {
    if (accessStatusId === 3) {
      return `Blocked: ${title} has been blocked due to community standards violations. To appeal, please contact via email: ${this.adminMail}`;
    } else if (accessStatusId === 4) {
      return `Pending: ${title} is under review for suspected community standards violations. You will temporarily not be able to update this book during the review. To appeal, please contact via email: ${this.adminMail}`;
    } else if (accessStatusId === 1) {
      return `Your book "${title}" has successfully passed the review and has been restored. Thank you for your patience.`;
    }

    return '';
  }

  async migrateAddEmbeddingColumn(): Promise<Boolean> {
    try {
      await this.databaseService.executeRawQuery(
        `CREATE EXTENSION IF NOT EXISTS vector`,
      );

      await this.databaseService.executeRawQuery(
        `ALTER TABLE "book"  ADD COLUMN IF NOT EXISTS "embedding" vector(1536)`,
      );

      await this.databaseService.executeRawQuery(
        `CREATE INDEX IF NOT EXISTS idx_book_embedding ON "book" USING ivfflat ("embedding" vector_l2_ops) WITH (lists = 100)`,
      );

      console.log(
        '✅ Migration completed: embedding column added with ivfflat index',
      );

      return true;
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookService.migrateAddEmbeddingColumn',
      );
      throw error;
    }
  }

  async migrateBookEmbedding(id: number): Promise<Boolean> {
    try {
      const books = await this.databaseService.findAll(this.bookRepository, {
        where: { id },
        select: ['id', 'description', 'title'],
      });

      for (const book of books) {
        try {
          const combinedText = `${book.title} ${book.description}`;
          const queryEmbedding = await this.getQueryEmbedding(combinedText);
          const embeddingStr = `[${queryEmbedding.join(',')}]`;

          await this.databaseService.executeRawQuery(
            `UPDATE "book" SET "embedding" = $1::vector WHERE id = $2`,
            [embeddingStr, book.id],
          );

          console.log(`✅ Book ID ${book.id} embedding updated`);
        } catch (error) {
          console.error(`❌ Failed embedding for book ID ${book.id}:`, error);
        }
      }

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.migrateBookEmbedding');
      throw error;
    }
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
        .leftJoinAndSelect('book.chapters', 'chapters')
        .leftJoinAndSelect('book.reviews', 'reviews');

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

      let readingHistoriesMap: Map<
        number,
        {
          lastReadChapterId: number;
          lastReadChapterNumber: number;
          totalReadChapters: number;
        }
      > = new Map();
      if (!user) {
        const booksWithChapters = books.filter(
          (book) => book.chapters && book.chapters.length > 0,
        );
        const bookIds = booksWithChapters.map((book) => book.id);

        if (bookIds.length > 0) {
          const firstChapters = await this.bookChapterRepository
            .createQueryBuilder('chapter')
            .select([
              'chapter.id AS id',
              'chapter.chapter AS chapter',
              'chapter.book_id AS bookId',
            ])
            .where('chapter.book_id IN (:...bookIds)', { bookIds })
            .orderBy('chapter.book_id')
            .addOrderBy('chapter.chapter', 'ASC')
            .distinctOn(['chapter.book_id'])
            .getRawMany();

          firstChapters.forEach((chapter) => {
            readingHistoriesMap.set(Number(chapter.bookid), {
              lastReadChapterId: Number(chapter.id),
              lastReadChapterNumber: Number(chapter.chapter),
              totalReadChapters: 0,
            });
          });
        }

        books.forEach((book) => {
          if (!readingHistoriesMap.has(book.id)) {
            readingHistoriesMap.set(book.id, {
              lastReadChapterId: 0,
              lastReadChapterNumber: 0,
              totalReadChapters: 0,
            });
          }
        });
      } else if (user && user.id && books.length > 0) {
        const bookIds = books.map((book) => book.id);

        const subQuery = this.bookReadingHistoryRepository
          .createQueryBuilder('sub_history')
          .select([
            'MAX(sub_history.created_at) AS max_created_at',
            'sub_history.user_id AS user_id',
            'sub_history.book_id AS book_id',
          ])
          .where('sub_history.user_id = :userId', { userId: user.id })
          .andWhere('sub_history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('sub_history.user_id, sub_history.book_id');

        const rawHistories = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.chapter_id AS lastReadChapterId',
            'history.book_id AS bookId',
            'history.created_at AS createdAt',
          ])
          .innerJoin(
            `(${subQuery.getQuery()})`,
            'latest',
            'history.user_id = latest.user_id AND history.book_id = latest.book_id AND history.created_at = latest.max_created_at',
          )
          .setParameters(subQuery.getParameters())
          .getRawMany();

        const totalChaptersRead = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.book_id AS bookid',
            'COUNT(DISTINCT history.chapter_id) AS totalreadchapters',
          ])
          .where('history.user_id = :userId', { userId: user.id })
          .andWhere('history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('history.book_id')
          .getRawMany();

        const totalChaptersMap = new Map<number, number>();
        totalChaptersRead.forEach((item) => {
          totalChaptersMap.set(
            Number(item.bookid),
            Number(item.totalreadchapters),
          );
        });

        const chapterMap = new Map<number, number>();
        if (rawHistories.length > 0) {
          const chapterIds = rawHistories.map((h) =>
            Number(h.lastreadchapterid),
          );
          const chapters = await this.bookChapterRepository.find({
            where: { id: In(chapterIds) },
          });

          chapters.forEach((chapter) => {
            chapterMap.set(chapter.id, chapter.chapter);
          });

          rawHistories.forEach((history) => {
            const bookId = Number(history.bookid);
            readingHistoriesMap.set(bookId, {
              lastReadChapterId: Number(history.lastreadchapterid) || 0,
              lastReadChapterNumber:
                chapterMap.get(Number(history.lastreadchapterid)) || 0,
              totalReadChapters: totalChaptersMap.get(bookId) || 0,
            });
          });
        }

        const booksWithoutHistory = books.filter(
          (book) => !readingHistoriesMap.has(book.id),
        );

        if (booksWithoutHistory.length > 0) {
          const firstChapters = await this.bookChapterRepository
            .createQueryBuilder('chapter')
            .select([
              'chapter.id AS id',
              'chapter.chapter AS chapter',
              'chapter.book_id AS bookId',
            ])
            .where('chapter.book_id IN (:...bookIds)', {
              bookIds: booksWithoutHistory.map((b) => b.id),
            })
            .orderBy('chapter.book_id')
            .addOrderBy('chapter.chapter', 'ASC')
            .distinctOn(['chapter.book_id'])
            .getRawMany();

          firstChapters.forEach((chapter) => {
            readingHistoriesMap.set(Number(chapter.bookid), {
              lastReadChapterId: Number(chapter.id),
              lastReadChapterNumber: Number(chapter.chapter),
              totalReadChapters: 0,
            });
          });

          booksWithoutHistory.forEach((book) => {
            if (!readingHistoriesMap.has(book.id)) {
              readingHistoriesMap.set(book.id, {
                lastReadChapterId: 0,
                lastReadChapterNumber: 0,
                totalReadChapters: 0,
              });
            }
          });
        }
      }

      let followedBookIds = new Set<number>();
      if (user && user.id) {
        const follows = await this.bookFollowRepository.find({
          where: { user: { id: user.id } },
          relations: ['book'],
        });
        followedBookIds = new Set(follows.map((f) => f.book.id));
      }

      books.forEach((book) => {
        book['isFollowed'] = followedBookIds.has(book.id);

        const chapters = book.chapters || [];
        book['totalChapters'] = chapters.length;

        book['totalPrice'] = chapters.reduce(
          (sum, chapter) => sum + Number(chapter.price || 0),
          0,
        );

        const reviews = book.reviews || [];
        const totalRating = reviews.reduce(
          (sum, r) => sum + (r.rating || 0),
          0,
        );
        book['rating'] =
          reviews.length > 0 ? +(totalRating / reviews.length).toFixed(2) : 0;

        const readingProgress = readingHistoriesMap.get(book.id);
        if (readingProgress) {
          book['readingProgress'] = readingProgress;
        }
      });

      const response: GetBookResponseDto = {
        totalItems: total,
        totalPages: total > 0 ? Math.ceil(total / limit) : 1,
        data: books.map((book) =>
          plainToInstance(GetListBookDto, book, {
            excludeExtraneousValues: true,
          }),
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

  async getBookDetail(
    user: UserResponseDto,
    bookId: number,
  ): Promise<GetBookResponseDto> {
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
        .where('book.id = :bookId', { bookId });

      const book = await qb.getOne();

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      if (!user || book.author.id !== user.id) {
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

      const totalReads = await this.databaseService
        .queryBuilder(this.bookReadingHistoryRepository, 'readingHistory')
        .where('readingHistory.book_id = :bookId', { bookId })
        .getCount();

      const totalPurchases = await this.databaseService
        .queryBuilder(this.chapterPurchaseRepository, 'purchase')
        .leftJoin('purchase.chapter', 'chapter')
        .where('chapter.book_id = :bookId', { bookId })
        .groupBy('purchase.user_id')
        .getCount();

      let isFollowed = false;
      if (user?.id) {
        const follow = await this.bookFollowRepository.findOne({
          where: {
            user: { id: user.id },
            book: { id: bookId },
          },
        });
        isFollowed = !!follow;
      }

      const bookDto = plainToInstance(GetBookDetail, book, {
        excludeExtraneousValues: true,
      });

      bookDto.totalChapters = book.chapters?.length || 0;
      bookDto.totalPrice = book.chapters?.reduce(
        (sum, chapter) => sum + Number(chapter.price || 0),
        0,
      );
      bookDto.rating = avgRating;
      bookDto.isFollowed = isFollowed;
      bookDto.totalReads = totalReads;
      bookDto.totalPurchases = totalPurchases;

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

  async getBookChapters(
    user: UserResponseDto,
    bookId: number,
  ): Promise<BookChapter[]> {
    try {
      const book = await this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.chapters', 'chapters')
        .where('book.id = :bookId', { bookId })
        .orderBy('chapters.chapter', 'ASC')
        .getOne();
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      const purchasedChapterIds = new Set<number>();
      if (user?.id) {
        const purchases = await this.chapterPurchaseRepository.find({
          where: { user: { id: user.id } },
          relations: ['chapter'],
        });
        purchases.forEach((p) => purchasedChapterIds.add(p.chapter.id));
      }

      const chapters = book.chapters
        .sort((a, b) => a.chapter - b.chapter)
        .map((chapter) => {
          if (user?.id && book.author.id === user.id) {
            return { ...chapter, isLocked: false };
          } else if (chapter.isLocked && !purchasedChapterIds.has(chapter.id)) {
            return {
              id: chapter.id,
              title: chapter.title,
              chapter: chapter.chapter,
              cover: chapter.cover,
              isLocked: true,
              price: Number(chapter.price),
              createdAt: chapter.createdAt,
              updatedAt: chapter.updatedAt,
            } as BookChapter;
          } else {
            return { ...chapter, isLocked: false };
          }
        });

      return chapters;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getBookChapters');
      throw error;
    }
  }

  async getBookCategory(params: GetBookCategoryDetailDto) {
    try {
      let {
        userId,
        search,
        bookTypeId,
        accessStatusId,
        progressStatusId,
        categoryId,
        hasChapters = false,
      } = params;

      const cachedKey = `books:category:list:${userId || 'all'}:${search || 'all'}:${bookTypeId || 'all'}:${accessStatusId || 'all'}:${progressStatusId || 'all'}:${categoryId || 'all'}`;
      const cachedPage = await this.cacheService.get(cachedKey);
      if (cachedPage) {
        return JSON.parse(cachedPage);
      }

      const qb = this.databaseService
        .queryBuilder(this.bookCategoryRepository, 'category')
        .leftJoinAndSelect('category.bookCategoryRelations', 'bcr')
        .leftJoinAndSelect('bcr.book', 'book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.bookType', 'bookType')
        .leftJoinAndSelect('book.accessStatus', 'accessStatus')
        .leftJoinAndSelect('book.progressStatus', 'progressStatus')
        .leftJoinAndSelect('book.chapters', 'chapters')
        .leftJoinAndSelect('book.reviews', 'reviews');

      if (userId) {
        qb.andWhere('author.id = :userId', { userId });
      }
      if (bookTypeId) {
        qb.andWhere('bookType.id = :bookTypeId', { bookTypeId });
      }
      if (accessStatusId) {
        qb.andWhere('accessStatus.id IN (:...accessStatusId)', {
          accessStatusId,
        });
      }
      if (progressStatusId) {
        qb.andWhere('progressStatus.id = :progressStatusId', {
          progressStatusId,
        });
      }
      if (categoryId && Array.isArray(categoryId)) {
        qb.andWhere('bcr.category_id IN (:...categoryId)', { categoryId });
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

      const categories = await qb.getMany();

      const allCategories = await this.bookCategoryRepository.find();
      const categoryMap = new Map<number, any>();

      categories.forEach((category) => {
        const dto = plainToInstance(GetBookCategoryDto, category, {
          excludeExtraneousValues: true,
        });
        const booksInCategory = category.bookCategoryRelations.map(
          (relation) => relation.book,
        );
        dto.totalBooks = booksInCategory.length || 0;
        categoryMap.set(category.id, dto);
      });

      allCategories.forEach((category) => {
        if (!categoryMap.has(category.id)) {
          const dto = plainToInstance(GetBookCategoryDto, category, {
            excludeExtraneousValues: true,
          });
          dto.totalBooks = 0;
          categoryMap.set(category.id, dto);
        }
      });

      const response = Array.from(categoryMap.values()).sort(
        (a, b) => a.id - b.id,
      );

      // await this.cacheService.set(
      //   cachedKey,
      //   JSON.stringify(response),
      //   this.redisBookTtl,
      // );

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
      this.loggerService.err(error.message, 'BookService.getBookType');
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
        accessStatus: { id: this.privateBookStatus },
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

  async createChapters(
    dto: CreateMultipleBookChaptersDto,
    bookId: number,
    author: Book['author'],
  ): Promise<boolean> {
    try {
      const book = await this.databaseService.findOne(this.bookRepository, {
        where: { id: bookId },
        relations: ['author'],
      });

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      if (book.author.id !== author.id) {
        throw new ForbiddenException(
          'You do not have permission to add chapters to this book',
        );
      }

      const chapterNumbers = dto.chapters.map((chapter) => chapter.chapter);
      const uniqueChapterNumbers = [...new Set(chapterNumbers)];
      if (chapterNumbers.length !== uniqueChapterNumbers.length) {
        throw new BadRequestException('Chapters in the request are duplicated');
      }

      const existingChapters = await this.databaseService.findAll(
        this.bookChapterRepository,
        {
          where: { book: { id: bookId }, chapter: In(chapterNumbers) },
          select: ['chapter'],
        },
      );

      if (existingChapters.length > 0) {
        const existingChapterNumbers = existingChapters.map(
          (chapter) => chapter.chapter,
        );
        throw new BadRequestException(
          `Chapter ${existingChapterNumbers.join(', ')} already exists`,
        );
      }

      const chaptersToInsert = dto.chapters.map((chapterDto, index) => {
        if (chapterDto.chapter > 3) {
          chapterDto.isLocked = true;
          chapterDto.price = 70;
        } else {
          chapterDto.isLocked = false;
          chapterDto.price = 0;
        }

        return {
          title: chapterDto.title,
          chapter: chapterDto.chapter,
          content: chapterDto.content,
          cover: chapterDto.cover,
          isLocked: chapterDto.isLocked,
          price: chapterDto.price,
          book: { id: book.id },
        };
      });

      await this.bookChapterRepository.save(chaptersToInsert);

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
        title: 'New Chapters Added',
        message: `New chapters of the book "${book.title}" have just been released: ${dto.chapters
          .map((chapter) => `Chapter ${chapter.chapter}`)
          .join(', ')}`,
        bookId: book.id,
        createdAt: new Date(),
      };

      for (const follow of followers) {
        await this.databaseService.create(this.bookNotificationRepository, {
          user: follow.user,
          title: notificationData.title,
          message: notificationData.message,
          book: { id: book.id },
        });

        await this.bookNotificationGateway.sendNewChapterNotification(
          follow.user.id,
          notificationData,
        );
      }

      return true;
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookChapterService.createChapters',
      );
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
      if (!book) throw new NotFoundException('Book Not Found');

      const isFollowing = await this.bookFollowRepository.findOne({
        where: { user: { id: user.id }, book: { id: dto.bookId } },
      });

      if (isFollowing) throw new BadRequestException('Book already followed');

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
  ): Promise<PaginationResponseDto<GetListBookDto>> {
    try {
      const { limit = 10, page = 1 } = pagination;

      const [follows, totalItems] =
        await this.bookFollowRepository.findAndCount({
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
            'book.bookCategoryRelations',
            'book.bookCategoryRelations.category',
            'book.chapters',
            'book.reviews',
          ],
        });

      const books = follows.map((f) => f.book);
      const bookIds = books.map((book) => book.id);

      const subQuery = this.bookReadingHistoryRepository
        .createQueryBuilder('sub_history')
        .select([
          'MAX(sub_history.created_at) AS max_created_at',
          'sub_history.user_id AS user_id',
          'sub_history.book_id AS book_id',
        ])
        .where('sub_history.user_id = :userId', { userId })
        .andWhere('sub_history.book_id IN (:...bookIds)', { bookIds })
        .groupBy('sub_history.user_id, sub_history.book_id');

      const rawHistories = await this.bookReadingHistoryRepository
        .createQueryBuilder('history')
        .select([
          'history.chapter_id AS lastReadChapterId',
          'history.book_id AS bookId',
          'history.created_at AS createdAt',
        ])
        .innerJoin(
          `(${subQuery.getQuery()})`,
          'latest',
          'history.user_id = latest.user_id AND history.book_id = latest.book_id AND history.created_at = latest.max_created_at',
        )
        .setParameters(subQuery.getParameters())
        .getRawMany();

      const totalChaptersRead = await this.bookReadingHistoryRepository
        .createQueryBuilder('history')
        .select([
          'history.book_id AS bookid',
          'COUNT(DISTINCT history.chapter_id) AS totalreadchapters',
        ])
        .where('history.user_id = :userId', { userId })
        .andWhere('history.book_id IN (:...bookIds)', { bookIds })
        .groupBy('history.book_id')
        .getRawMany();

      const totalChaptersMap = new Map<number, number>();
      totalChaptersRead.forEach((item) => {
        totalChaptersMap.set(
          Number(item.bookid),
          Number(item.totalreadchapters),
        );
      });

      const chapterMap = new Map<number, number>();
      if (rawHistories.length > 0) {
        const chapterIds = rawHistories.map((h) => Number(h.lastreadchapterid));
        const chapters = await this.bookChapterRepository.find({
          where: { id: In(chapterIds) },
        });
        chapters.forEach((ch) => {
          chapterMap.set(ch.id, ch.chapter);
        });
      }

      const readingHistoriesMap = new Map<
        number,
        {
          lastReadChapterId: number;
          lastReadChapterNumber: number;
          totalReadChapters: number;
        }
      >();

      rawHistories.forEach((history) => {
        const bookId = Number(history.bookid);
        readingHistoriesMap.set(bookId, {
          lastReadChapterId: Number(history.lastreadchapterid),
          lastReadChapterNumber:
            chapterMap.get(Number(history.lastreadchapterid)) || 0,
          totalReadChapters: totalChaptersMap.get(bookId) || 0,
        });
      });

      const booksWithoutHistory = books.filter(
        (book) => !readingHistoriesMap.has(book.id),
      );
      if (booksWithoutHistory.length > 0) {
        const firstChapters = await this.bookChapterRepository
          .createQueryBuilder('chapter')
          .select([
            'chapter.id AS id',
            'chapter.chapter AS chapter',
            'chapter.book_id AS bookId',
          ])
          .where('chapter.book_id IN (:...bookIds)', {
            bookIds: booksWithoutHistory.map((b) => b.id),
          })
          .orderBy('chapter.book_id')
          .addOrderBy('chapter.chapter', 'ASC')
          .distinctOn(['chapter.book_id'])
          .getRawMany();

        firstChapters.forEach((ch) => {
          readingHistoriesMap.set(Number(ch.bookid), {
            lastReadChapterId: Number(ch.id),
            lastReadChapterNumber: Number(ch.chapter),
            totalReadChapters: 0,
          });
        });

        booksWithoutHistory.forEach((book) => {
          if (!readingHistoriesMap.has(book.id)) {
            readingHistoriesMap.set(book.id, {
              lastReadChapterId: 0,
              lastReadChapterNumber: 0,
              totalReadChapters: 0,
            });
          }
        });
      }

      const finalBooks = books.map((book) => {
        const chapters = book.chapters || [];
        const reviews = book.reviews || [];

        const totalChapters = chapters.length;
        const totalPrice = chapters.reduce(
          (sum, ch) => sum + Number(ch.price || 0),
          0,
        );
        const totalRating = reviews.reduce(
          (sum, r) => sum + (r.rating || 0),
          0,
        );
        const rating =
          reviews.length > 0 ? +(totalRating / reviews.length).toFixed(2) : 0;

        return {
          ...book,
          totalChapters,
          totalPrice,
          rating,
          isFollowed: true,
          readingProgress: readingHistoriesMap.get(book.id),
        };
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: finalBooks.map((book) =>
          plainToInstance(GetListBookDto, book, {
            excludeExtraneousValues: true,
          }),
        ),
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

  async getReadingHistorySummary(
    user: User,
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<BookReadingSummaryDto>> {
    try {
      const { page = 1, limit = 10 } = pagination;

      const readingHistories = await this.bookReadingHistoryRepository.find({
        where: { user: { id: user.id } },
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
      });

      if (!readingHistories.length) {
        return {
          totalItems: 0,
          totalPages: 0,
          data: [],
        };
      }

      const chapterIds = Array.from(
        new Set(readingHistories.map((r) => r.chapter.id)),
      );

      const purchased = await this.chapterPurchaseRepository.find({
        where: {
          user: { id: user.id },
          chapter: { id: In(chapterIds) },
        },
        relations: ['chapter'],
      });

      const purchasedSet = new Set(purchased.map((p) => p.chapter.id));

      const bookMap = new Map<
        number,
        {
          bookDto: BookReadingSummaryDto;
          chapterMap: Map<number, ChapterReadDto>;
          latestTime: number;
        }
      >();

      const follows = await this.bookFollowRepository.find({
        where: { user: { id: user.id } },
        relations: ['book'],
      });

      const followedBookIds = new Set(follows.map((f) => f.book.id));

      for (const history of readingHistories) {
        const { book, chapter, createdAt } = history;

        if (!bookMap.has(book.id)) {
          const chapters = await this.bookChapterRepository.find({
            where: { book: { id: book.id } },
          });
          const totalPrice = chapters.reduce(
            (sum, chapter) => sum + Number(chapter.price || 0),
            0,
          );

          const reviews = await this.bookReviewRepository.find({
            where: { book: { id: book.id } },
          });
          const totalRating = reviews.reduce(
            (sum, r) => sum + (r.rating || 0),
            0,
          );
          const rating =
            reviews.length > 0 ? +(totalRating / reviews.length).toFixed(2) : 0;

          bookMap.set(book.id, {
            bookDto: {
              id: book.id,
              title: book.title,
              description: book.description,
              cover: book.cover,
              views: book.views,
              rating: rating,
              totalChapters: chapters.length,
              totalPrice: totalPrice,
              followsCount: book.followsCount,
              isFollowed: followedBookIds.has(book.id),
              author: {
                id: book.author.id,
                email: book.author.email,
                name: book.author.name,
                avatar: book.author.avatar,
              },
              bookType: {
                id: book.bookType.id,
                name: book.bookType.name,
              },
              accessStatus: {
                id: book.accessStatus.id,
                name: book.accessStatus.name,
                description: book.accessStatus.description,
              },
              progressStatus: {
                id: book.progressStatus.id,
                name: book.progressStatus.name,
                description: book.progressStatus.description,
              },
              categories: book.bookCategoryRelations.map((bcr) => {
                return {
                  id: bcr.category.id,
                  name: bcr.category.name,
                };
              }),
              createdAt: book.createdAt,
              chaptersRead: [],
            },
            chapterMap: new Map<number, ChapterReadDto>(),
            latestTime: createdAt.getTime(),
          });
        }

        const entry = bookMap.get(book.id)!;
        entry.latestTime = Math.max(entry.latestTime, createdAt.getTime());

        const existing = entry.chapterMap.get(chapter.id);
        if (!existing || createdAt.getTime() > existing.lastReadAt.getTime()) {
          entry.chapterMap.set(chapter.id, {
            id: chapter.id,
            title: chapter.title,
            lastReadAt: createdAt,
            isLocked: chapter.isLocked,
          });
        }
      }

      const allBooks = Array.from(bookMap.values())
        .map(({ bookDto, chapterMap, latestTime }) => {
          const chapters = Array.from(chapterMap.values())
            .map((c) => ({
              ...c,
              isLocked: c.isLocked === false ? false : !purchasedSet.has(c.id),
            }))
            .sort((a, b) => b.lastReadAt.getTime() - a.lastReadAt.getTime());

          bookDto.chaptersRead = chapters;

          return {
            ...bookDto,
            _latestTime: latestTime,
          };
        })
        .sort((a, b) => b._latestTime - a._latestTime);

      const totalItems = allBooks.length;
      const totalPages = Math.ceil(totalItems / limit);
      const paginated = allBooks.slice((page - 1) * limit, page * limit);

      const data = paginated.map(({ _latestTime, ...dto }) =>
        plainToInstance(BookReadingSummaryDto, dto, {
          excludeExtraneousValues: true,
        }),
      );

      return {
        totalItems,
        totalPages,
        data,
      };
    } catch (error) {
      this.loggerService.err(
        error.message,
        'BookReadingHistoryService.getReadingHistorySummary',
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
        typeof accessStatusId === 'number' &&
        [1, 3, 4].includes(accessStatusId)
      ) {
        const statusMessage = this.getStatusMessage(book.title, accessStatusId);

        await this.databaseService.create(this.bookNotificationRepository, {
          user: { id: book.author.id },
          title: 'Book Status Updated',
          message: statusMessage,
          book: { id: book.id },
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
          relations: ['user', 'book'],
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

  async getTrendingBooks(
    userId: number | null,
    params: GetTrendingBooksDto,
  ): Promise<PaginationResponseDto<GetListBookDto>> {
    try {
      const { page = 1, limit = 10 } = params;
      const offset = (page - 1) * limit;

      const rawTrending = await this.bookReadingHistoryRepository
        .createQueryBuilder('brh')
        .select('brh.book_id', 'bookId')
        .addSelect('COUNT(*)', 'view_count')
        .innerJoin(Book, 'b', 'b.id = brh.book_id AND b.accessStatus = 1')
        .where("brh.created_at >= NOW() - INTERVAL '30 days'")
        .groupBy('brh.book_id')
        .orderBy('view_count', 'DESC')
        .offset(offset)
        .limit(limit)
        .getRawMany();

      let books: Book[] = [];
      let totalItems = 0;
      let bookIds: number[] = [];

      if (rawTrending.length > 0) {
        bookIds = rawTrending.map((row) => Number(row.bookId));

        const countRows = await this.bookReadingHistoryRepository
          .createQueryBuilder('brh')
          .select('brh.book_id')
          .innerJoin(Book, 'b', 'b.id = brh.book_id AND b.accessStatus = 1')
          .where("brh.created_at >= NOW() - INTERVAL '30 days'")
          .groupBy('brh.book_id')
          .getRawMany();

        totalItems = countRows.length;

        const rawBooks = await this.bookRepository.find({
          where: { id: In(bookIds), accessStatus: { id: 1 } },
          relations: [
            'author',
            'bookType',
            'accessStatus',
            'progressStatus',
            'bookCategoryRelations',
            'bookCategoryRelations.category',
            'chapters',
            'reviews',
          ],
        });

        books = bookIds
          .map((id) => rawBooks.find((b) => b.id === id))
          .filter((book): book is Book => !!book);
      } else {
        totalItems = await this.bookRepository.count({
          where: { accessStatus: { id: 1 } },
        });

        books = await this.bookRepository.find({
          where: { accessStatus: { id: 1 } },
          take: limit,
          skip: offset,
          order: { createdAt: 'DESC' },
          relations: [
            'author',
            'bookType',
            'accessStatus',
            'progressStatus',
            'bookCategoryRelations',
            'bookCategoryRelations.category',
            'chapters',
            'reviews',
          ],
        });

        bookIds = books.map((b) => b.id);
      }

      let followedBookIds = new Set<number>();
      if (userId && bookIds.length > 0) {
        const followedBooks = await this.bookFollowRepository.find({
          where: {
            user: { id: userId },
            book: In(bookIds),
          },
          relations: ['book'],
        });
        followedBookIds = new Set(followedBooks.map((f) => f.book.id));
      }

      const readingHistoriesMap = new Map<
        number,
        {
          lastReadChapterId: number;
          lastReadChapterNumber: number;
          totalReadChapters: number;
        }
      >();

      if (!userId) {
        const booksWithChapters = books.filter(
          (book) => book.chapters && book.chapters.length > 0,
        );
        const bookIds = booksWithChapters.map((book) => book.id);

        if (bookIds.length > 0) {
          const firstChapters = await this.bookChapterRepository
            .createQueryBuilder('chapter')
            .select([
              'chapter.id AS id',
              'chapter.chapter AS chapter',
              'chapter.book_id AS bookId',
            ])
            .where('chapter.book_id IN (:...bookIds)', { bookIds })
            .orderBy('chapter.book_id')
            .addOrderBy('chapter.chapter', 'ASC')
            .distinctOn(['chapter.book_id'])
            .getRawMany();

          firstChapters.forEach((chapter) => {
            readingHistoriesMap.set(Number(chapter.bookid), {
              lastReadChapterId: Number(chapter.id),
              lastReadChapterNumber: Number(chapter.chapter),
              totalReadChapters: 0,
            });
          });
        }

        books.forEach((book) => {
          if (!readingHistoriesMap.has(book.id)) {
            readingHistoriesMap.set(book.id, {
              lastReadChapterId: 0,
              lastReadChapterNumber: 0,
              totalReadChapters: 0,
            });
          }
        });
      } else if (userId && bookIds.length > 0) {
        const subQuery = this.bookReadingHistoryRepository
          .createQueryBuilder('sub_history')
          .select([
            'MAX(sub_history.created_at) AS max_created_at',
            'sub_history.user_id AS user_id',
            'sub_history.book_id AS book_id',
          ])
          .where('sub_history.user_id = :userId', { userId })
          .andWhere('sub_history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('sub_history.user_id, sub_history.book_id');

        const rawHistories = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.chapter_id AS lastReadChapterId',
            'history.book_id AS bookId',
            'history.created_at AS createdAt',
          ])
          .innerJoin(
            `(${subQuery.getQuery()})`,
            'latest',
            'history.user_id = latest.user_id AND history.book_id = latest.book_id AND history.created_at = latest.max_created_at',
          )
          .setParameters(subQuery.getParameters())
          .getRawMany();

        const totalChaptersRead = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.book_id AS bookid',
            'COUNT(DISTINCT history.chapter_id) AS totalreadchapters',
          ])
          .where('history.user_id = :userId', { userId })
          .andWhere('history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('history.book_id')
          .getRawMany();

        const totalChaptersMap = new Map<number, number>();
        totalChaptersRead.forEach((item) => {
          totalChaptersMap.set(
            Number(item.bookid),
            Number(item.totalreadchapters),
          );
        });

        const chapterMap = new Map<number, number>();
        if (rawHistories.length > 0) {
          const chapterIds = rawHistories.map((h) =>
            Number(h.lastreadchapterid),
          );
          const chapters = await this.bookChapterRepository.find({
            where: { id: In(chapterIds) },
          });
          chapters.forEach((ch) => {
            chapterMap.set(ch.id, ch.chapter);
          });
        }

        rawHistories.forEach((history) => {
          const bookId = Number(history.bookid);
          readingHistoriesMap.set(bookId, {
            lastReadChapterId: Number(history.lastreadchapterid),
            lastReadChapterNumber:
              chapterMap.get(Number(history.lastreadchapterid)) || 0,
            totalReadChapters: totalChaptersMap.get(bookId) || 0,
          });
        });

        const booksWithoutHistory = books.filter(
          (book) => !readingHistoriesMap.has(book.id),
        );
        if (booksWithoutHistory.length > 0) {
          const firstChapters = await this.bookChapterRepository
            .createQueryBuilder('chapter')
            .select([
              'chapter.id AS id',
              'chapter.chapter AS chapter',
              'chapter.book_id AS bookId',
            ])
            .where('chapter.book_id IN (:...bookIds)', {
              bookIds: booksWithoutHistory.map((b) => b.id),
            })
            .orderBy('chapter.book_id')
            .addOrderBy('chapter.chapter', 'ASC')
            .distinctOn(['chapter.book_id'])
            .getRawMany();

          firstChapters.forEach((ch) => {
            readingHistoriesMap.set(Number(ch.bookid), {
              lastReadChapterId: Number(ch.id),
              lastReadChapterNumber: Number(ch.chapter),
              totalReadChapters: 0,
            });
          });

          booksWithoutHistory.forEach((book) => {
            if (!readingHistoriesMap.has(book.id)) {
              readingHistoriesMap.set(book.id, {
                lastReadChapterId: 0,
                lastReadChapterNumber: 0,
                totalReadChapters: 0,
              });
            }
          });
        }
      }

      const booksWithDetails = books.map((book) => {
        const chapters = book.chapters || [];
        const reviews = book.reviews || [];

        const totalChapters = chapters.length;
        const totalPrice = chapters.reduce(
          (sum, chapter) => sum + Number(chapter.price || 0),
          0,
        );

        const totalRating = reviews.reduce(
          (sum, r) => sum + (r.rating || 0),
          0,
        );
        const rating =
          reviews.length > 0 ? +(totalRating / reviews.length).toFixed(2) : 0;

        return {
          ...book,
          totalChapters,
          totalPrice,
          rating,
          isFollowed: followedBookIds.has(book.id),
          readingProgress: readingHistoriesMap.get(book.id),
        };
      });

      const response: PaginationResponseDto<GetListBookDto> = {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: plainToInstance(GetListBookDto, booksWithDetails, {
          excludeExtraneousValues: true,
        }),
      };

      return response;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getTrendingBooks');
      throw error;
    }
  }

  async getRecommendedBooks(
    userId: number | null,
    params: GetRecommendedBooksDto,
  ): Promise<GetListBookDto[]> {
    try {
      const limit = params.limit ?? 15;
      let books: Book[] = [];

      const buildBaseQuery = () => {
        return this.bookRepository
          .createQueryBuilder('book')
          .leftJoinAndSelect('book.author', 'author')
          .leftJoinAndSelect('book.bookType', 'bookType')
          .leftJoinAndSelect('book.accessStatus', 'accessStatus')
          .leftJoinAndSelect('book.progressStatus', 'progressStatus')
          .leftJoinAndSelect('book.bookCategoryRelations', 'relation')
          .leftJoinAndSelect('relation.category', 'category')
          .leftJoinAndSelect('book.chapters', 'chapters')
          .leftJoinAndSelect('book.reviews', 'reviews')
          .addSelect(
            (subQuery) =>
              subQuery
                .select('COALESCE(AVG(review.rating), 0)', 'avgRating')
                .from(BookReview, 'review')
                .where('review.book = book.id'),
            'rating',
          )
          .where('book.accessStatus.id = 1');
      };

      if (userId) {
        const favoriteCategories = await this.userFavoriteRepository.find({
          where: { user: { id: userId } },
        });

        if (favoriteCategories.length > 0) {
          const categoryIds = favoriteCategories.map((fav) => fav.category.id);

          const rawBooks = await buildBaseQuery()
            .where('relation.category_id IN (:...categoryIds)', { categoryIds })
            .groupBy(
              'book.id, author.id, bookType.id, accessStatus.id, progressStatus.id, relation.id, category.id, chapters.id, reviews.id',
            )
            .orderBy('rating', 'DESC')
            .addOrderBy('book.createdAt', 'DESC')
            .take(limit)
            .getMany();

          books = rawBooks;
        }
      }

      if (books.length < limit) {
        const excludeIds = books.map((book) => book.id);
        const remaining = limit - books.length;

        let moreBooksQuery = buildBaseQuery()
          .groupBy(
            'book.id, author.id, bookType.id, accessStatus.id, progressStatus.id, relation.id, category.id, chapters.id, reviews.id',
          )
          .orderBy('rating', 'DESC')
          .addOrderBy('book.createdAt', 'DESC')
          .take(remaining);

        if (excludeIds.length > 0) {
          moreBooksQuery = moreBooksQuery.andWhere(
            'book.id NOT IN (:...excludeIds)',
            { excludeIds },
          );
        }

        const moreBooks = await moreBooksQuery.getMany();
        books = books.concat(moreBooks);
      }

      let followedBookIds = new Set<number>();
      if (userId && books.length > 0) {
        const followed = await this.bookFollowRepository.find({
          where: {
            user: { id: userId },
            book: In(books.map((b) => b.id)),
          },
          relations: ['book'],
        });
        followedBookIds = new Set(followed.map((f) => f.book.id));
      }

      let readingHistoriesMap: Map<
        number,
        {
          lastReadChapterId: number;
          lastReadChapterNumber: number;
          totalReadChapters: number;
        }
      > = new Map();

      if (!userId) {
        const booksWithChapters = books.filter(
          (book) => book.chapters && book.chapters.length > 0,
        );
        const bookIds = booksWithChapters.map((book) => book.id);

        if (bookIds.length > 0) {
          const firstChapters = await this.bookChapterRepository
            .createQueryBuilder('chapter')
            .select([
              'chapter.id AS id',
              'chapter.chapter AS chapter',
              'chapter.book_id AS bookId',
            ])
            .where('chapter.book_id IN (:...bookIds)', { bookIds })
            .orderBy('chapter.book_id')
            .addOrderBy('chapter.chapter', 'ASC')
            .distinctOn(['chapter.book_id'])
            .getRawMany();

          firstChapters.forEach((chapter) => {
            readingHistoriesMap.set(Number(chapter.bookid), {
              lastReadChapterId: Number(chapter.id),
              lastReadChapterNumber: Number(chapter.chapter),
              totalReadChapters: 0,
            });
          });
        }

        books.forEach((book) => {
          if (!readingHistoriesMap.has(book.id)) {
            readingHistoriesMap.set(book.id, {
              lastReadChapterId: 0,
              lastReadChapterNumber: 0,
              totalReadChapters: 0,
            });
          }
        });
      } else if (userId) {
        const bookIds = books.map((book) => book.id);

        const subQuery = this.bookReadingHistoryRepository
          .createQueryBuilder('sub_history')
          .select([
            'MAX(sub_history.created_at) AS max_created_at',
            'sub_history.user_id AS user_id',
            'sub_history.book_id AS book_id',
          ])
          .where('sub_history.user_id = :userId', { userId })
          .andWhere('sub_history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('sub_history.user_id, sub_history.book_id');

        const rawHistories = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.chapter_id AS lastReadChapterId',
            'history.book_id AS bookId',
            'history.created_at AS createdAt',
          ])
          .innerJoin(
            `(${subQuery.getQuery()})`,
            'latest',
            'history.user_id = latest.user_id AND history.book_id = latest.book_id AND history.created_at = latest.max_created_at',
          )
          .setParameters(subQuery.getParameters())
          .getRawMany();

        const totalChaptersRead = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.book_id AS bookid',
            'COUNT(DISTINCT history.chapter_id) AS totalreadchapters',
          ])
          .where('history.user_id = :userId', { userId })
          .andWhere('history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('history.book_id')
          .getRawMany();

        const totalChaptersMap = new Map<number, number>();
        totalChaptersRead.forEach((item) => {
          totalChaptersMap.set(
            Number(item.bookid),
            Number(item.totalreadchapters),
          );
        });

        const chapterMap = new Map<number, number>();
        if (rawHistories.length > 0) {
          const chapterIds = rawHistories.map((h) =>
            Number(h.lastreadchapterid),
          );
          const chapters = await this.bookChapterRepository.find({
            where: { id: In(chapterIds) },
          });

          chapters.forEach((chapter) => {
            chapterMap.set(chapter.id, chapter.chapter);
          });

          rawHistories.forEach((history) => {
            const bookId = Number(history.bookid);
            readingHistoriesMap.set(bookId, {
              lastReadChapterId: Number(history.lastreadchapterid) || 0,
              lastReadChapterNumber:
                chapterMap.get(Number(history.lastreadchapterid)) || 0,
              totalReadChapters: totalChaptersMap.get(bookId) || 0,
            });
          });
        }

        const booksWithoutHistory = books.filter(
          (book) => !readingHistoriesMap.has(book.id),
        );

        if (booksWithoutHistory.length > 0) {
          const firstChapters = await this.bookChapterRepository
            .createQueryBuilder('chapter')
            .select([
              'chapter.id AS id',
              'chapter.chapter AS chapter',
              'chapter.book_id AS bookId',
            ])
            .where('chapter.book_id IN (:...bookIds)', {
              bookIds: booksWithoutHistory.map((b) => b.id),
            })
            .orderBy('chapter.book_id')
            .addOrderBy('chapter.chapter', 'ASC')
            .distinctOn(['chapter.book_id'])
            .getRawMany();

          firstChapters.forEach((chapter) => {
            readingHistoriesMap.set(Number(chapter.bookid), {
              lastReadChapterId: Number(chapter.id),
              lastReadChapterNumber: Number(chapter.chapter),
              totalReadChapters: 0,
            });
          });

          booksWithoutHistory.forEach((book) => {
            if (!readingHistoriesMap.has(book.id)) {
              readingHistoriesMap.set(book.id, {
                lastReadChapterId: 0,
                lastReadChapterNumber: 0,
                totalReadChapters: 0,
              });
            }
          });
        }
      }

      const booksWithDetails = books.map((book) => {
        const chapters = book.chapters || [];
        const reviews = book.reviews || [];

        const totalChapters = chapters.length;
        const totalPrice = chapters.reduce(
          (sum, chapter) => sum + Number(chapter.price || 0),
          0,
        );

        const totalRating = reviews.reduce(
          (sum, r) => sum + (r.rating || 0),
          0,
        );
        const rating =
          reviews.length > 0 ? +(totalRating / reviews.length).toFixed(2) : 0;

        const readingHistory = readingHistoriesMap.get(book.id);

        return {
          ...book,
          totalChapters,
          totalPrice,
          rating,
          isFollowed: followedBookIds.has(book.id),
          readingProgress: readingHistory,
        };
      });

      return plainToInstance(GetListBookDto, booksWithDetails, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getRecommendedBooks');
      throw error;
    }
  }

  async getRelatedBooks(
    bookId: number,
    userId: number | null,
    params: GetRelatedBooksDto,
  ): Promise<PaginationResponseDto<GetListBookDto>> {
    try {
      const { page = 1, limit = 10 } = params;
      const offset = (page - 1) * limit;

      const originBookQuery = `
      SELECT 
        author.id AS originAuthorId,
        ARRAY(
          SELECT category.id 
          FROM book_category_relation bcr
          JOIN book_category category ON category.id = bcr.category_id
          WHERE bcr.book_id = $1
        ) AS originCategoryIds
      FROM book book
      LEFT JOIN "user" author ON author.id = book.author_id
      WHERE book.id = $1`;

      const originBookResult = await this.bookRepository.query(
        originBookQuery,
        [bookId],
      );
      if (!originBookResult?.length)
        throw new NotFoundException('Book not found');

      const { originAuthorId, originCategoryIds } = originBookResult[0];

      const booksQuery = `
      SELECT 
        DISTINCT ON (book.id) book.*, 
        author.id AS author_id,
        author.name AS author_name,
        author.avatar AS author_avatar,
        book_type.id AS book_type_id,
        book_type.name AS book_type_name,
        access_status.id AS access_status_id,
        access_status.name AS access_status_name,
        access_status.description AS access_status_description,
        progress_status.id AS progress_status_id,
        progress_status.name AS progress_status_name,
        progress_status.description AS progress_status_description
      FROM book book
      LEFT JOIN "user" author ON author.id = book.author_id
      LEFT JOIN book_type ON book_type.id = book.book_type_id
      LEFT JOIN book_access_status access_status ON access_status.id = book.access_status_id
      LEFT JOIN book_progress_status progress_status ON progress_status.id = book.progress_status_id
      LEFT JOIN book_category_relation bcr ON bcr.book_id = book.id
      LEFT JOIN book_category category ON category.id = bcr.category_id
      WHERE book.id != $1 AND book.access_status_id = 1
      ORDER BY
        book.id,
        CASE
          WHEN author.id = $2 AND category.id = ANY($3) THEN 0
          WHEN author.id = $2 THEN 1
          WHEN category.id = ANY($3) THEN 2
          ELSE 3
        END,
        COALESCE((SELECT AVG(rating) FROM book_review WHERE book_id = book.id), 0) DESC,
        book.id DESC
      LIMIT $4 OFFSET $5`;

      const books: Book[] = await this.bookRepository.query(booksQuery, [
        bookId,
        originAuthorId,
        originCategoryIds,
        limit,
        offset,
      ]);

      const bookIds = books.map((b) => b.id);

      const categoriesQuery = `
      SELECT
        bcr.book_id AS book_id,
        JSON_AGG(
          JSON_BUILD_OBJECT('id', category.id, 'name', category.name)
          ORDER BY category.id ASC
        ) AS categories
      FROM book_category_relation bcr
      LEFT JOIN book_category category ON category.id = bcr.category_id
      WHERE bcr.book_id = ANY($1::int[])
      GROUP BY bcr.book_id`;
      const categoriesRaw = await this.bookRepository.query(categoriesQuery, [
        bookIds,
      ]);
      const categoriesMap = new Map<number, any>();
      categoriesRaw.forEach((row) => {
        categoriesMap.set(row.book_id, row.categories);
      });

      const countQuery = `
      SELECT COUNT(DISTINCT book.id) AS total
      FROM book book
      LEFT JOIN "user" author ON author.id = book.author_id
      LEFT JOIN book_category_relation bcr ON bcr.book_id = book.id
      LEFT JOIN book_category category ON category.id = bcr.category_id
      WHERE book.id != $1 AND book.access_status_id = 1`;
      const countResult = await this.bookRepository.query(countQuery, [bookId]);
      const totalItems = +countResult[0].total;

      const chaptersRaw = await this.bookChapterRepository.find({
        where: { book: { id: In(bookIds) } },
        relations: ['book'],
      });
      const chaptersMap = new Map<number, BookChapter[]>();
      chaptersRaw.forEach((c) => {
        const list = chaptersMap.get(c.book.id) || [];
        list.push(c);
        chaptersMap.set(c.book.id, list);
      });

      const reviewsRaw = await this.bookReviewRepository.find({
        where: { book: { id: In(bookIds) } },
        relations: ['book'],
      });
      const reviewsMap = new Map<number, BookReview[]>();
      reviewsRaw.forEach((r) => {
        const list = reviewsMap.get(r.book.id) || [];
        list.push(r);
        reviewsMap.set(r.book.id, list);
      });

      let followedBookIds = new Set<number>();
      if (userId && bookIds.length) {
        const followedBooks = await this.bookFollowRepository.find({
          where: {
            user: { id: userId },
            book: { id: In(bookIds) },
          },
          relations: ['book'],
        });
        followedBookIds = new Set(followedBooks.map((f) => f.book.id));
      }

      const readingHistoriesMap = new Map<
        number,
        {
          lastReadChapterId: number;
          lastReadChapterNumber: number;
          totalReadChapters: number;
        }
      >();

      if (!userId) {
        const booksWithChapters = books.filter((b) => chaptersMap.has(b.id));
        const firstChapters = await this.bookChapterRepository
          .createQueryBuilder('chapter')
          .select([
            'chapter.id AS id',
            'chapter.chapter AS chapter',
            'chapter.book_id AS bookId',
          ])
          .where('chapter.book_id IN (:...bookIds)', {
            bookIds: booksWithChapters.map((b) => b.id),
          })
          .orderBy('chapter.book_id')
          .addOrderBy('chapter.chapter', 'ASC')
          .distinctOn(['chapter.book_id'])
          .getRawMany();

        firstChapters.forEach((chapter) => {
          readingHistoriesMap.set(Number(chapter.bookid), {
            lastReadChapterId: Number(chapter.id),
            lastReadChapterNumber: Number(chapter.chapter),
            totalReadChapters: 0,
          });
        });

        books.forEach((book) => {
          if (!readingHistoriesMap.has(book.id)) {
            readingHistoriesMap.set(book.id, {
              lastReadChapterId: 0,
              lastReadChapterNumber: 0,
              totalReadChapters: 0,
            });
          }
        });
      } else {
        const subQuery = this.bookReadingHistoryRepository
          .createQueryBuilder('sub_history')
          .select([
            'MAX(sub_history.created_at) AS max_created_at',
            'sub_history.user_id AS user_id',
            'sub_history.book_id AS book_id',
          ])
          .where('sub_history.user_id = :userId', { userId })
          .andWhere('sub_history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('sub_history.user_id, sub_history.book_id');

        const rawHistories = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.chapter_id AS lastReadChapterId',
            'history.book_id AS bookId',
            'history.created_at AS createdAt',
          ])
          .innerJoin(
            `(${subQuery.getQuery()})`,
            'latest',
            'history.user_id = latest.user_id AND history.book_id = latest.book_id AND history.created_at = latest.max_created_at',
          )
          .setParameters(subQuery.getParameters())
          .getRawMany();

        const totalChaptersRead = await this.bookReadingHistoryRepository
          .createQueryBuilder('history')
          .select([
            'history.book_id AS bookid',
            'COUNT(DISTINCT history.chapter_id) AS totalreadchapters',
          ])
          .where('history.user_id = :userId', { userId })
          .andWhere('history.book_id IN (:...bookIds)', { bookIds })
          .groupBy('history.book_id')
          .getRawMany();

        const totalChaptersMap = new Map<number, number>();
        totalChaptersRead.forEach((item) => {
          totalChaptersMap.set(
            Number(item.bookid),
            Number(item.totalreadchapters),
          );
        });

        const chapterMap = new Map<number, number>();
        if (rawHistories.length > 0) {
          const chapterIds = rawHistories.map((h) =>
            Number(h.lastreadchapterid),
          );
          const chapters = await this.bookChapterRepository.find({
            where: { id: In(chapterIds) },
          });
          chapters.forEach((ch) => {
            chapterMap.set(ch.id, ch.chapter);
          });
        }

        rawHistories.forEach((history) => {
          const bookId = Number(history.bookid);
          readingHistoriesMap.set(bookId, {
            lastReadChapterId: Number(history.lastreadchapterid),
            lastReadChapterNumber:
              chapterMap.get(Number(history.lastreadchapterid)) || 0,
            totalReadChapters: totalChaptersMap.get(bookId) || 0,
          });
        });

        books.forEach((book) => {
          if (!readingHistoriesMap.has(book.id)) {
            const chapters = chaptersMap.get(book.id) || [];
            const firstChapter = chapters.sort(
              (a, b) => a.chapter - b.chapter,
            )[0];
            if (firstChapter) {
              readingHistoriesMap.set(book.id, {
                lastReadChapterId: firstChapter.id,
                lastReadChapterNumber: firstChapter.chapter,
                totalReadChapters: 0,
              });
            } else {
              readingHistoriesMap.set(book.id, {
                lastReadChapterId: 0,
                lastReadChapterNumber: 0,
                totalReadChapters: 0,
              });
            }
          }
        });
      }

      const booksWithDetails = books.map((book: any) => {
        const chapters = chaptersMap.get(book.id) || [];
        const reviews = reviewsMap.get(book.id) || [];
        const categories = categoriesMap.get(book.id) || [];
        const readingHistory = readingHistoriesMap.get(book.id);

        const totalChapters = chapters.length;

        const totalPrice = chapters.reduce(
          (sum, chapter) => sum + Number(chapter.price || 0),
          0,
        );

        const totalRating = reviews.reduce(
          (sum, r) => sum + (r.rating || 0),
          0,
        );
        const rating =
          reviews.length > 0 ? +(totalRating / reviews.length).toFixed(2) : 0;

        return {
          id: book.id,
          title: book.title,
          description: book.description,
          cover: book.cover,
          views: book.views,
          rating,
          totalChapters,
          totalPrice,
          followsCount: book.follows_count,
          isFollowed: followedBookIds.has(book.id),
          author: {
            id: book.author_id,
            name: book.author_name || null,
            avatar: book.author_avatar || null,
          },
          bookType: {
            id: book.book_type_id,
            name: book.book_type_name || null,
          },
          accessStatus: {
            id: book.access_status_id,
            name: book.access_status_name || null,
            description: book.access_status_description || null,
          },
          progressStatus: {
            id: book.progress_status_id,
            name: book.progress_status_name || null,
            description: book.progress_status_description || null,
          },
          categories: categories || [],
          createdAt: book.created_at,
          readingHistory: {
            lastReadChapterId: readingHistory?.lastReadChapterId || 0,
            lastReadChapterNumber: readingHistory?.lastReadChapterNumber || 0,
            totalReadChapters: readingHistory?.totalReadChapters || 0,
          },
        };
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: booksWithDetails,
      };
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getBooks');
      throw error;
    }
  }

  async clearAllChapters(bookId: number) {
    try {
      const book = await this.bookRepository.findOne({ where: { id: bookId } });
      if (!book) {
        throw new NotFoundException('Book Not Found');
      }

      await this.bookChapterRepository.delete({ book: { id: bookId } });

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.clearAllChapters');
      throw error;
    }
  }
}
