import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_notice')
export class SysNotice {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'notice_id' })
  noticeId: string;

  @Column({ type: 'varchar', length: 50, name: 'notice_title' })
  noticeTitle: string;

  @Column({ type: 'char', length: 1, name: 'notice_type' })
  noticeType: string;

  @Column({ type: 'longtext', name: 'notice_content', nullable: true })
  noticeContent: string;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'create_by' })
  createBy: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'update_by' })
  updateBy: string;

  @Column({ type: 'datetime', name: 'update_time', nullable: true })
  updateTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string;
}
