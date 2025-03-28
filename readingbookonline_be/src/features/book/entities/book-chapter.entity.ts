import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Book } from './book.entity';
import { BookChapterComment } from './book-chapter-comment.entity';

@Entity('book_chapter')
export class BookChapter {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 500 })
  title: string;

  @Index('idx_book_chapter_chapter')
  @Column({ name: 'chapter', type: 'int' })
  chapter: number;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'cover', type: 'varchar', length: 500, nullable: true })
  cover: string;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'price', type: 'decimal', default: 0 })
  price: number;

  @Index('idx_book_chapter_book')
  @ManyToOne(() => Book, (book) => book.chapters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @OneToMany(() => BookChapterComment, (comment) => comment.chapter)
  comments: BookChapterComment[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Index('idx_book_chapter_updated_at')
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
