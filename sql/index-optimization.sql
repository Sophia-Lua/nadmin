-- 数据库索引优化建议
-- 执行前请根据实际数据量和查询频率评估

-- 用户表索引
CREATE INDEX idx_sys_user_login_name ON sys_user(login_name);
CREATE INDEX idx_sys_user_del_flag ON sys_user(del_flag);
CREATE INDEX idx_sys_user_status ON sys_user(status);
CREATE INDEX idx_sys_user_dept_id ON sys_user(dept_id);
CREATE INDEX idx_sys_user_email ON sys_user(email);
CREATE INDEX idx_sys_user_phonenumber ON sys_user(phonenumber);
CREATE INDEX idx_sys_user_create_time ON sys_user(create_time);

-- 角色表索引
CREATE INDEX idx_sys_role_del_flag ON sys_role(del_flag);
CREATE INDEX idx_sys_role_status ON sys_role(status);
CREATE INDEX idx_sys_role_role_key ON sys_role(role_key);

-- 菜单表索引
CREATE INDEX idx_sys_menu_parent_id ON sys_menu(parent_id);
CREATE INDEX idx_sys_menu_menu_type ON sys_menu(menu_type);
CREATE INDEX idx_sys_menu_order_num ON sys_menu(order_num);

-- 部门表索引
CREATE INDEX idx_sys_dept_parent_id ON sys_dept(parent_id);
CREATE INDEX idx_sys_dept_del_flag ON sys_dept(del_flag);
CREATE INDEX idx_sys_dept_status ON sys_dept(status);
CREATE INDEX idx_sys_dept_order_num ON sys_dept(order_num);

-- 岗位表索引
CREATE INDEX idx_sys_post_status ON sys_post(status);
CREATE INDEX idx_sys_post_post_sort ON sys_post(post_sort);

-- 字典类型表索引
CREATE INDEX idx_sys_dict_type_dict_name ON sys_dict_type(dict_name);
CREATE INDEX idx_sys_dict_type_dict_type ON sys_dict_type(dict_type);

-- 字典数据表索引
CREATE INDEX idx_sys_dict_data_dict_type ON sys_dict_data(dict_type);
CREATE INDEX idx_sys_dict_data_status ON sys_dict_data(status);
CREATE INDEX idx_sys_dict_data_dict_sort ON sys_dict_data(dict_sort);

-- 操作日志表索引
CREATE INDEX idx_sys_oper_log_oper_time ON sys_oper_log(oper_time);
CREATE INDEX idx_sys_oper_log_title ON sys_oper_log(title);
CREATE INDEX idx_sys_oper_log_oper_name ON sys_oper_log(oper_name);

-- 登录日志表索引
CREATE INDEX idx_sys_logininfor_login_time ON sys_logininfor(login_time);
CREATE INDEX idx_sys_logininfor_user_name ON sys_logininfor(user_name);
CREATE INDEX idx_sys_logininfor_ipaddr ON sys_logininfor(ipaddr);
CREATE INDEX idx_sys_logininfor_status ON sys_logininfor(status);

-- 定时任务表索引
CREATE INDEX idx_sys_job_status ON sys_job(status);
CREATE INDEX idx_sys_job_job_name ON sys_job(job_name);

-- 定时任务日志表索引
CREATE INDEX idx_sys_job_log_create_time ON sys_job_log(create_time);
CREATE INDEX idx_sys_job_log_job_name ON sys_job_log(job_name);

-- 用户角色关联表索引
CREATE INDEX idx_sys_user_role_user_id ON sys_user_role(user_id);
CREATE INDEX idx_sys_user_role_role_id ON sys_user_role(role_id);

-- 角色菜单关联表索引
CREATE INDEX idx_sys_role_menu_role_id ON sys_role_menu(role_id);
CREATE INDEX idx_sys_role_menu_menu_id ON sys_role_menu(menu_id);

-- 角色部门关联表索引
CREATE INDEX idx_sys_role_dept_role_id ON sys_role_dept(role_id);
CREATE INDEX idx_sys_role_dept_dept_id ON sys_role_dept(dept_id);

-- 通知公告表索引
CREATE INDEX idx_sys_notice_create_time ON sys_notice(create_time);
CREATE INDEX idx_sys_notice_status ON sys_notice(status);

-- 系统配置表索引
CREATE INDEX idx_sys_config_config_key ON sys_config(config_key);

-- 在线用户表索引
CREATE INDEX idx_sys_user_online_login_time ON sys_user_online(login_time);
CREATE INDEX idx_sys_user_online_token ON sys_user_online(token);
