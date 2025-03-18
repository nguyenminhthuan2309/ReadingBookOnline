import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { BookStatus } from './book-status.entity';
import { User } from '@features/user/entities/user.entity';
import { BookChapter } from './book-chapter.entity';
import { BookReview } from './book-review.entity';
import { BookReport } from './book-report.entity';
import { BookCategoryRelation } from './book-category-relation.entity';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 500 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'cover', type: 'text', nullable: true })
  cover: string;

  @ManyToOne(() => BookStatus, (status) => status.books)
  @JoinColumn({ name: 'status_id' })
  status: BookStatus;

  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => BookChapter, (chapter) => chapter.book)
  chapters: BookChapter[];

  @OneToMany(() => BookReview, (review) => review.book)
  reviews: BookReview[];

  @OneToMany(() => BookReport, (report) => report.book)
  reports: BookReport[];

  @OneToMany(() => BookCategoryRelation, (relation) => relation.book)
  bookCategoryRelations: BookCategoryRelation[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
