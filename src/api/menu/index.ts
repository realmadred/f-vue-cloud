import request from '/@/utils/request';

/**
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @param type 菜单类型，非必传
 * @returns 返回接口数据
 */
export function getMenu(type: number | null) {
	return request.get('/sysMenu/tree', { params: { type } });
}

/**
 * 查询用户按钮权限
 * @returns 按钮权限数组
 */
export function getPerms() {
	return request.get('/sysMenu/perms');
}


