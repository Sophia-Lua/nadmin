import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RequiresPermissions } from '../../../common/decorators/requires-permissions.decorator';
import { SkipTransform } from '../../../common/decorators/skip-transform.decorator';
import { SysUserService } from './sys-user.service';
import { CreateSysUserDto, UpdateSysUserDto, ResetPasswordDto, AuthRoleDto, CheckUniqueDto } from './dto/sys-user.dto';

@ApiTags('系统管理 / 用户管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @Get()
  @ApiOperation({ summary: '用户管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '用户列表' })
  @RequiresPermissions('system:user:list')
  listGet(@Query() query: any) {
    const page = query.pageNum ? parseInt(query.pageNum, 10) : 1;
    const size = query.pageSize ? parseInt(query.pageSize, 10) : 10;
    return this.sysUserService.list(page, size, query.loginName);
  }

  @Post('list')
  @ApiOperation({ summary: '用户列表查询' })
  @RequiresPermissions('system:user:list')
  list(@Query() query: any) {
    const page = query.pageNum ? parseInt(query.pageNum, 10) : 1;
    const size = query.pageSize ? parseInt(query.pageSize, 10) : 10;
    return this.sysUserService.list(page, size, query.loginName);
  }

  @Get('deptTree')
  @ApiOperation({ summary: '部门树' })
  deptTree() {
    return this.sysUserService.deptTree();
  }

  @Get('role/list')
  @ApiOperation({ summary: '角色列表' })
  roleList() {
    return this.sysUserService.roleList();
  }

  @Get('post/list')
  @ApiOperation({ summary: '岗位列表' })
  postList() {
    return this.sysUserService.postList();
  }

  @Get('importTemplate')
  @ApiOperation({ summary: '下载导入模板' })
  @SkipTransform()
  importTemplate(@Res({ passthrough: true }) res: Response) {
    return this.sysUserService.importTemplate(res);
  }

  @Get('deptTreeData')
  @ApiOperation({ summary: '加载部门列表树' })
  deptTreeData() {
    return this.sysUserService.deptTreeData();
  }

  @Get('add')
  @ApiOperation({ summary: '新增用户页面' })
  add() {
    return this.sysUserService.add();
  }

  @Get('selectDeptTree/:deptId')
  @ApiOperation({ summary: '选择部门树' })
  selectDeptTree(@Param('deptId', ParseIntPipe) deptId: number) {
    return this.sysUserService.selectDeptTree(deptId);
  }

  @Get(':userId')
  @ApiOperation({ summary: '用户详情' })
  detail(@Param('userId', ParseIntPipe) userId: number) {
    return this.sysUserService.detail(userId);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @RequiresPermissions('system:user:add')
  create(@Body() dto: CreateSysUserDto) {
    return this.sysUserService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改用户' })
  @RequiresPermissions('system:user:edit')
  update(@Body() dto: UpdateSysUserDto) {
    return this.sysUserService.update(dto);
  }

  @Delete(':userIds')
  @ApiOperation({ summary: '删除用户' })
  @RequiresPermissions('system:user:remove')
  remove(@Param('userIds') userIds: string) {
    return this.sysUserService.remove(userIds);
  }

  @Post('export')
  @ApiOperation({ summary: '用户导出' })
  @RequiresPermissions('system:user:export')
  export(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    return this.sysUserService.export(dto, res);
  }

  @Post('importData')
  @ApiOperation({ summary: '用户导入' })
  @RequiresPermissions('system:user:import')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  importData(@UploadedFile() file: any, @Body() body: any) {
    return this.sysUserService.importData(file, body);
  }

  @Post('resetPwd')
  @ApiOperation({ summary: '重置密码' })
  resetPwd(@Body() dto: ResetPasswordDto) {
    return this.sysUserService.resetPwd(dto);
  }

  @Get('authRole/:userId')
  @ApiOperation({ summary: '授权角色页面' })
  authRole(@Param('userId', ParseIntPipe) userId: number) {
    return this.sysUserService.authRole(userId);
  }

  @Post('authRole/insertAuthRole')
  @ApiOperation({ summary: '用户授权角色' })
  insertAuthRole(@Body() dto: AuthRoleDto) {
    return this.sysUserService.insertAuthRole(dto);
  }

  @Post('changeStatus')
  @ApiOperation({ summary: '用户状态修改' })
  changeStatus(@Body() dto: any) {
    return this.sysUserService.changeStatus(dto);
  }

  @Post('checkLoginNameUnique')
  @ApiOperation({ summary: '校验用户名唯一性' })
  checkLoginNameUnique(@Body() dto: CheckUniqueDto) {
    return this.sysUserService.checkLoginNameUnique(dto);
  }

  @Post('checkPhoneUnique')
  @ApiOperation({ summary: '校验手机号唯一性' })
  checkPhoneUnique(@Body() dto: CheckUniqueDto) {
    return this.sysUserService.checkPhoneUnique(dto);
  }

  @Post('checkEmailUnique')
  @ApiOperation({ summary: '校验邮箱唯一性' })
  checkEmailUnique(@Body() dto: CheckUniqueDto) {
    return this.sysUserService.checkEmailUnique(dto);
  }

  @Get('edit/:userId')
  @ApiOperation({ summary: '修改用户页面' })
  edit(@Param('userId', ParseIntPipe) userId: number) {
    return this.sysUserService.edit(userId);
  }

  @Get('view/:userId')
  @ApiOperation({ summary: '查看用户详情' })
  view(@Param('userId', ParseIntPipe) userId: number) {
    return this.sysUserService.view(userId);
  }

  @Get('resetPwd/:userId')
  @ApiOperation({ summary: '重置密码页面' })
  resetPwdPage(@Param('userId', ParseIntPipe) userId: number) {
    return this.sysUserService.resetPwdPage(userId);
  }

  @Post('remove')
  @ApiOperation({ summary: '删除用户' })
  removeBatch(@Body() body: { userIds: string }) {
    return this.sysUserService.remove(body.userIds);
  }

  @Post('add')
  @ApiOperation({ summary: '新增保存用户' })
  addPost(@Body() dto: CreateSysUserDto) {
    return this.sysUserService.create(dto);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改保存用户' })
  editPost(@Body() dto: UpdateSysUserDto) {
    return this.sysUserService.update(dto);
  }
}
