import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_logininfor')
export class SysLogininfor {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'info_id' })
  infoId: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'login_name' })
  loginName: string;

  @Column({ type: 'char', length: 1, name: 'status', default: '0' })
  status: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'ipaddr' })
  ipaddr: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'msg' })
  msg: string;

  @CreateDateColumn({ type: 'datetime', name: 'login_time' })
  loginTime: Date;
}
