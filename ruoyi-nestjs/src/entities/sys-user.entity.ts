import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SysDept } from './sys-dept.entity';
import { SysRole } from './sys-role.entity';
import { SysPost } from './sys-post.entity';

@Entity('sys_user')
export class SysUser {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_id' })
  userId: string;

  @Column({ type: 'bigint', nullable: true, name: 'dept_id' })
  deptId: string;

  @Column({ type: 'varchar', length: 30, name: 'login_name' })
  loginName: string;

  @Column({ type: 'varchar', length: 30, default: '', name: 'user_name' })
  userName: string;

  @Column({ type: 'varchar', length: 2, default: '00', name: 'user_type' })
  userType: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  email: string;

  @Column({ type: 'varchar', length: 11, default: '' })
  phonenumber: string;

  @Column({ type: 'char', length: 1, default: '0' })
  sex: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  avatar: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  password: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  salt: string;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'del_flag' })
  delFlag: string;

  @Column({ type: 'varchar', length: 128, default: '', name: 'login_ip' })
  loginIp: string;

  @Column({ type: 'datetime', nullable: true, name: 'login_date' })
  loginDate: Date;

  @Column({ type: 'datetime', nullable: true, name: 'pwd_update_date' })
  pwdUpdateDate: Date;

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

  @ManyToOne(() => SysDept, dept => dept.users)
  @JoinColumn({ name: 'dept_id' })
  dept: SysDept;

  @ManyToMany(() => SysRole, role => role.users)
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
  })
  roles: SysRole[];

  @ManyToMany(() => SysPost, post => post.users)
  @JoinTable({
    name: 'sys_user_post',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'postId' },
  })
  posts: SysPost[];
}
