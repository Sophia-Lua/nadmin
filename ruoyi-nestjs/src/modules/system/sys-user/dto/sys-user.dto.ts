import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateSysUserDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(2)
  @MaxLength(30)
  loginName: string;

  @ApiProperty({ description: '密码', example: 'test123' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @ApiProperty({ description: '用户昵称', example: '测试用户', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  userName?: string;

  @ApiProperty({ description: '部门 ID', required: false })
  @IsOptional()
  deptId?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  email?: string;

  @ApiProperty({ description: '手机号', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  phonenumber?: string;

  @ApiProperty({ description: '性别 (0 男 1 女 2 未知)', required: false, default: '0' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '状态 (0 正常 1 停用)', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '角色 ID 列表', required: false, isArray: true })
  @IsOptional()
  roleIds?: string[];

  @ApiProperty({ description: '岗位 ID 列表', required: false, isArray: true })
  @IsOptional()
  postIds?: string[];
}

export class UpdateSysUserDto {
  @ApiProperty({ description: '用户 ID' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  loginName?: string;

  @ApiProperty({ description: '密码', required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password?: string;

  @ApiProperty({ description: '用户昵称', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  userName?: string;

  @ApiProperty({ description: '部门 ID', required: false })
  @IsOptional()
  deptId?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  email?: string;

  @ApiProperty({ description: '手机号', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  phonenumber?: string;

  @ApiProperty({ description: '性别', required: false })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '状态', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '角色 ID 列表', required: false, isArray: true })
  @IsOptional()
  roleIds?: string[];

  @ApiProperty({ description: '岗位 ID 列表', required: false, isArray: true })
  @IsOptional()
  postIds?: string[];
}

export class ResetPasswordDto {
  @ApiProperty({ description: '用户 ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '新密码' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}

export class AuthRoleDto {
  @ApiProperty({ description: '用户 ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '角色 ID 列表', isArray: true })
  @IsString({ each: true })
  roleIds: string[];
}

export class CheckUniqueDto {
  @ApiProperty({ description: '用户名/手机号/邮箱', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ description: '登录用户名', required: false })
  @IsString()
  @IsOptional()
  loginName?: string;

  @ApiProperty({ description: '手机号', required: false })
  @IsString()
  @IsOptional()
  phonenumber?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsString()
  @IsOptional()
  email?: string;
}
