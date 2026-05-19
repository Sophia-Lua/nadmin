export enum ErrorCode {
  SUCCESS = 200,
  FAIL = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  
  USER_EXISTS = 1001,
  USER_NOT_EXISTS = 1002,
  USER_DISABLE = 1003,
  USER_PASSWORD_NOT_MATCH = 1004,
  USER_CAPTCHA_CODE_ERROR = 1005,
  
  ROLE_EXISTS = 2001,
  ROLE_DISABLE = 2002,
  ROLE_NOT_ALLOW = 2003,
  ROLE_DATA_SCOPE_FAIL = 2004,
  
  DEPT_EXISTS = 3001,
  DEPT_DISABLE = 3002,
  DEPT_NOT_ALLOW_DEL = 3003,
  DEPT_PARENT_SELF = 3004,
  
  MENU_EXISTS = 4001,
  MENU_NOT_ALLOW_DEL = 4002,
  
  POST_EXISTS = 5001,
  
  DICT_TYPE_EXISTS = 6001,
  DICT_TYPE_DISABLE = 6002,
  DICT_DATA_EXISTS = 6003,
  
  CONFIG_KEY_EXISTS = 7001,
  
  FILE_UPLOAD_FAIL = 8001,
  FILE_NOT_FOUND = 8002,
  FILE_SIZE_EXCEED = 8003,
  
  CAPTCHA_GENERATE_FAIL = 9001,
  CAPTCHA_EXPIRED = 9002,
  
  TOKEN_EXPIRED = 10001,
  TOKEN_INVALID = 10002,
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.SUCCESS]: '操作成功',
  [ErrorCode.FAIL]: '操作失败',
  [ErrorCode.UNAUTHORIZED]: '未授权',
  [ErrorCode.FORBIDDEN]: '禁止访问',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.BAD_REQUEST]: '请求参数错误',
  
  [ErrorCode.USER_EXISTS]: '用户已存在',
  [ErrorCode.USER_NOT_EXISTS]: '用户不存在',
  [ErrorCode.USER_DISABLE]: '用户已停用',
  [ErrorCode.USER_PASSWORD_NOT_MATCH]: '用户名或密码错误',
  [ErrorCode.USER_CAPTCHA_CODE_ERROR]: '验证码错误',
  
  [ErrorCode.ROLE_EXISTS]: '角色已存在',
  [ErrorCode.ROLE_DISABLE]: '角色已停用',
  [ErrorCode.ROLE_NOT_ALLOW]: '无操作权限',
  [ErrorCode.ROLE_DATA_SCOPE_FAIL]: '数据权限验证失败',
  
  [ErrorCode.DEPT_EXISTS]: '部门名称已存在',
  [ErrorCode.DEPT_DISABLE]: '部门已停用',
  [ErrorCode.DEPT_NOT_ALLOW_DEL]: '部门存在子节点不允许删除',
  [ErrorCode.DEPT_PARENT_SELF]: '不能设置自己为父节点',
  
  [ErrorCode.MENU_EXISTS]: '菜单名称已存在',
  [ErrorCode.MENU_NOT_ALLOW_DEL]: '菜单已分配不允许删除',
  
  [ErrorCode.POST_EXISTS]: '岗位已存在',
  
  [ErrorCode.DICT_TYPE_EXISTS]: '字典类型已存在',
  [ErrorCode.DICT_TYPE_DISABLE]: '字典类型已停用',
  [ErrorCode.DICT_DATA_EXISTS]: '字典数据已存在',
  
  [ErrorCode.CONFIG_KEY_EXISTS]: '参数键已存在',
  
  [ErrorCode.FILE_UPLOAD_FAIL]: '文件上传失败',
  [ErrorCode.FILE_NOT_FOUND]: '文件不存在',
  [ErrorCode.FILE_SIZE_EXCEED]: '文件大小超出限制',
  
  [ErrorCode.CAPTCHA_GENERATE_FAIL]: '验证码生成失败',
  [ErrorCode.CAPTCHA_EXPIRED]: '验证码已过期',
  
  [ErrorCode.TOKEN_EXPIRED]: 'Token 已过期',
  [ErrorCode.TOKEN_INVALID]: 'Token 无效',
};
