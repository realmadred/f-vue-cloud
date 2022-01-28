import request from '/@/utils/request';

export interface SysRolesMenus {
	roleId: number, // 角色id
	menuIds: number[], // 菜单id数组
}

export interface SysRole {
	id: number, // 角色id
	name: string, // 角色名称
	description: string, // 角色描述
}

/**
 * 添加
 * @param id 用户id必传
 * @returns 用户信息
 */
export function add(role: SysRole) {
	return request.post('/sysRole', role);
}

/**
 * 修改
 * @param id 用户id必传
 * @returns 修改数量
 */
export function update(role: SysRole) {
	return request.put('/sysRole', role);
}

/**
 * 根据id删除用户
 * @param id 用户id必传
 * @returns 修改数量
 */
export function deleteById(id: number) {
	return request.delete('/sysRole', { data: { id } });
}

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post('/sysRole/page', { ...params, searchCount: true });
}

/**
 * 查询所有角色
 * @returns 返回所有角色
 */
export function selectAll() {
	return request.get('/sysRole/all');
}

/**
 * 查询角色关联的菜单
 * @param id 角色id
 * @returns 返回菜单id数组
 */
export function menuByRoleId(id: number) {
	return request.get('/sysRole/menuByRoleId?id=' + id);
}

/**
 * 绑定菜单
 * @param roleMenu 角色菜单关系
 */
export function bind(roleMenu: SysRolesMenus) {
	return request.post('/sysRole/bindMenu', roleMenu);
}

/**
 * 解除绑定菜单
 * @param roleMenu 角色菜单关系
 */
export function unBind(roleMenu: SysRolesMenus) {
	return request.post('/sysRole/unBindMenu', roleMenu);
}
