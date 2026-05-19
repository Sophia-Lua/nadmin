import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sys_oper_log')
export class SysOperLog {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'oper_id' })
  operId: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'title' })
  title: string;

  @Column({ type: 'tinyint', name: 'business_type', default: 0 })
  businessType: number;

  @Column({ type: 'varchar', length: 50, default: '', name: 'method' })
  method: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'request_method' })
  requestMethod: string;

  @Column({ type: 'char', length: 1, name: 'operator_type', default: '0' })
  operatorType: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'oper_name' })
  operName: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'dept_name' })
  deptName: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'oper_url' })
  operUrl: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'oper_ip' })
  operIp: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'oper_location' })
  operLocation: string;

  @Column({ type: 'varchar', length: 2000, default: '', name: 'oper_param' })
  operParam: string;

  @Column({ type: 'varchar', length: 2000, default: '', name: 'json_result' })
  jsonResult: string;

  @Column({ type: 'datetime', nullable: true, name: 'oper_time' })
  operTime: Date;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'varchar', length: 2000, default: '', name: 'error_msg' })
  errorMsg: string;
}
