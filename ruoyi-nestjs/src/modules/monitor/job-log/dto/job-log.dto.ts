import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobLogDto {
  @IsString()
  @IsOptional()
  jobName?: string;

  @IsString()
  @IsOptional()
  jobGroup?: string;

  @IsString()
  @IsOptional()
  invokeTarget?: string;

  @IsString()
  @IsOptional()
  jobMessage?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  exceptionInfo?: string;
}

export class JobLogQueryDto {
  @IsNumber()
  @IsOptional()
  pageNum?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @IsString()
  @IsOptional()
  jobName?: string;

  @IsString()
  @IsOptional()
  jobGroup?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
