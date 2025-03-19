import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Book } from '@features/book/entities/book.entity';
import { DatabaseService } from '@core/database/database.service';
import {
  GetBookRequestDto,
  GetBookResponseDto,
  SortByOptions,
  SortTypeOptions,
} from './dto/get-book-request.dto';
import { GetBookDto } from './dto/get-book.dto';
import { LoggerService } from '@core/logger/logger.service';
import { CacheService } from '@core/cache/cache.service';
import {
  GetBookCategoryDto,
  GetBookCategoryRequestDto,
  GetBookCateogryResponseDto,
} from './dto/get-book-category.dto';
import { BookCategory } from './entities/book-category.entity';
import { bookConfig } from '@core/config/global';

@Injectable()
export class BookService {
  // 1 hour
  private readonly redisBookTtl = bookConfig.redisBookTtl;

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCategory)
    private readonly bookCategoryRepository: Repository<BookCategory>,
    private readonly cacheService: CacheService,
    private readonly databaseService: DatabaseService,
    private readonly loggerService: LoggerService,
  ) {}

  async getAllBooks(params: GetBookRequestDto): Promise<GetBookResponseDto> {
    try {
      let {
        page = 1,
        limit = 10,
        userId,
        title,
        statusId,
        categoryId,
        sortBy = 'updatedAt',
        sortType = 'DESC',
      } = params;

      const cachedKey = `books:list:${userId || 'all'}:${title || 'all'}:${statusId || 'all'}:${categoryId || 'all'}:sortBy${sortBy}:sortType${sortType}:p${page}:l${limit}`;
      const cachedPage = await this.cacheService.get(cachedKey);
      if (cachedPage) {
        return JSON.parse(cachedPage);
      }

      const qb = this.databaseService
        .queryBuilder(this.bookRepository, 'book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.status', 'status')
        .leftJoinAndSelect('book.bookCategoryRelations', 'bcr')
        .leftJoinAndSelect('bcr.category', 'category')
        .leftJoinAndSelect('book.chapters', 'chapters');

      if (userId) {
        qb.andWhere('author.id = :userId', { userId });
      }

      if (statusId) {
        qb.andWhere('status.id = :statusId', { statusId });
      }

      if (categoryId && categoryId.length > 0) {
        qb.andWhere('category.id IN (:...categoryId)', { categoryId });
      }

      if (title) {
        qb.andWhere(
          `(to_tsvector('simple', lower(book.title)) @@ websearch_to_tsquery(lower(:search)) 
           OR lower(book.title) ILIKE :prefixSearch)`,
          {
            search: title.replace(/\s+/g, '&'),
            prefixSearch: `%${title.replace(/\s+/g, '&')}%`,
          },
        );
      }

      if (sortBy === SortByOptions.VIEWS) {
        qb.orderBy('book.views', sortType as SortTypeOptions);
      } else if (sortBy === SortByOptions.UPDATED_AT) {
        qb.orderBy('book.updatedAt', sortType as SortTypeOptions);
      } else if (sortBy === SortByOptions.LATEST_CHAPTER) {
        qb.orderBy(
          '(SELECT MAX(chapters.updatedAt) FROM chapters WHERE chapters.bookId = book.id)',
          sortType as SortTypeOptions,
        );
      }

      qb.addOrderBy('chapters.chapter', 'ASC');

      qb.skip((page - 1) * limit).take(limit);

      const [books, total] = await qb.getManyAndCount();

      const response: GetBookResponseDto = {
        totalItems: total,
        totalPages: total > 0 ? Math.ceil(total / limit) : 1,
        data: books.map((book) =>
          plainToInstance(GetBookDto, book, { excludeExtraneousValues: true }),
        ),
      };

      await this.cacheService.set(
        cachedKey,
        JSON.stringify(response),
        this.redisBookTtl,
      );

      return response;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getAllBooks');
      throw error;
    }
  }

  async getBookDetail(bookId: number): Promise<GetBookResponseDto> {
    try {
      const cachedKey = `book:detail:${bookId}`;

      await this.databaseService
        .queryBuilder(this.bookRepository, 'book')
        .update(Book)
        .set({
          views: () => 'views + 1',
        })
        .where('id = :bookId', { bookId })
        .execute();

      const cachedBook = await this.cacheService.get(cachedKey);
      if (cachedBook) {
        return JSON.parse(cachedBook);
      }

      const qb = this.databaseService
        .queryBuilder(this.bookRepository, 'book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.status', 'status')
        .leftJoinAndSelect('book.bookCategoryRelations', 'bcr')
        .leftJoinAndSelect('bcr.category', 'category')
        .leftJoinAndSelect('book.chapters', 'chapters')
        // .leftJoinAndSelect('book.reviews', 'reviews')
        .where('book.id = :bookId', { bookId })
        .addOrderBy('chapters.chapter', 'ASC');
      // .addOrderBy('reviews.createdAt', 'DESC');

      const book = await qb.getOne();

      if (!book) {
        throw new NotFoundException('Không tìm thấy sách');
      }

      const response: GetBookResponseDto = {
        totalItems: 1,
        totalPages: 1,
        data: [
          plainToInstance(GetBookDto, book, { excludeExtraneousValues: true }),
        ],
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

      const data = await this.databaseService.findAndCount(
        this.bookCategoryRepository,
        {
          select: ['id', 'name', 'createdAt', 'updatedAt'],
          order: { id: 'ASC' },
          skip: offset,
          take: limit,
        },
      );

      const response: GetBookCateogryResponseDto = {
        totalItems: data.total,
        totalPages: Math.ceil(data.total / limit),
        data: data.data.map((category) =>
          plainToInstance(GetBookCategoryDto, category, {
            excludeExtraneousValues: true,
          }),
        ),
      };

      await this.cacheService.set(
        cachedKey,
        JSON.stringify(response),
        this.redisBookTtl,
      );

      return response;
    } catch (error) {
      this.loggerService.err(error.message, 'BookService.getBookCategory');
      throw error;
    }
  }
}
