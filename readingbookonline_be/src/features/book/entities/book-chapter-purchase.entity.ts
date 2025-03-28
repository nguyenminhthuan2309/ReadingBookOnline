import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { BookChapter } from './book-chapter.entity';
import { User } from '@features/user/entities/user.entity';

@Entity('book_chapter_purchase')
export class BookChapterPurchase {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Index('idx_book_chapter_purchase_user')
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index('idx_book_chapter_purchase_chapter')
  @ManyToOne(() => BookChapter)
  @JoinColumn({ name: 'chapter_id' })
  chapter: BookChapter;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
