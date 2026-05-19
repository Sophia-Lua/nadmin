import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateConfigDto {
  @ApiProperty({ description: '参数名称', example: '主框架页-默认皮肤样式名称' })
  @IsString()
  @IsNotEmpty()
  configName: string;

  @ApiProperty({ description: '参数键名', example: 'sys.index.skinName' })
  @IsString()
  @IsNotEmpty()
  configKey: string;

  @ApiProperty({ description: '参数键值', example: 'skin-blue' })
  @IsString()
  @IsNotEmpty()
  configValue: string;

  @ApiProperty({ description: '系统内置 (Y 是 N 否)', required: false, default: 'N' })
  @IsOptional()
  @IsString()
  configType?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateConfigDto extends CreateConfigDto {
  @ApiProperty({ description: '参数 ID' })
  @IsNumber()
  @IsNotEmpty()
  configId: number;
}
