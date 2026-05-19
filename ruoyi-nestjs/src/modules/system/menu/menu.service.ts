import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SysMenu } from '../../../entities/sys-menu.entity';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenu)
    private readonly sysMenuRepo: Repository<SysMenu>,
  ) {}

  async list(menuName?: string) {
    const where: any = {};
    if (menuName) {
      where.menuName = Like(`%${menuName}%`);
    }

    const menus = await this.sysMenuRepo.find({
      where,
      order: { orderNum: 'ASC' },
    });

    return { code: 200, msg: '操作成功', data: menus };
  }

  async treeselect() {
    const menus = await this.sysMenuRepo.find({
      order: { orderNum: 'ASC' },
    });

    const tree = this.buildMenuTree(menus, '0');

    return { code: 200, msg: '操作成功', data: tree };
  }

  async roleMenuTreeselect(roleId: number) {
    const menus = await this.sysMenuRepo.find({
      order: { orderNum: 'ASC' },
    });

    const tree = this.buildMenuTree(menus, '0');

    return { code: 200, msg: '操作成功', data: { menus: tree, checkedKeys: [] } };
  }

  async detail(menuId: number) {
    const menu = await this.sysMenuRepo.findOne({
      where: { menuId: String(menuId) },
    });

    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    return { code: 200, msg: '操作成功', data: menu };
  }

  async create(dto: CreateMenuDto) {
    const menu = this.sysMenuRepo.create({
      ...dto,
      parentId: String(dto.parentId || 0),
      visible: dto.visible || '0',
      isRefresh: dto.isRefresh || '1',
    });

    await this.sysMenuRepo.save(menu);

    return {
      code: 200,
      msg: '操作成功',
    };
  }

  async update(dto: UpdateMenuDto) {
    const menu = await this.sysMenuRepo.findOne({
      where: { menuId: String(dto.menuId) },
    });

    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    Object.assign(menu, dto);
    await this.sysMenuRepo.save(menu);

    return {
      code: 200,
      msg: '操作成功',
    };
  }

  async remove(menuId: number) {
    await this.sysMenuRepo.delete({ menuId: String(menuId) });

    return {
      code: 200,
      msg: '操作成功',
    };
  }

  async updateSort(dto: any) {
    const { menuId, orderNum } = dto;
    const menu = await this.sysMenuRepo.findOne({ where: { menuId: String(menuId) } });
    if (!menu) throw new NotFoundException('菜单不存在');
    await this.sysMenuRepo.update({ menuId: String(menuId) }, { orderNum });
    return { code: 200, msg: '操作成功' };
  }

  async icon() {
    const icons = [
      'fa fa-home', 'fa fa-user', 'fa fa-cog', 'fa fa-list', 'fa fa-lock',
      'fa fa-chart-bar', 'fa fa-calendar', 'fa fa-envelope', 'fa fa-file',
      'fa fa-folder', 'fa fa-globe', 'fa fa-heart', 'fa fa-image', 'fa fa-link',
      'fa fa-map-marker', 'fa fa-phone', 'fa fa-power-off', 'fa fa-search',
      'fa fa-shopping-cart', 'fa fa-star', 'fa fa-tag', 'fa fa-thumbs-up',
      'fa fa-trash', 'fa fa-video', 'fa fa-wrench',
    ];
    return { code: 200, msg: '操作成功', data: icons };
  }

  async checkMenuNameUnique(dto: any) {
    const { menuName } = dto;
    const menu = await this.sysMenuRepo.findOne({ where: { menuName } });
    return { code: 200, msg: '操作成功', data: menu ? { hasMenu: true } : { hasMenu: false } };
  }

  async menuTreeData() {
    const menus = await this.sysMenuRepo.find({ order: { orderNum: 'ASC' } });
    const tree = this.buildMenuTree(menus, '0');
    return { code: 200, msg: '操作成功', data: tree };
  }

  async selectMenuTree(menuId: number) {
    const menus = await this.sysMenuRepo.find({ order: { orderNum: 'ASC' } });
    const tree = this.buildMenuTree(menus, '0');
    return {
      code: 200,
      msg: '操作成功',
      data: { menus: tree, checkedKeys: [String(menuId)] },
    };
  }

  async add(parentId: number) {
    return { code: 200, msg: '操作成功', data: { parentId: String(parentId) } };
  }

  async edit(menuId: number) {
    const menu = await this.sysMenuRepo.findOne({ where: { menuId: String(menuId) } });
    if (!menu) throw new NotFoundException('菜单不存在');
    return { code: 200, msg: '操作成功', data: menu };
  }

  async removePage(menuId: number) {
    const menu = await this.sysMenuRepo.findOne({ where: { menuId: String(menuId) } });
    if (!menu) throw new NotFoundException('菜单不存在');
    return { code: 200, msg: '操作成功', data: menu };
  }

  private buildMenuTree(menus: any[], parentId: string): any[] {
    const children = menus
      .filter(m => m.parentId === parentId)
      .map(m => ({
        ...m,
        children: this.buildMenuTree(menus, String(m.menuId)),
      }));

    return children.length ? children : [];
  }
}
