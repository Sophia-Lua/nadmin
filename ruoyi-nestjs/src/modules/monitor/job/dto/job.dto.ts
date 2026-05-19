import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ description: '任务名称' })
  @IsString()
  @IsNotEmpty()
  jobName: string;

  @ApiProperty({ description: '任务组名', required: false, default: 'DEFAULT' })
  @IsOptional()
  @IsString()
  jobGroup?: string;

  @ApiProperty({ description: '调用目标' })
  @IsString()
  @IsNotEmpty()
  invokeTarget: string;

  @ApiProperty({ description: 'cron 表达式' })
  @IsString()
  @IsNotEmpty()
  cronExpression: string;

  @ApiProperty({ description: '执行策略', required: false, default: '0' })
  @IsOptional()
  @IsString()
  misfirePolicy?: string;

  @ApiProperty({ description: '是否并发', required: false, default: '1' })
  @IsOptional()
  @IsString()
  concurrent?: string;

  @ApiProperty({ description: '状态', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateJobDto extends CreateJobDto {
  @ApiProperty({ description: '任务 ID' })
  @IsNumber()
  @IsNotEmpty()
  jobId: number;
}
