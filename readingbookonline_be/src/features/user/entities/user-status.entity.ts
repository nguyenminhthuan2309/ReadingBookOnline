import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_status')
export class UserStatus {
    @PrimaryGeneratedColumn({ name: "id", type: 'int' })
    id: number;

    @Column({ name: "name", type: 'varchar', length: 50, unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.status)
    users: User[];

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updated_at: Date;
}
