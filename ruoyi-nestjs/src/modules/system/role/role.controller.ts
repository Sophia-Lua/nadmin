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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@ApiTags('系统管理 / 角色管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('list')
  @ApiOperation({ summary: '角色列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('roleName') roleName?: string) {
    return this.roleService.list(pageNum || 1, pageSize || 10, roleName);
  }

  @Get()
  @ApiOperation({ summary: '角色管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('add')
  @ApiOperation({ summary: '新增角色页面' })
  add() {
    return this.roleService.add();
  }

  @Get('edit/:roleId')
  @ApiOperation({ summary: '修改角色页面' })
  edit(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.edit(roleId);
  }

  @Get('remove/:roleId')
  @ApiOperation({ summary: '删除角色' })
  removePage(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.removePage(roleId);
  }

  @Get('view/:roleId')
  @ApiOperation({ summary: '查看角色详情' })
  view(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.view(roleId);
  }

  @Get('selectMenuTree')
  @ApiOperation({ summary: '选择菜单树' })
  selectMenuTree() {
    return this.roleService.selectMenuTree();
  }

  @Post('list')
  @ApiOperation({ summary: '角色列表查询' })
  listPost(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('roleName') roleName?: string) {
    return this.roleService.list(pageNum || 1, pageSize || 10, roleName);
  }

  @Get(':roleId')
  @ApiOperation({ summary: '角色详情' })
  detail(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.detail(roleId);
  }

  @Post()
  @ApiOperation({ summary: '创建角色' })
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改角色' })
  update(@Body() dto: UpdateRoleDto) {
    return this.roleService.update(dto);
  }

  @Delete(':roleIds')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('roleIds') roleIds: string) {
    return this.roleService.remove(roleIds);
  }

  @Get('deptTree/:roleId')
  @ApiOperation({ summary: '角色部门树' })
  deptTree(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.deptTree(roleId);
  }

  @Post('export')
  @ApiOperation({ summary: '角色导出' })
  export(@Body() dto: any) {
    return this.roleService.export(dto);
  }

  @Post('remove')
  @ApiOperation({ summary: '删除角色' })
  removeBatch(@Body() body: { roleIds: string }) {
    return this.roleService.remove(body.roleIds);
  }

  @Post('changeStatus')
  @ApiOperation({ summary: '角色状态修改' })
  changeStatus(@Body() dto: any) {
    return this.roleService.changeStatus(dto);
  }

  @Get('authUser/:roleId')
  @ApiOperation({ summary: '分配用户页面' })
  authUser(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.authUser(roleId);
  }

  @Post('authUser/allocatedList')
  @ApiOperation({ summary: '查询已分配用户列表' })
  allocatedList(@Body() dto: any) {
    return this.roleService.allocatedList(dto);
  }

  @Post('authUser/cancel')
  @ApiOperation({ summary: '取消授权' })
  cancel(@Body() dto: any) {
    return this.roleService.cancel(dto);
  }

  @Post('authUser/cancelAll')
  @ApiOperation({ summary: '批量取消授权' })
  cancelAll(@Body() dto: any) {
    return this.roleService.cancelAll(dto);
  }

  @Post('authUser/selectAll')
  @ApiOperation({ summary: '批量选择用户授权' })
  selectAll(@Body() dto: any) {
    return this.roleService.selectAll(dto);
  }

  @Get('authUser/selectUser/:roleId')
  @ApiOperation({ summary: '选择用户页面' })
  selectUser(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.selectUser(roleId);
  }

  @Post('authUser/unallocatedList')
  @ApiOperation({ summary: '查询未分配用户列表' })
  unallocatedList(@Body() dto: any) {
    return this.roleService.unallocatedList(dto);
  }

  @Get('authDataScope/:roleId')
  @ApiOperation({ summary: '角色分配数据权限页面' })
  authDataScope(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.authDataScope(roleId);
  }

  @Post('authDataScope')
  @ApiOperation({ summary: '保存角色数据权限' })
  saveAuthDataScope(@Body() dto: any) {
    return this.roleService.saveAuthDataScope(dto);
  }

  @Post('checkRoleNameUnique')
  @ApiOperation({ summary: '校验角色名称唯一性' })
  checkRoleNameUnique(@Body() dto: any) {
    return this.roleService.checkRoleNameUnique(dto);
  }

  @Post('checkRoleKeyUnique')
  @ApiOperation({ summary: '校验角色权限唯一性' })
  checkRoleKeyUnique(@Body() dto: any) {
    return this.roleService.checkRoleKeyUnique(dto);
  }

  @Post('add')
  @ApiOperation({ summary: '新增保存角色' })
  addPost(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改保存角色' })
  editPost(@Body() dto: UpdateRoleDto) {
    return this.roleService.update(dto);
  }

  @Get('deptTreeData/:roleId')
  @ApiOperation({ summary: '加载角色部门列表树' })
  deptTreeData(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.deptTree(roleId);
  }
}
