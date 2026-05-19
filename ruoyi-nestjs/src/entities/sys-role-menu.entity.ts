import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { SysRole } from './sys-role.entity';
import { SysUser } from './sys-user.entity';

@Entity('sys_user_role')
export class SysUserRole {
  @PrimaryColumn({ type: 'bigint', name: 'user_id' })
  userId: string;

  @PrimaryColumn({ type: 'bigint', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => SysUser, user => user.roles)
  @JoinColumn({ name: 'user_id' })
  user: SysUser;

  @ManyToOne(() => SysRole, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: SysRole;
}
