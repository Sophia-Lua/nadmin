import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('公共接口')
@Controller('common')
export class CommonController {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '单文件上传' })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: any) {
    if (!file) {
      return { code: 500, msg: '上传失败', data: null };
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    return {
      code: 200,
      msg: '上传成功',
      fileName: file.originalname,
      url: `/common/download?fileName=${fileName}`,
    };
  }

  @Post('uploads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '多文件上传' })
  @UseInterceptors(FilesInterceptor('files', 10))
  uploads(@UploadedFiles() files: any[]) {
    const result = files.map((file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      return {
        fileName: file.originalname,
        url: `/common/download?fileName=${fileName}`,
      };
    });

    return {
      code: 200,
      msg: '上传成功',
      data: result,
    };
  }

  @Get('download')
  @ApiOperation({ summary: '文件下载' })
  download(@Query('fileName') fileName: string, @Res() res: Response) {
    const filePath = path.join(this.uploadDir, fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ code: 404, msg: '文件不存在' });
    }
    res.download(filePath);
  }

  @Get('download/resource')
  @ApiOperation({ summary: '资源文件下载' })
  downloadResource(@Query('fileName') fileName: string, @Res() res: Response) {
    const filePath = path.join(this.uploadDir, fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ code: 404, msg: '文件不存在' });
    }
    res.sendFile(filePath);
  }
}
