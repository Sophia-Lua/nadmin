import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateDeptDto {
  @ApiProperty({ description: '父部门 ID', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ description: '部门名称', example: '技术部' })
  @IsString()
  @IsNotEmpty()
  deptName: string;

  @ApiProperty({ description: '显示顺序', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  orderNum?: number;

  @ApiProperty({ description: '负责人', required: false })
  @IsOptional()
  @IsString()
  leader?: string;

  @ApiProperty({ description: '联系电话', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: '状态 (0 正常 1 停用)', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateDeptDto extends CreateDeptDto {
  @ApiProperty({ description: '部门 ID' })
  @IsNumber()
  @IsNotEmpty()
  deptId: number;
}
