import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '@features/user/entities/user.entity';
import { BookChapter } from './book-chapter.entity';
import { BookReview } from './book-review.entity';
import { BookReport } from './book-report.entity';
import { BookCategoryRelation } from './book-category-relation.entity';
import { BookFollow } from './book-follow.entity';
import { BookReadingHistory } from './book-reading-history.entity';
import { BookProgressStatus } from './book-progess-status.entity';
import { BookAccessStatus } from './book-access-status.entity';
import { BookType } from './book-type.entity';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Index('idx_book_title')
  @Column({ name: 'title', type: 'varchar', length: 500 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'cover', type: 'text', nullable: true })
  cover: string;

  @Column({ name: 'age_rating', type: 'int', default: 6 })
  ageRating: number;

  @Index('idx_book_views')
  @Column({ name: 'views', type: 'int', default: 0 })
  views: number;

  @ManyToOne(() => BookType, (type) => type.books)
  @JoinColumn({ name: 'book_type_id' })
  bookType: BookType;

  @Index('idx_book_access_status')
  @ManyToOne(() => BookAccessStatus, (accessStatus) => accessStatus.books)
  @JoinColumn({ name: 'access_status_id' })
  accessStatus: BookAccessStatus;

  @Index('idx_book_progress_status')
  @ManyToOne(() => BookProgressStatus, (progressStatus) => progressStatus.books)
  @JoinColumn({ name: 'progress_status_id' })
  progressStatus: BookProgressStatus;

  @Index('idx_book_author')
  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => BookCategoryRelation, (relation) => relation.book)
  bookCategoryRelations: BookCategoryRelation[];

  @OneToMany(() => BookChapter, (chapter) => chapter.book)
  chapters: BookChapter[];

  @OneToMany(() => BookFollow, (follow) => follow.book)
  follows: BookFollow[];

  @OneToMany(() => BookReadingHistory, (history) => history.book)
  readingHistories: BookReadingHistory[];

  @OneToMany(() => BookReview, (review) => review.book)
  reviews: BookReview[];

  @OneToMany(() => BookReport, (report) => report.book)
  reports: BookReport[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Index('idx_book_updated_at')
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
