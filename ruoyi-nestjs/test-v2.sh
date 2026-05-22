#!/bin/bash
set +o histexpand 2>/dev/null

TOKEN=$(curl -s -X POST "http://localhost:3000/prod-api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')
BASE="http://localhost:3000/prod-api"
PASS=0
FAIL=0
TOTAL=0

do_check() {
  local method="$1" path="$2" name="$3" data="${4:-}"
  TOTAL=$((TOTAL + 1))
  local hc ac msg

  if [ "$method" = "GET" ]; then
    hc=$(curl -s -o /tmp/tr -w "%{http_code}" "$BASE$path" \
      -H "Authorization: Bearer $TOKEN")
  elif [ "$method" = "POST" ]; then
    hc=$(curl -s -o /tmp/tr -w "%{http_code}" -X POST "$BASE$path" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data")
  elif [ "$method" = "PUT" ]; then
    hc=$(curl -s -o /tmp/tr -w "%{http_code}" -X PUT "$BASE$path" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  ac=$(jq -r '.code // empty' /tmp/tr 2>/dev/null)
  msg=$(jq -r '.msg // empty' /tmp/tr 2>/dev/null)

  if { [ "$hc" = "200" ] && [ "$ac" = "200" ]; } || \
     { [ "$hc" = "201" ] && [ "$ac" = "200" ]; } || \
     { [ "$hc" = "200" ] && [ -z "$ac" ]; } || \
     { [ "$hc" = "500" ] && [ "$name" = *"预期500"* ]; }; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    printf "  FAIL  %-4s %-50s  HTTP:%s  CODE:%s  %s\n" "$method" "$name" "$hc" "${ac:-N/A}" "$msg"
  fi
}

echo "=== 接口测试详细报告 ==="
echo "Token: ${TOKEN:0:20}..."
echo ""

# === 认证 ===
echo "--- 认证模块 ---"
do_check "GET" "/captchaImage" "获取验证码"
do_check "POST" "/logout" "用户登出" ""
LOGIN=$(curl -s -X POST "$BASE/login" -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}')
TOKEN=$(echo "$LOGIN" | jq -r '.token')

do_check "POST" "/unlockscreen" "解锁屏幕" '{"password":"any"}'
do_check "GET" "/info" "获取用户信息"
do_check "GET" "/register" "注册页面(预期500)"
do_check "POST" "/register" "用户注册(预期500)" '{}'
do_check "GET" "/unauth" "未授权跳转"

# === 系统首页 ===
echo ""
echo "--- 系统首页 ---"
do_check "GET" "/system/home" "系统首页数据"
do_check "GET" "/system/index" "系统首页"
do_check "GET" "/system/main" "系统主页数据"
do_check "GET" "/system/index/statistics" "首页统计数据"
do_check "GET" "/system/index/dynamic" "首页动态"
do_check "GET" "/system/index/notice" "首页公告"
do_check "GET" "/system/main/data" "主页详细数据"

# === 用户管理 ===
echo ""
echo "--- 用户管理 ---"
do_check "GET" "/system/user" "用户管理页面"
do_check "GET" "/system/user/list" "用户列表"
do_check "POST" "/system/user/list" "用户列表查询" '{}'
do_check "GET" "/system/user/deptTree" "部门树"
do_check "GET" "/system/user/role/list" "角色列表"
do_check "GET" "/system/user/post/list" "岗位列表"
do_check "GET" "/system/user/importTemplate" "下载导入模板"
do_check "GET" "/system/user/deptTreeData" "部门列表树"
do_check "GET" "/system/user/1" "用户详情"
do_check "GET" "/system/user/edit/1" "修改用户页面"
do_check "GET" "/system/user/view/1" "查看用户详情"
do_check "POST" "/system/user/checkLoginNameUnique" "校验用户名" '{"loginName":"admin"}'
do_check "POST" "/system/user/checkPhoneUnique" "校验手机号" '{"phonenumber":"15888888888"}'
do_check "POST" "/system/user/checkEmailUnique" "校验邮箱" '{"email":"a@b.com"}'

# === 角色管理 ===
echo ""
echo "--- 角色管理 ---"
do_check "GET" "/system/role/list" "角色列表"
do_check "POST" "/system/role/list" "角色列表查询" '{}'
do_check "GET" "/system/role" "角色管理页面"
do_check "GET" "/system/role/1" "角色详情"
do_check "GET" "/system/role/selectMenuTree" "选择菜单树"
do_check "GET" "/system/role/deptTree/1" "角色部门树"
do_check "GET" "/system/role/authUser/1" "分配用户页面"
do_check "POST" "/system/role/authUser/allocatedList" "已分配用户列表" '{"roleId":1}'
do_check "GET" "/system/role/authUser/selectUser/1" "选择用户页面"
do_check "GET" "/system/role/authDataScope/1" "数据权限页面"
do_check "GET" "/system/role/deptTreeData/1" "角色部门树"

# === 菜单管理 ===
echo ""
echo "--- 菜单管理 ---"
do_check "GET" "/system/menu" "菜单管理页面"
do_check "GET" "/system/menu/list" "菜单列表"
do_check "POST" "/system/menu/list" "菜单列表查询" '{}'
do_check "GET" "/system/menu/treeselect" "菜单树"
do_check "GET" "/system/menu/roleMenuTreeselect/1" "角色菜单树"
do_check "GET" "/system/menu/icon" "选择菜单图标"
do_check "GET" "/system/menu/menuTreeData" "所有菜单树"
do_check "GET" "/system/menu/1" "菜单详情"

# === 部门管理 ===
echo ""
echo "--- 部门管理 ---"
do_check "GET" "/system/dept" "部门管理页面"
do_check "GET" "/system/dept/list" "部门列表"
do_check "POST" "/system/dept/list" "部门列表查询" '{}'
do_check "GET" "/system/dept/treeselect" "部门树"
do_check "GET" "/system/dept/100" "部门详情"
do_check "GET" "/system/dept/selectDeptTree/100" "选择部门树"

# === 岗位管理 ===
echo ""
echo "--- 岗位管理 ---"
do_check "GET" "/system/post" "岗位管理页面"
do_check "GET" "/system/post/list" "岗位列表"
do_check "POST" "/system/post/list" "岗位列表查询" '{}'
do_check "GET" "/system/post/1" "岗位详情"

# === 字典管理 ===
echo ""
echo "--- 字典管理 ---"
do_check "GET" "/system/dict/type/list" "字典类型列表"
do_check "POST" "/system/dict/type/list" "类型列表查询" '{}'
do_check "GET" "/system/dict/type/1" "字典类型详情"
do_check "GET" "/system/dict/data/list" "字典数据列表(分页)"
do_check "GET" "/system/dict/data/type/sys_normal_disable" "字典数据列表"
do_check "GET" "/system/dict/data/1" "字典数据详情"

# === 参数管理 ===
echo ""
echo "--- 参数管理 ---"
do_check "GET" "/system/config/list" "参数列表"
do_check "POST" "/system/config/list" "参数列表查询" '{}'
do_check "GET" "/system/config/1" "参数详情"
do_check "POST" "/system/config/refreshCache" "刷新参数缓存" '{}'

# === 通知公告 ===
echo ""
echo "--- 通知公告 ---"
do_check "GET" "/system/notice/list" "公告列表"
do_check "POST" "/system/notice/list" "公告列表查询" '{}'
do_check "GET" "/system/notice/1" "公告详情"

# === 个人中心 ===
echo ""
echo "--- 个人中心 ---"
do_check "GET" "/system/user/profile" "个人中心"
do_check "PUT" "/system/user/profile/pwd" "修改密码" '{"oldPassword":"admin123","newPassword":"admin123"}'
do_check "POST" "/system/user/profile/avatar" "修改头像" '{"avatar":"https://x.com/a.png"}'

# === 操作日志 ===
echo ""
echo "--- 操作日志 ---"
do_check "GET" "/monitor/operlog/list" "操作日志列表"
do_check "GET" "/monitor/operlog/1" "操作日志详情"

# === 登录日志 ===
echo ""
echo "--- 登录日志 ---"
do_check "GET" "/monitor/logininfor/list" "登录日志列表"
do_check "GET" "/monitor/logininfor/unlock/admin" "解锁用户"

# === 在线用户 ===
echo ""
echo "--- 在线用户 ---"
do_check "GET" "/monitor/online/list" "在线用户列表"

# === 缓存监控 ===
echo ""
echo "--- 缓存监控 ---"
do_check "GET" "/monitor/cache" "缓存信息"
do_check "GET" "/monitor/cache/getNames" "缓存列表"
do_check "GET" "/monitor/cache/monitor" "缓存监控详情"

# === 定时任务 ===
echo ""
echo "--- 定时任务 ---"
do_check "GET" "/monitor/job/list" "任务列表"
do_check "GET" "/monitor/job/log/list" "任务日志列表"

# === 任务日志 ===
echo ""
echo "--- 任务日志 ---"
do_check "GET" "/monitor/job-log/list" "任务日志列表"

# === 服务监控 ===
echo ""
echo "--- 服务监控 ---"
do_check "GET" "/monitor/server" "服务器信息"

# === 数据监控 ===
echo ""
echo "--- 数据监控 ---"
do_check "GET" "/monitor/data" "数据源监控"

# === 代码生成 ===
echo ""
echo "--- 代码生成 ---"
do_check "GET" "/tool/gen/list" "表列表"
do_check "POST" "/tool/gen/list" "表列表查询" '{}'
do_check "GET" "/tool/gen/db/list" "数据库表列表"

# === 表单构建 ===
echo ""
echo "--- 表单构建 ---"
do_check "GET" "/tool/build" "表单构建页面"

# === 系统接口 ===
echo ""
echo "--- 系统接口 ---"
do_check "GET" "/tool/swagger" "系统接口文档"

echo ""
echo "============================================"
printf "  总计: %d  |  通过: %d  |  失败: %d\n" "$TOTAL" "$PASS" "$FAIL"
if [ "$TOTAL" -gt 0 ]; then
  RATE=$(awk "BEGIN {printf \"%.1f\", $PASS * 100.0 / $TOTAL}")
  echo "  通过率: ${RATE}%"
fi
echo "============================================"

# Output failure details
echo ""
echo "=== 失败接口汇总 ==="
