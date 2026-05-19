import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_dict_type')
export class SysDictType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'dict_id' })
  dictId: string;

  @Column({ type: 'varchar', length: 100, name: 'dict_name' })
  dictName: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'dict_type' })
  dictType: string;

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
}
