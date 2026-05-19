import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateDictTypeDto {
  @ApiProperty({ description: '字典名称', example: '用户性别' })
  @IsString()
  @IsNotEmpty()
  dictName: string;

  @ApiProperty({ description: '字典类型', example: 'sys_user_sex' })
  @IsString()
  @IsNotEmpty()
  dictType: string;

  @ApiProperty({ description: '状态', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictTypeDto extends CreateDictTypeDto {
  @ApiProperty({ description: '字典 ID' })
  @IsNumber()
  @IsNotEmpty()
  dictId: number;
}

export class CreateDictDataDto {
  @ApiProperty({ description: '字典类型', example: 'sys_user_sex' })
  @IsString()
  @IsNotEmpty()
  dictType: string;

  @ApiProperty({ description: '字典标签', example: '男' })
  @IsString()
  @IsNotEmpty()
  dictLabel: string;

  @ApiProperty({ description: '字典键值', example: '0' })
  @IsString()
  @IsNotEmpty()
  dictValue: string;

  @ApiProperty({ description: '样式属性', required: false })
  @IsOptional()
  @IsString()
  listClass?: string;

  @ApiProperty({ description: '排序', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  dictSort?: number;

  @ApiProperty({ description: '状态', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictDataDto extends CreateDictDataDto {
  @ApiProperty({ description: '字典编码' })
  @IsNumber()
  @IsNotEmpty()
  dictCode: number;
}
