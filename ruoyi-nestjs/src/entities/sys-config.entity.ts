import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sys_config')
export class SysConfig {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'config_id' })
  configId: string;

  @Column({ type: 'varchar', length: 100, name: 'config_name' })
  configName: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'config_key' })
  configKey: string;

  @Column({ type: 'varchar', length: 500, name: 'config_value' })
  configValue: string;

  @Column({ type: 'char', length: 1, default: 'N', name: 'config_type' })
  configType: string;

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
