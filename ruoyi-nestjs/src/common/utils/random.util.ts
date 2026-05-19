import { randomBytes } from 'crypto';

export class RandomUtil {
  static randomString(length = 32): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .substring(0, length);
  }

  static randomSalt(length = 20): string {
    return this.randomString(length);
  }

  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
