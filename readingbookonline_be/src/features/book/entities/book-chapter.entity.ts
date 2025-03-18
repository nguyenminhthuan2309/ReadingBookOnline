import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_chapter')
export class BookChapter {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 500 })
  title: string;

  @Column({ name: 'chapter', type: 'int' })
  chapter: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'cover', type: 'varchar', length: 500, nullable: true })
  cover: string;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'price', type: 'decimal', default: 0 })
  price: number;

  @ManyToOne(() => Book, (book) => book.chapters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
