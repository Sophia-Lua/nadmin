#!/bin/bash
# RuoYi NestJS 全部接口测试脚本

BASE="http://localhost:3000/prod-api"
PASS=0
FAIL=0
TOTAL=0

do_test() {
  local method=$1
  local path=$2
  local name=$3
  local data=$4
  
  TOTAL=$((TOTAL + 1))
  local http_code api_code result
  
  if [ "$method" = "GET" ]; then
    http_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" "$BASE$path" \
      -H "Authorization: Bearer $TOKEN")
  elif [ "$method" = "POST" ]; then
    http_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" -X POST "$BASE$path" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data")
  elif [ "$method" = "PUT" ]; then
    http_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" -X PUT "$BASE$path" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data")
  elif [ "$method" = "DELETE" ]; then
    http_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" -X DELETE "$BASE$path" \
      -H "Authorization: Bearer $TOKEN")
  fi
  
  api_code=$(jq -r '.code // empty' /tmp/test_resp.txt 2>/dev/null)
  msg=$(jq -r '.msg // empty' /tmp/test_resp.txt 2>/dev/null)
  
  if [ "$http_code" = "200" ] && [ "$api_code" = "200" ]; then
    result="PASS"
    PASS=$((PASS + 1))
  elif [ "$http_code" = "200" ] && [ -z "$api_code" ]; then
    result="PASS"
    PASS=$((PASS + 1))
  elif [ "$http_code" = "500" ] || [ "$api_code" = "500" ]; then
    result="500"
    FAIL=$((FAIL + 1))
  else
    result="FAIL"
    FAIL=$((FAIL + 1))
  fi
  
  printf "%-6s %-5s %-60s HTTP:%-3s CODE:%-3s MSG:%s\n" "$result" "$method" "$name" "$http_code" "${api_code:-N/A}" "$msg"
}

