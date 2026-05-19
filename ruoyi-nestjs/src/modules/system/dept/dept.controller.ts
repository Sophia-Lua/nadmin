import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { DeptService } from './dept.service';
import { CreateDeptDto, UpdateDeptDto } from './dto/dept.dto';

@ApiTags('系统管理 / 部门管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Get()
  @ApiOperation({ summary: '部门管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '部门列表' })
  list(@Query('deptName') deptName?: string, @Query('status') status?: string) {
    return this.deptService.list(deptName, status);
  }

  @Post('list')
  @ApiOperation({ summary: '部门列表查询' })
  listPost(@Query('deptName') deptName?: string, @Query('status') status?: string) {
    return this.deptService.list(deptName, status);
  }

  @Get('add/:parentId')
  @ApiOperation({ summary: '新增部门页面' })
  add(@Param('parentId') parentId: string) {
    return this.deptService.add(Number(parentId));
  }

  @Get('edit/:deptId')
  @ApiOperation({ summary: '修改部门页面' })
  edit(@Param('deptId') deptId: string) {
    return this.deptService.edit(Number(deptId));
  }

  @Get('remove/:deptId')
  @ApiOperation({ summary: '删除部门' })
  removePage(@Param('deptId') deptId: string) {
    return this.deptService.removePage(Number(deptId));
  }

  @Get('treeselect')
  @ApiOperation({ summary: '部门树' })
  treeselect() {
    return this.deptService.treeselect();
  }

  @Get(':deptId')
  @ApiOperation({ summary: '部门详情' })
  detail(@Param('deptId') deptId: string) {
    return this.deptService.detail(Number(deptId));
  }

  @Post()
  @ApiOperation({ summary: '创建部门' })
  create(@Body() dto: CreateDeptDto) {
    return this.deptService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改部门' })
  update(@Body() dto: UpdateDeptDto) {
    return this.deptService.update(dto);
  }

  @Delete(':deptId')
  @ApiOperation({ summary: '删除部门' })
  remove(@Param('deptId') deptId: string) {
    return this.deptService.remove(Number(deptId));
  }

  @Post('updateSort')
  @ApiOperation({ summary: '保存部门排序' })
  updateSort(@Body() dto: any) {
    return this.deptService.updateSort(dto);
  }

  @Post('add')
  @ApiOperation({ summary: '新增保存部门' })
  addPost(@Body() dto: CreateDeptDto) {
    return this.deptService.create(dto);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改保存部门' })
  editPost(@Body() dto: UpdateDeptDto) {
    return this.deptService.update(dto);
  }

  @Post('checkDeptNameUnique')
  @ApiOperation({ summary: '校验部门名称唯一性' })
  checkDeptNameUnique(@Body() dto: any) {
    return this.deptService.checkDeptNameUnique(dto);
  }

  @Get('selectDeptTree/:deptId')
  @ApiOperation({ summary: '选择部门树' })
  selectDeptTree(@Param('deptId') deptId: string) {
    return this.deptService.selectDeptTree(Number(deptId));
  }

  @Get('selectDeptTree/:deptId/:excludeId')
  @ApiOperation({ summary: '选择部门树(排除)' })
  selectDeptTreeExclude(@Param('deptId') deptId: string, @Param('excludeId') excludeId: string) {
    return this.deptService.selectDeptTreeExclude(Number(deptId), Number(excludeId));
  }

  @Get('treeData/:excludeId')
  @ApiOperation({ summary: '部门树数据' })
  treeData(@Param('excludeId') excludeId: string) {
    return this.deptService.treeData(Number(excludeId));
  }
}
