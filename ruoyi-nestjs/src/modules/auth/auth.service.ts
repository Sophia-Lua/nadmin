import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUser } from '@/entities/sys-user.entity';
import { BcryptUtil } from '@/common/utils/bcrypt.util';
import { RandomUtil } from '@/common/utils/random.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<SysUser> {
    const user = await this.userRepository.findOne({
      where: { loginName: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status !== '0') {
      throw new UnauthorizedException('用户已被停用');
    }

    if (user.delFlag !== '0') {
      throw new UnauthorizedException('用户已被删除');
    }

    const isPasswordValid = BcryptUtil.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return user;
  }

  async login(user: SysUser) {
    const payload = {
      sub: user.userId,
      loginName: user.loginName,
      permissions: await this.getUserPermissions(user.userId),
      roles: await this.getUserRoles(user.userId),
    };

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN') || 7200;

    return {
      token: this.jwtService.sign(payload, { expiresIn }),
      expiresIn,
      user: {
        userId: user.userId,
        loginName: user.loginName,
        userName: user.userName,
        avatar: user.avatar,
      },
    };
  }

  private async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['roles', 'roles.menus'],
    });

    if (!user || !user.roles) {
      return [];
    }

    const permissions = new Set<string>();
    user.roles.forEach((role) => {
      if (role.status === '0' && role.menus) {
        role.menus.forEach((menu) => {
          if (menu.perms && menu.perms.trim() !== '' && menu.menuType === 'F') {
            permissions.add(menu.perms);
          }
        });
      }
    });

    return Array.from(permissions);
  }

  private async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['roles'],
    });

    if (!user || !user.roles) {
      return [];
    }

    return user.roles
      .filter((role) => role.status === '0')
      .map((role) => role.roleKey);
  }

  async refreshToken(user: SysUser) {
    return this.login(user);
  }
}
