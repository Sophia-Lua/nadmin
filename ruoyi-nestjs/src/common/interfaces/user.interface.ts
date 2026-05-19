export interface JwtPayload {
  sub: string;
  loginName: string;
  permissions: string[];
  roles: string[];
}

export interface RequestUser {
  userId: string;
  loginName: string;
  permissions: string[];
  roles: string[];
}
