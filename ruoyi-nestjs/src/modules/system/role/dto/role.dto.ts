import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: '测试角色' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  roleName: string;

  @ApiProperty({ description: '角色权限字符串', example: 'test' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  roleKey: string;

  @ApiProperty({ description: '显示顺序', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  roleSort: number;

  @ApiProperty({ description: '数据范围 (1 全部 2 本部门 3 本部门及以下 4 仅本人 5 自定义)', required: false, default: '1' })
  @IsOptional()
  @IsString()
  dataScope?: string;

  @ApiProperty({ description: '状态 (0 正常 1 停用)', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '菜单 ID 列表', required: false, isArray: true })
  @IsOptional()
  menuIds?: string[];

  @ApiProperty({ description: '部门 ID 列表', required: false, isArray: true })
  @IsOptional()
  deptIds?: string[];
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ description: '角色 ID' })
  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
