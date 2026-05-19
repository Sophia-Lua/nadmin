import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_dict_data')
export class SysDictData {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'dict_code' })
  dictCode: string;

  @Column({ type: 'varchar', length: 100, name: 'dict_type' })
  dictType: string;

  @Column({ type: 'varchar', length: 100, name: 'dict_label' })
  dictLabel: string;

  @Column({ type: 'varchar', length: 100, name: 'dict_value' })
  dictValue: string;

  @Column({ type: 'varchar', length: 10, name: 'list_class', nullable: true })
  listClass: string;

  @Column({ type: 'int', name: 'dict_sort', default: 0 })
  dictSort: number;

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
