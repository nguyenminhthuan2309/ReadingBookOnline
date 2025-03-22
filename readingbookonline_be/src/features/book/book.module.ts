import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookCategory } from './entities/book-category.entity';
import { BookChapter } from './entities/book-chapter.entity';
import { BookChapterPurchase } from './entities/book-chapter-purchase.entity';
import { BookReport } from './entities/book-report.entity';
import { BookReview } from './entities/book-review.entity';
import { UserModule } from '@features/user/user.module';
import { BookCategoryRelation } from './entities/book-category-relation.entity';
import { BookAccessStatus } from './entities/book-access-status.entity';
import { BookFollow } from './entities/book-follow.entity';
import { BookProgressStatus } from './entities/book-progess-status.entity';
import { BookReadingHistory } from './entities/book-reading-history.entity';
import { BookChapterComment } from './entities/book-chapter-comment.entity';
import { BookType } from './entities/book-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookAccessStatus,
      BookCategoryRelation,
      BookCategory,
      BookChapterPurchase,
      BookChapter,
      BookFollow,
      BookType,
      BookProgressStatus,
      BookReadingHistory,
      BookReport,
      BookReview,
      Book,
      BookChapterComment,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
