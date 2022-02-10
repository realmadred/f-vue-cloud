import request from '/@/utils/request';
import { SYS_API } from '/@/api/constant';

export interface SysUser {
	id: number;// id
	name: string;// 账户名称
	phone: string;// 手机号
	email: string;// 邮箱
	headImage: string;// 头像
	sex: number;// 性别
	passwordErrorNum: number;// 密码错误次数
	status: number;// 状态
}

export interface SysUsersRoles {
	userId: number, // 用户id
	roleIds: number[], // 角色id数组
}

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post(SYS_API + '/sysUser/page', { ...params, searchCount: true });
}

/**
 * 详情
 * @param id 用户id必传
 * @returns 返回用户详情
 */
export function selectById(id: number) {
	return request.get(SYS_API + '/sysUser?id=' + id);
}

/**
 * 添加
 * @param id 用户id必传
 * @returns 用户信息
 */
export function add(user: object) {
	return request.post(SYS_API + '/sysUser', user);
}

/**
 * 修改
 * @param id 用户id必传
 * @returns 修改数量
 */
export function update(user: object) {
	return request.put(SYS_API + '/sysUser', user);
}

/**
 * 根据id删除用户
 * @param id 用户id必传
 * @returns 修改数量
 */
export function deleteById(id: number) {
	return request.delete(SYS_API + '/sysUser', { data: { id } });
}


/**
 * 查询用户关联的角色
 * @param id 用户id
 * @returns 返回角色id数组
 */
 export function roleByUserId(id: number) {
	return request.get(SYS_API + '/sysUser/roleByUserId?id=' + id);
}

/**
 * 绑定角色
 * @param userRole 用户角色关系
 */
export function bind(userRole: SysUsersRoles) {
	return request.post(SYS_API + '/sysUser/bindRole', userRole);
}

/**
 * 解除绑定角色
 * @param userRole 用户角色关系
 */
export function unBind(userRole: SysUsersRoles) {
	return request.post(SYS_API + '/sysUser/unBindRole', userRole);
}
