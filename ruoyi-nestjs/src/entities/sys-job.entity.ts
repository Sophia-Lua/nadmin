import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_job')
export class SysJob {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'job_id' })
  jobId: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'job_name' })
  jobName: string;

  @Column({ type: 'varchar', length: 50, default: 'DEFAULT', name: 'job_group' })
  jobGroup: string;

  @Column({ type: 'varchar', length: 500, default: '', name: 'invoke_target' })
  invokeTarget: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'cron_expression' })
  cronExpression: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'misfire_policy' })
  misfirePolicy: string;

  @Column({ type: 'char', length: 1, default: '1' })
  concurrent: string;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'varchar', length: 500, default: '', name: 'create_by' })
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
