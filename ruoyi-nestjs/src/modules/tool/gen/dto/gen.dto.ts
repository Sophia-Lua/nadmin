import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GenTableDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  pageNum?: number;

  @ApiProperty({ description: '每页条数', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @ApiProperty({ description: '表名', required: false })
  @IsOptional()
  @IsString()
  tableName?: string;

  @ApiProperty({ description: '表描述', required: false })
  @IsOptional()
  @IsString()
  tableComment?: string;
}
