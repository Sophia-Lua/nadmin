import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SysUser } from './sys-user.entity';
import { SysMenu } from './sys-menu.entity';
import { SysDept } from './sys-dept.entity';

@Entity('sys_role')
export class SysRole {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'role_id' })
  roleId: string;

  @Column({ type: 'varchar', length: 30, name: 'role_name' })
  roleName: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'role_key' })
  roleKey: string;

  @Column({ type: 'int', name: 'role_sort' })
  roleSort: number;

  @Column({ type: 'char', length: 1, default: '1', name: 'data_scope' })
  dataScope: string;

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

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string;

  @ManyToMany(() => SysUser, user => user.roles)
  users: SysUser[];

  @ManyToMany(() => SysMenu, menu => menu.roles)
  @JoinTable({
    name: 'sys_role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'menuId' },
  })
  menus: SysMenu[];

  @ManyToMany(() => SysDept, dept => dept.roles)
  @JoinTable({
    name: 'sys_role_dept',
    joinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
    inverseJoinColumn: { name: 'dept_id', referencedColumnName: 'deptId' },
  })
  depts: SysDept[];
}
