export interface RuoYiResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
  rows?: T[];
  total?: number;
}

export interface PageResult<T> {
  rows: T[];
  total: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
  user: {
    userId: string;
    loginName: string;
    userName: string;
    avatar: string;
  };
}

export interface CaptchaData {
  captchaEnabled: boolean;
  token: string;
  uuid: string;
  img: string;
}
