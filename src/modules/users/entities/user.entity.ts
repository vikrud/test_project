import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'decimal', precision: 15, scale: 0, unique: true })
  phone: number;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: number;
}
