import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SysRole } from './sys-role.entity';

@Entity('sys_menu')
export class SysMenu {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'menu_id' })
  menuId: string;

  @Column({ type: 'varchar', length: 50, name: 'menu_name' })
  menuName: string;

  @Column({ type: 'bigint', default: 0, name: 'parent_id' })
  parentId: string;

  @Column({ type: 'int', default: 0, name: 'order_num' })
  orderNum: number;

  @Column({ type: 'varchar', length: 200, default: '#' })
  url: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  target: string;

  @Column({ type: 'char', length: 1, default: '', name: 'menu_type' })
  menuType: string;

  @Column({ type: 'char', length: 1, default: '0' })
  visible: string;

  @Column({ type: 'char', length: 1, default: '1', name: 'is_refresh' })
  isRefresh: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  perms: string;

  @Column({ type: 'varchar', length: 100, default: '#' })
  icon: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'create_by' })
  createBy: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ type: 'datetime', name: 'update_time' })
  updateTime: Date;

  @Column({ type: 'varchar', length: 500, default: '' })
  remark: string;

  @ManyToMany(() => SysRole, role => role.menus)
  roles: SysRole[];
}
