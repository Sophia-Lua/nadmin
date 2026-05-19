import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@ApiTags('系统管理 / 岗位管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: '岗位管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '岗位列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('postName') postName?: string) {
    return this.postService.list(pageNum || 1, pageSize || 10, postName);
  }

  @Post('list')
  @ApiOperation({ summary: '岗位列表查询' })
  listPost(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('postName') postName?: string) {
    return this.postService.list(pageNum || 1, pageSize || 10, postName);
  }

  @Get('add')
  @ApiOperation({ summary: '新增岗位页面' })
  add() {
    return this.postService.add();
  }

  @Get('edit/:postId')
  @ApiOperation({ summary: '修改岗位页面' })
  edit(@Param('postId') postId: string) {
    return this.postService.edit(Number(postId));
  }

  @Post('export')
  @ApiOperation({ summary: '岗位导出' })
  export(@Body() dto: any) {
    return this.postService.export(dto);
  }

  @Post('remove')
  @ApiOperation({ summary: '删除岗位' })
  removeBatch(@Body() body: { postIds: string }) {
    return this.postService.remove(body.postIds);
  }

  @Get(':postId')
  @ApiOperation({ summary: '岗位详情' })
  detail(@Param('postId') postId: string) {
    return this.postService.detail(Number(postId));
  }

  @Post()
  @ApiOperation({ summary: '创建岗位' })
  create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改岗位' })
  update(@Body() dto: UpdatePostDto) {
    return this.postService.update(dto);
  }

  @Delete(':postIds')
  @ApiOperation({ summary: '删除岗位' })
  remove(@Param('postIds') postIds: string) {
    return this.postService.remove(postIds);
  }

  @Post('add')
  @ApiOperation({ summary: '新增保存岗位' })
  addPost(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改保存岗位' })
  editPost(@Body() dto: UpdatePostDto) {
    return this.postService.update(dto);
  }

  @Post('checkPostNameUnique')
  @ApiOperation({ summary: '校验岗位名称唯一性' })
  checkPostNameUnique(@Body() dto: any) {
    return this.postService.checkPostNameUnique(dto);
  }

  @Post('checkPostCodeUnique')
  @ApiOperation({ summary: '校验岗位编码唯一性' })
  checkPostCodeUnique(@Body() dto: any) {
    return this.postService.checkPostCodeUnique(dto);
  }
}
