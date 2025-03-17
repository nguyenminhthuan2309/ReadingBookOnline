import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Book } from '@features/book/entities/book.entity';
import { DatabaseService } from '@core/database/database.service';
import { GetBookRequestDto, GetBookResponseDto } from './dto/get-book-request.dto';
import { GetBookDto } from './dto/get-book.dto';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly databaseService: DatabaseService,
    private readonly loggerService: LoggerService,
  ) { }

  async getAllBooks(params: GetBookRequestDto): Promise<GetBookResponseDto | Boolean> {
    try {
      let { page = 1, limit = 10, userId, statusId, categoryId } = params;

      const qb = this.databaseService.queryBuilder(this.bookRepository, 'book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.status', 'status')
        .leftJoinAndSelect('book.bookCategoryRelations', 'bcr')
        .leftJoinAndSelect('bcr.category', 'category')
        .leftJoinAndSelect('book.chapters', 'chapters')
        .orderBy('book.createdAt', 'DESC')
        .addOrderBy('chapters.chapter', 'ASC');

      if (userId) {
        qb.andWhere('author.id = :userId', { userId });
      }

      if (statusId) {
        qb.andWhere('status.id = :statusId', { statusId });
      }

      if (categoryId && categoryId.length > 0) {
        qb.andWhere('category.id IN (:...categoryId)', { categoryId });
      }

      qb.skip((page - 1) * limit)
        .take(limit);

      const [books, total] = await qb.getManyAndCount();

      return {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        data: books.map((book) =>
          plainToInstance(GetBookDto, book, { excludeExtraneousValues: true })
        ),
      }
    } catch (error) {
      this.loggerService.err(error.message, "BookService.getAllBooks");
      return false
    }

  }
}
