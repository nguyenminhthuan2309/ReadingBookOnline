import { User } from '@features/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_review')
export class BookReview {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Index('idx_book_review_user')
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index('idx_book_review_book')
  @ManyToOne(() => Book, (book) => book.reviews)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'rating', type: 'float', default: 0 })
  rating: number;

  @Column({ name: 'comment', type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
