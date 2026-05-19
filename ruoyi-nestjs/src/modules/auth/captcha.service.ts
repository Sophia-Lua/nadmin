import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCanvas } from 'canvas';
import { RandomUtil } from '@/common/utils/random.util';

type CanvasRenderingContext2D = any;

@Injectable()
export class CaptchaService {
  private captchaEnabled = true;

  constructor(private configService: ConfigService) {}

  generateCaptcha(): {
    img: string;
    captchaEnabled: boolean;
    token: string;
    uuid: string;
  } {
    const uuid = RandomUtil.uuid();
    const token = RandomUtil.randomString(32);

    const width = 160;
    const height = 60;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const codeLength = 4;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      code += char;

      ctx.font = this.randomNum(28, 32) + 'px bold';
      ctx.fillStyle = this.randomColor();
      ctx.save();

      const x = 30 + i * 30;
      const y = this.randomNum(30, 40);
      const angle = this.randomNum(-30, 30) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(this.randomNum(0, width), this.randomNum(0, height));
      ctx.lineTo(this.randomNum(0, width), this.randomNum(0, height));
      ctx.strokeStyle = this.randomColor();
      ctx.stroke();
    }

    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(
        this.randomNum(0, width),
        this.randomNum(0, height),
        1,
        0,
        2 * Math.PI,
      );
      ctx.fillStyle = this.randomColor();
      ctx.fill();
    }

    const img = canvas.toDataURL('image/png');

    return {
      img,
      captchaEnabled: this.captchaEnabled,
      token,
      uuid,
    };
  }

  private randomColor(): string {
    const r = this.randomNum(50, 200);
    const g = this.randomNum(50, 200);
    const b = this.randomNum(50, 200);
    return `rgb(${r},${g},${b})`;
  }

  private randomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
