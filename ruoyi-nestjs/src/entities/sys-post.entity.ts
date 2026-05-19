import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SysUser } from './sys-user.entity';

@Entity('sys_post')
export class SysPost {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'post_id' })
  postId: string;

  @Column({ type: 'varchar', length: 64, name: 'post_code' })
  postCode: string;

  @Column({ type: 'varchar', length: 50, name: 'post_name' })
  postName: string;

  @Column({ type: 'int', name: 'post_sort' })
  postSort: number;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

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

  @ManyToMany(() => SysUser, user => user.posts)
  users: SysUser[];
}
