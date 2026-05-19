import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '岗位编码', example: 'ceo' })
  @IsString()
  @IsNotEmpty()
  postCode: string;

  @ApiProperty({ description: '岗位名称', example: '董事长' })
  @IsString()
  @IsNotEmpty()
  postName: string;

  @ApiProperty({ description: '显示顺序', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  postSort?: number;

  @ApiProperty({ description: '状态 (0 正常 1 停用)', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty({ description: '岗位 ID' })
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
