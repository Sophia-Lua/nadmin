import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('sys_user_online')
export class SysUserOnline {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  sessionId: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'login_name' })
  loginName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'dept_name' })
  deptName: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'ipaddr' })
  ipaddr: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'login_location' })
  loginLocation: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  browser: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  os: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  status: string;

  @Column({ type: 'datetime', nullable: true, name: 'start_timestamp' })
  startTimestamp: Date;

  @Column({ type: 'datetime', nullable: true, name: 'last_access_time' })
  lastAccessTime: Date;

  @Column({ type: 'int', default: 0, name: 'expire_time' })
  expireTime: number;

  @Column({ type: 'blob', nullable: true, name: 'session_data' })
  sessionData: Buffer;
}
