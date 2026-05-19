import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称', example: '用户管理' })
  @IsString()
  @IsNotEmpty()
  menuName: string;

  @ApiProperty({ description: '父菜单 ID', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ description: '显示顺序', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  orderNum?: number;

  @ApiProperty({ description: '路由地址', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: '打开方式 (0 内部 1 新窗口)', required: false, default: '0' })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiProperty({ description: '菜单类型 (M 目录 C 菜单 F 按钮)', required: false, default: 'C' })
  @IsOptional()
  @IsString()
  menuType?: string;

  @ApiProperty({ description: '状态 (0 正常 1 停用)', required: false, default: '0' })
  @IsOptional()
  @IsString()
  visible?: string;

  @ApiProperty({ description: '是否刷新 (0 否 1 是)', required: false, default: '1' })
  @IsOptional()
  @IsString()
  isRefresh?: string;

  @ApiProperty({ description: '权限标识', required: false })
  @IsOptional()
  @IsString()
  perms?: string;

  @ApiProperty({ description: '图标', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateMenuDto extends CreateMenuDto {
  @ApiProperty({ description: '菜单 ID' })
  @IsNumber()
  @IsNotEmpty()
  menuId: number;
}
