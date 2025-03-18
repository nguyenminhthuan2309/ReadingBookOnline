import { User } from '@features/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_report')
export class BookReport {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'resolved', type: 'boolean', default: false })
  resolved: boolean;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @ManyToOne(() => Book, (book) => book.reports)
  book: Book;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
