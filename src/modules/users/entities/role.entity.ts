import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  role_id: number;

  @Column()
  role_name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
