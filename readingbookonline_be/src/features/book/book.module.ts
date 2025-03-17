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

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, BookCategory, BookChapter, BookChapterPurchase, BookReport, BookReview, BookCategoryRelation]),
    forwardRef(() => UserModule)
  ],
  controllers: [BookController],
  providers: [BookService],
})

export class BookModule { }
