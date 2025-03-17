import * as bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Role } from './role.entity';
import { UserStatus } from './user-status.entity';
import { Book } from '@features/book/entities/book.entity';
import { BookReview } from '@features/book/entities/book-review.entity';
import { BookReport } from '@features/book/entities/book-report.entity';
import { UserReport } from './user-report.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "email", type: "varchar", unique: true })
    email: string;

    @Column({ name: "password", type: "varchar" })
    password: string;

    @Column({ name: "phone", type: 'varchar', length: 15, unique: true })
    phone: string;

    @Column({ name: "name", type: "varchar" })
    name: string;

    @Column({ name: "avatar", type: "varchar", nullable: true })
    avatar: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => UserStatus, (status) => status.users)
    @JoinColumn({ name: 'status_id' })
    status: UserStatus;

    @OneToMany(() => Book, (book) => book.author)
    books: Book[];

    @OneToMany(() => BookReview, (review) => review.user)
    reviews: BookReview[];

    @OneToMany(() => BookReport, (report) => report.user)
    reports: BookReport[];

    @OneToMany(() => UserReport, (report) => report.reportedUser)
    reportedBy: UserReport[];

    @OneToMany(() => UserReport, (report) => report.reporter)
    reportsMade: UserReport[];

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
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