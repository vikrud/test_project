import { type } from 'node:os';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
  Index,
} from 'typeorm';
import { RoleEnum } from '../enums/role.enum';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  surname: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'decimal', precision: 15, scale: 0, unique: true })
  phone: number;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEnum;

  @RelationId((user: User) => user.role)
  roleId: RoleEnum;
}
