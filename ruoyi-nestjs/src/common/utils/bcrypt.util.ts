import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { RandomUtil } from './random.util';

export class BcryptUtil {
  private static readonly SALT_ROUNDS = 10;

  static hash(password: string): string {
    const salt = genSaltSync(this.SALT_ROUNDS);
    return hashSync(password, salt);
  }

  static compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  static hashWithSalt(password: string, salt: string): string {
    return hashSync(password, salt);
  }

  static generateSalt(): string {
    return RandomUtil.randomSalt(20);
  }
}
