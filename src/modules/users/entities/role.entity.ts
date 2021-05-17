import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RoleEnum } from '../enums/role.enum';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryColumn({ name: 'role_id', type: 'int' })
  roleId: RoleEnum;

  @Column({ name: 'role_name', type: 'varchar', length: 50 })
  roleName: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
