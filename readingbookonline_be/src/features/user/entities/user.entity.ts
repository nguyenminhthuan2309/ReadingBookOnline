import * as bcrypt from 'bcrypt';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { Role } from './role.entity';
import { UserStatus } from './user-status.entity';
import { Book } from '@features/book/entities/book.entity';
import { BookReview } from '@features/book/entities/book-review.entity';
import { BookReport } from '@features/book/entities/book-report.entity';
import { UserReport } from './user-report.entity';
import { BookFollow } from '@features/book/entities/book-follow.entity';
import { BookReadingHistory } from '@features/book/entities/book-reading-history.entity';
import { BookChapterComment } from '@features/book/entities/book-chapter-comment.entity';
import { BookNotification } from '@features/book/entities/book-notification.entity';
import { ChapterPurchase } from '@features/transaction/entities/chapter-purchase.entity';
import { Transaction } from '@features/transaction/entities/transaction.entity';
import { UserFavorite } from './user-favorite.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Index('idx_user_email')
  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Index('idx_user_name')
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'avatar', type: 'varchar', nullable: true })
  avatar: string;

  @Index('idx_user_birth_date')
  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Index('idx_user_role')
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Index('idx_user_status')
  @ManyToOne(() => UserStatus, (status) => status.users)
  @JoinColumn({ name: 'status_id' })
  status: UserStatus;

  @Index('idx_user_points')
  @Column({ name: 'points', type: 'decimal', default: 0 })
  points: number;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];

  @OneToMany(() => BookFollow, (follow) => follow.user)
  bookFollows: BookFollow[];

  @OneToMany(() => BookChapterComment, (comment) => comment.user)
  chapterComments: BookChapterComment[];

  @OneToMany(() => BookReadingHistory, (history) => history.user)
  readingHistories: BookReadingHistory[];

  @OneToMany(() => BookReview, (review) => review.user)
  reviews: BookReview[];

  @OneToMany(() => BookReport, (report) => report.user)
  reports: BookReport[];

  @OneToMany(() => UserReport, (report) => report.reportedUser)
  reportedBy: UserReport[];

  @OneToMany(() => UserReport, (report) => report.reporter)
  reportsMade: UserReport[];

  @OneToMany(() => BookNotification, (notification) => notification.user)
  notifications: BookNotification[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => ChapterPurchase, (purchase) => purchase.user)
  chapterPurchases: ChapterPurchase[];

  @OneToMany(() => UserFavorite, (favorite) => favorite.user)
  favorites: UserFavorite[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
