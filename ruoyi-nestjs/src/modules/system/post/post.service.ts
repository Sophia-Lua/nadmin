import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysPost } from '../../../entities/sys-post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPost)
    private readonly sysPostRepo: Repository<SysPost>,
  ) {}

  async list(pageNum: number, pageSize: number, postName?: string) {
    const where: any = {};
    if (postName) where.postName = Like(`%${postName}%`);

    const [rows, total] = await this.sysPostRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { postSort: 'ASC' },
    });

    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(postId: number) {
    const post = await this.sysPostRepo.findOne({ where: { postId: String(postId) } });
    if (!post) throw new NotFoundException('岗位不存在');
    return { code: 200, msg: '操作成功', data: post };
  }

  async create(dto: CreatePostDto) {
    const post = this.sysPostRepo.create({ ...dto, status: dto.status || '0' });
    await this.sysPostRepo.save(post);
    return { code: 200, msg: '操作成功' };
  }

  async update(dto: UpdatePostDto) {
    const post = await this.sysPostRepo.findOne({ where: { postId: String(dto.postId) } });
    if (!post) throw new NotFoundException('岗位不存在');
    Object.assign(post, dto);
    await this.sysPostRepo.save(post);
    return { code: 200, msg: '操作成功' };
  }

  async remove(postIds: string) {
    const idList = postIds.split(',');
    await this.sysPostRepo.delete({ postId: In(idList) });
    return { code: 200, msg: '操作成功' };
  }

  async add() {
    return { code: 200, msg: '操作成功' };
  }

  async edit(postId: number) {
    const post = await this.sysPostRepo.findOne({ where: { postId: String(postId) } });
    if (!post) throw new NotFoundException('岗位不存在');
    return { code: 200, msg: '操作成功', data: post };
  }

  async export(dto: any) {
    const posts = await this.sysPostRepo.find({ order: { postSort: 'ASC' } });
    return { code: 200, msg: '操作成功', data: { posts } };
  }

  async checkPostNameUnique(dto: any) {
    const { postName } = dto;
    const post = await this.sysPostRepo.findOne({ where: { postName } });
    return { code: 200, msg: '操作成功', data: post ? { hasPost: true } : { hasPost: false } };
  }

  async checkPostCodeUnique(dto: any) {
    const { postCode } = dto;
    const post = await this.sysPostRepo.findOne({ where: { postCode } });
    return { code: 200, msg: '操作成功', data: post ? { hasPost: true } : { hasPost: false } };
  }
}
