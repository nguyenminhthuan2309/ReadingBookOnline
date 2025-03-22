import { User } from '@features/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_report')
export class BookReport {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Index('idx_book_report_resolved')
  @Column({ name: 'resolved', type: 'boolean', default: false })
  resolved: boolean;

  @Index('idx_book_report_user')
  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @Index('idx_book_report_book')
  @ManyToOne(() => Book, (book) => book.reports)
  book: Book;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
