import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ description: '公告标题' })
  @IsString()
  @IsNotEmpty()
  noticeTitle: string;

  @ApiProperty({ description: '公告类型 (1 通知 2 公告)', example: '1' })
  @IsString()
  @IsNotEmpty()
  noticeType: string;

  @ApiProperty({ description: '公告内容', required: false })
  @IsOptional()
  @IsString()
  noticeContent?: string;

  @ApiProperty({ description: '状态', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateNoticeDto extends CreateNoticeDto {
  @ApiProperty({ description: '公告 ID' })
  @IsNumber()
  @IsNotEmpty()
  noticeId: number;
}
