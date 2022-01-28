import request from '/@/utils/request';

/**
 * 查询菜单
 * @param type 菜单类型，非必传
 * @returns 返回接口数据
 */
 export function getMenu(type: number | null) {
	return request.get('/sysMenu/tree', { params: { type } });
}

/**
 * 添加
 * @param id 用户id必传
 * @returns 用户信息
 */
 export function add(user: object) {
	return request.post('/sysMenu', user);
}

/**
 * 修改
 * @param id 用户id必传
 * @returns 修改数量
 */
export function update(user: object) {
	return request.put('/sysMenu', user);
}

/**
 * 根据id删除用户
 * @param id 用户id必传
 * @returns 修改数量
 */
export function deleteById(id: number) {
	return request.delete('/sysMenu', { data: { id } });
}