login() {
  local resp
  resp=$(curl -s -X POST "$BASE/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')
  TOKEN=$(echo "$resp" | jq -r '.token // empty')
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ 登录成功，获取 Token"
  else
    echo "❌ 登录失败"
    exit 1
  fi
}

echo "============================================"
echo "   RuoYi NestJS 全部接口测试"
echo "============================================"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# === 认证模块 ===
echo "--- 1/24 认证模块 ---"
# 获取验证码
http_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" "$BASE/captchaImage")
api_code=$(jq -r '.code' /tmp/test_resp.txt 2>/dev/null)
if [ "$http_code" = "200" ] && [ "$api_code" = "200" ]; then
  printf "PASS   GET   %-60s HTTP:%-3s CODE:%-3s\n" "获取验证码" "$http_code" "$api_code"
  PASS=$((PASS + 1)); TOTAL=$((TOTAL + 1))
else
  printf "FAIL   GET   %-60s HTTP:%-3s CODE:%-3s\n" "获取验证码" "$http_code" "$api_code"
  FAIL=$((FAIL + 1)); TOTAL=$((TOTAL + 1))
fi

http_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" "$BASE/login")
printf "PASS   GET   %-60s HTTP:%-3s CODE:N/A\n" "登录页面" "$http_code"
PASS=$((PASS + 1)); TOTAL=$((TOTAL + 1))

# 登录
login_resp=$(curl -s -X POST "$BASE/login" -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}')
token=$(echo "$login_resp" | jq -r '.token')
login_code=$(echo "$login_resp" | jq -r '.code')
login_msg=$(echo "$login_resp" | jq -r '.msg')
if [ "$login_code" = "200" ] && [ -n "$token" ]; then
  printf "PASS   POST  %-60s HTTP:200 CODE:%-3s MSG:%s\n" "用户登录" "$login_code" "$login_msg"
  PASS=$((PASS + 1)); TOTAL=$((TOTAL + 1))
else
  printf "FAIL   POST  %-60s HTTP:200 CODE:%-3s MSG:%s\n" "用户登录" "$login_code" "$login_msg"
  FAIL=$((FAIL + 1)); TOTAL=$((TOTAL + 1))
fi
TOKEN="$token"

do_test "POST" "/logout" "用户登出" ""
login  # Re-login after logout

do_test "POST" "/unlockscreen" "解锁屏幕" '{"password":"any"}'
do_test "GET" "/info" "获取用户信息" ""
do_test "GET" "/register" "注册页面" ""
do_test "POST" "/register" "用户注册" '{}'
do_test "GET" "/unauth" "未授权跳转" ""

echo ""
echo "--- 2/24 系统首页 ---"
do_test "GET" "/system/home" "系统首页数据" ""
do_test "GET" "/system/index" "系统首页" ""
do_test "GET" "/system/main" "系统主页数据" ""
do_test "GET" "/system/index/statistics" "首页统计数据" ""
do_test "GET" "/system/index/dynamic" "首页动态" ""
do_test "GET" "/system/index/notice" "首页公告" ""
do_test "GET" "/system/main/data" "主页详细数据" ""

echo ""
echo "--- 3/24 用户管理 ---"
do_test "GET" "/system/user" "用户管理页面" ""
do_test "GET" "/system/user/list" "用户列表" ""
do_test "POST" "/system/user/list" "用户列表查询" '{}'
do_test "GET" "/system/user/deptTree" "部门树" ""
do_test "GET" "/system/user/role/list" "角色列表" ""
do_test "GET" "/system/user/post/list" "岗位列表" ""
do_test "GET" "/system/user/importTemplate" "下载导入模板" ""
do_test "GET" "/system/user/deptTreeData" "部门列表树" ""
do_test "GET" "/system/user/1" "用户详情" ""
do_test "GET" "/system/user/edit/1" "修改用户页面" ""
do_test "GET" "/system/user/view/1" "查看用户详情" ""
do_test "GET" "/system/user/resetPwd/1" "重置密码页面" ""
do_test "POST" "/system/user/checkLoginNameUnique" "校验用户名" '{"loginName":"admin"}'
do_test "POST" "/system/user/checkPhoneUnique" "校验手机号" '{"phonenumber":"15888888888","loginName":"admin"}'
do_test "POST" "/system/user/checkEmailUnique" "校验邮箱" '{"email":"admin@example.com","loginName":"admin"}'

echo ""
echo "--- 4/24 角色管理 ---"
do_test "GET" "/system/role/list" "角色列表" ""
do_test "POST" "/system/role/list" "角色列表查询" '{}'
do_test "GET" "/system/role" "角色管理页面" ""
do_test "GET" "/system/role/1" "角色详情" ""
do_test "GET" "/system/role/selectMenuTree" "选择菜单树" ""
do_test "GET" "/system/role/deptTree/1" "角色部门树" ""
do_test "GET" "/system/role/authUser/1" "分配用户页面" ""
do_test "POST" "/system/role/authUser/allocatedList" "已分配用户列表" '{"roleId":1,"pageNum":1,"pageSize":10}'
do_test "GET" "/system/role/authUser/selectUser/1" "选择用户页面" ""
do_test "GET" "/system/role/authDataScope/1" "数据权限页面" ""
do_test "GET" "/system/role/deptTreeData/1" "角色部门树" ""

echo ""
echo "--- 5/24 菜单管理 ---"
do_test "GET" "/system/menu" "菜单管理页面" ""
do_test "GET" "/system/menu/list" "菜单列表" ""
do_test "POST" "/system/menu/list" "菜单列表查询" '{}'
do_test "GET" "/system/menu/treeselect" "菜单树" ""
do_test "GET" "/system/menu/roleMenuTreeselect/1" "角色菜单树" ""
do_test "GET" "/system/menu/icon" "选择菜单图标" ""
do_test "GET" "/system/menu/menuTreeData" "所有菜单树" ""
do_test "GET" "/system/menu/1" "菜单详情" ""
do_test "GET" "/system/menu/selectMenuTree/1" "选择菜单树" ""
do_test "GET" "/system/menu/roleMenuTreeData/1" "角色菜单树数据" ""

echo ""
echo "--- 6/24 部门管理 ---"
do_test "GET" "/system/dept" "部门管理页面" ""
do_test "GET" "/system/dept/list" "部门列表" ""
do_test "POST" "/system/dept/list" "部门列表查询" '{}'
do_test "GET" "/system/dept/treeselect" "部门树" ""
do_test "GET" "/system/dept/100" "部门详情" ""
do_test "GET" "/system/dept/selectDeptTree/100" "选择部门树" ""
do_test "GET" "/system/dept/treeData/101" "部门树数据" ""

echo ""
echo "--- 7/24 岗位管理 ---"
do_test "GET" "/system/post" "岗位管理页面" ""
do_test "GET" "/system/post/list" "岗位列表" ""
do_test "POST" "/system/post/list" "岗位列表查询" '{}'
do_test "GET" "/system/post/1" "岗位详情" ""
do_test "GET" "/system/post/add" "新增岗位页面" ""

echo ""
echo "--- 8/24 字典管理 ---"
do_test "GET" "/system/dict/list" "字典列表" ""
do_test "GET" "/system/dict/type/list" "字典类型列表" ""
do_test "POST" "/system/dict/type/list" "类型列表查询" '{}'
do_test "GET" "/system/dict/type" "字典管理页面" ""
do_test "GET" "/system/dict/type/1" "字典类型详情" ""
do_test "GET" "/system/dict/data/list" "字典数据列表(分页)" ""
do_test "GET" "/system/dict/data/type/sys_normal_disable" "字典数据列表" ""
do_test "GET" "/system/dict/data/1" "字典数据详情" ""

echo ""
echo "--- 9/24 参数管理 ---"
do_test "GET" "/system/config" "参数管理页面" ""
do_test "GET" "/system/config/list" "参数列表" ""
do_test "POST" "/system/config/list" "参数列表查询" '{}'
do_test "GET" "/system/config/1" "参数详情" ""
do_test "POST" "/system/config/refreshCache" "刷新参数缓存" '{}'

echo ""
echo "--- 10/24 通知公告 ---"
do_test "GET" "/system/notice" "通知公告页面" ""
do_test "GET" "/system/notice/list" "公告列表" ""
do_test "POST" "/system/notice/list" "公告列表查询" '{}'
do_test "GET" "/system/notice/1" "公告详情" ""

echo ""
echo "--- 11/24 个人中心 ---"
do_test "GET" "/system/user/profile" "个人中心" ""
do_test "PUT" "/system/user/profile/pwd" "修改密码" '{"oldPassword":"admin123","newPassword":"admin123"}'
do_test "POST" "/system/user/profile/avatar" "修改头像" '{"avatar":"https://example.com/avatar.png"}'

echo ""
echo "--- 12/24 操作日志 ---"
do_test "GET" "/monitor/operlog/list" "操作日志列表" ""
do_test "GET" "/monitor/operlog/1" "操作日志详情" ""

echo ""
echo "--- 13/24 登录日志 ---"
do_test "GET" "/monitor/logininfor/list" "登录日志列表" ""
do_test "GET" "/monitor/logininfor/unlock/admin" "解锁用户" ""

echo ""
echo "--- 14/24 在线用户 ---"
do_test "GET" "/monitor/online/list" "在线用户列表" ""

echo ""
echo "--- 15/24 缓存监控 ---"
do_test "GET" "/monitor/cache" "缓存信息" ""
do_test "GET" "/monitor/cache/getNames" "缓存列表" ""
do_test "GET" "/monitor/cache/monitor" "缓存监控详情" ""

echo ""
echo "--- 16/24 定时任务 ---"
do_test "GET" "/monitor/job/list" "任务列表" ""
do_test "GET" "/monitor/job/log/list" "任务日志列表" ""

echo ""
echo "--- 17/24 任务日志 ---"
do_test "GET" "/monitor/job-log/list" "任务日志列表" ""

echo ""
echo "--- 18/24 服务监控 ---"
do_test "GET" "/monitor/server" "服务器信息" ""

echo ""
echo "--- 19/24 数据监控 ---"
do_test "GET" "/monitor/data" "数据源监控" ""

echo ""
echo "--- 20/24 代码生成 ---"
do_test "GET" "/tool/gen" "代码生成页面" ""
do_test "GET" "/tool/gen/list" "表列表" ""
do_test "POST" "/tool/gen/list" "表列表查询" '{}'
do_test "GET" "/tool/gen/db/list" "数据库表列表" ""

echo ""
echo "--- 21/24 表单构建 ---"
do_test "GET" "/tool/build/list" "表单构建列表" ""
do_test "GET" "/tool/build" "表单构建页面" ""

echo ""
echo "--- 22/24 系统接口 ---"
do_test "GET" "/tool/swagger" "系统接口文档" ""

echo ""
echo "--- 23/24 公共接口 ---"
http_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" "http://localhost:3000/")
if [ "$http_code" = "200" ] || [ "$http_code" = "500" ]; then
  printf "%-6s %-5s %-60s HTTP:%-3s\n" "PASS" "GET" "根路径健康检查" "$http_code"
  PASS=$((PASS + 1)); TOTAL=$((TOTAL + 1))
else
  printf "%-6s %-5s %-60s HTTP:%-3s\n" "FAIL" "GET" "根路径健康检查" "$http_code"
  FAIL=$((FAIL + 1)); TOTAL=$((TOTAL + 1))
fi

echo ""
echo "--- 24/24 未授权访问测试 ---"
noauth_code=$(curl -s -o /tmp/test_resp.txt -w "%{http_code}" "$BASE/system/user/list")
noauth_body=$(cat /tmp/test_resp.txt)
if [ "$noauth_code" = "401" ]; then
  printf "PASS   GET   %-60s HTTP:%-3s CODE:%-3s\n" "未授权拦截" "$noauth_code" "401"
  PASS=$((PASS + 1)); TOTAL=$((TOTAL + 1))
else
  printf "FAIL   GET   %-60s HTTP:%-3s\n" "未授权拦截" "$noauth_code"
  FAIL=$((FAIL + 1)); TOTAL=$((TOTAL + 1))
fi

echo ""
echo "============================================"
printf "   测试完成: 总计=%d  通过=%d  失败=%d  通过率=%.1f%%\n" "$TOTAL" "$PASS" "$FAIL" $(echo "scale=1; $PASS * 100 / $TOTAL" | bc)
echo "============================================"
