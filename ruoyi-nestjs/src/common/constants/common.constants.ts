export enum BusinessType {
  OTHER = 0,
  INSERT = 1,
  UPDATE = 2,
  DELETE = 3,
  GRANT = 4,
  EXPORT = 5,
  IMPORT = 6,
  FORCE = 7,
  CLEAN = 8,
}

export enum OperatorType {
  OTHER = 0,
  WEB = 1,
  MOBILE = 2,
}

export enum UserStatus {
  OK = '0',
  DISABLE = '1',
}

export enum DictStatus {
  OK = '0',
  DISABLE = '1',
}

export enum MenuType {
  DIRECTORY = 'M',
  MENU = 'C',
  BUTTON = 'F',
}

export enum VisibleStatus {
  SHOW = '0',
  HIDE = '1',
}

export enum YesNo {
  YES = 'Y',
  NO = 'N',
}

export enum DeleteFlag {
  EXIST = '0',
  DELETED = '2',
}

export const ADMIN_ROLE_ID = '1';
export const SUPER_ADMIN_LOGIN_NAME = 'admin';
