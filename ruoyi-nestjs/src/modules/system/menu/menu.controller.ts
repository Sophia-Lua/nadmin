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
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@ApiTags('系统管理 / 菜单管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: '菜单管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '菜单列表' })
  list(@Query('menuName') menuName?: string) {
    return this.menuService.list(menuName);
  }

  @Post('list')
  @ApiOperation({ summary: '菜单列表查询' })
  listPost(@Query('menuName') menuName?: string) {
    return this.menuService.list(menuName);
  }

  @Get('add/:parentId')
  @ApiOperation({ summary: '新增菜单页面' })
  add(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.menuService.add(parentId);
  }

  @Get('edit/:menuId')
  @ApiOperation({ summary: '修改菜单页面' })
  edit(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuService.edit(menuId);
  }

  @Get('remove/:menuId')
  @ApiOperation({ summary: '删除菜单' })
  removePage(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuService.removePage(menuId);
  }

  @Get('treeselect')
  @ApiOperation({ summary: '菜单树' })
  treeselect() {
    return this.menuService.treeselect();
  }

  @Get('roleMenuTreeselect/:roleId')
  @ApiOperation({ summary: '角色菜单树' })
  roleMenuTreeselect(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.menuService.roleMenuTreeselect(roleId);
  }

  @Get('icon')
  @ApiOperation({ summary: '选择菜单图标' })
  icon() {
    return this.menuService.icon();
  }

  @Get('menuTreeData')
  @ApiOperation({ summary: '加载所有菜单列表树' })
  menuTreeData() {
    return this.menuService.menuTreeData();
  }

  @Get(':menuId')
  @ApiOperation({ summary: '菜单详情' })
  detail(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuService.detail(menuId);
  }

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改菜单' })
  update(@Body() dto: UpdateMenuDto) {
    return this.menuService.update(dto);
  }

  @Delete(':menuId')
  @ApiOperation({ summary: '删除菜单' })
  remove(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuService.remove(menuId);
  }

  @Post('updateSort')
  @ApiOperation({ summary: '保存菜单排序' })
  updateSort(@Body() dto: any) {
    return this.menuService.updateSort(dto);
  }

  @Post('checkMenuNameUnique')
  @ApiOperation({ summary: '校验菜单名称唯一性' })
  checkMenuNameUnique(@Body() dto: any) {
    return this.menuService.checkMenuNameUnique(dto);
  }

  @Get('selectMenuTree/:menuId')
  @ApiOperation({ summary: '选择菜单树' })
  selectMenuTree(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuService.selectMenuTree(menuId);
  }

  @Post('add')
  @ApiOperation({ summary: '新增保存菜单' })
  addPost(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改保存菜单' })
  editPost(@Body() dto: UpdateMenuDto) {
    return this.menuService.update(dto);
  }

  @Get('roleMenuTreeData/:roleId')
  @ApiOperation({ summary: '加载角色菜单列表树' })
  roleMenuTreeData(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.menuService.roleMenuTreeselect(roleId);
  }
}
