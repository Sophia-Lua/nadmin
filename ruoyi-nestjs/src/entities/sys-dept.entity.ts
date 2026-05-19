import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SysUser } from './sys-user.entity';
import { SysRole } from './sys-role.entity';

@Entity('sys_dept')
export class SysDept {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'dept_id' })
  deptId: string;

  @Column({ type: 'bigint', default: 0, name: 'parent_id' })
  parentId: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  ancestors: string;

  @Column({ type: 'varchar', length: 30, default: '', name: 'dept_name' })
  deptName: string;

  @Column({ type: 'int', default: 0, name: 'order_num' })
  orderNum: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  leader: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'del_flag' })
  delFlag: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'create_by' })
  createBy: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ type: 'datetime', name: 'update_time' })
  updateTime: Date;

  @OneToMany(() => SysUser, user => user.dept)
  users: SysUser[];

  @ManyToMany(() => SysRole, role => role.depts)
  roles: SysRole[];
}
