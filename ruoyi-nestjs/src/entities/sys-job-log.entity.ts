import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_job_log')
export class SysJobLog {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'job_log_id' })
  jobLogId: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'job_name' })
  jobName: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'job_group' })
  jobGroup: string;

  @Column({ type: 'varchar', length: 500, default: '', name: 'invoke_target' })
  invokeTarget: string;

  @Column({ type: 'varchar', length: 500, default: '', name: 'job_message' })
  jobMessage: string;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'varchar', length: 2000, default: '', name: 'exception_info' })
  exceptionInfo: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;
}
