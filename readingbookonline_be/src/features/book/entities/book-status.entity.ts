import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity('book_status')
export class BookStatus {
    @PrimaryGeneratedColumn({ name: "id", type: 'int' })
    id: number;

    @Column({ name: "name", type: 'varchar', length: 50, unique: true })
    name: string;

    @OneToMany(() => Book, (book) => book.status)
    books: Book[];

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updated_at: Date;
}
