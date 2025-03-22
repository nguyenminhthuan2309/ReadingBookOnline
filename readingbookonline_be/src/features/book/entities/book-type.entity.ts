import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_type')
export class BookType {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Index('idx_book_type_name')
  @Column({ name: 'name', type: 'varchar', length: 50, unique: true })
  name: string;

  @OneToMany(() => Book, (book) => book.bookType)
  books: Book[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
