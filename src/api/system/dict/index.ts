import { request } from '/@/utils/request';
import { SYS_API } from '/@/api/constant';


export interface SysDict {
	id: number, // 字典id
	name: string, // 字典名称
	code: string, // 字典描述
}

export interface SysDictDetail {
	id: number, // id
	dictId: string, // 字典id
	dictCode: string, // 字典code
	name: string, // 名称
	value: string, // 字典值
	sort: number, // 排序
}

export interface SysDictSave extends SysDict {
	list: SysDictDetail[]
}

/**
 * 添加
 * @param dict 字典内容
 * @returns 字典
 */
export function add(dict: SysDict) {
	return request.post(SYS_API + '/sysDict', dict);
}

/**
 * 修改
 * @param dict 字典
 * @returns 修改数量
 */
export function update(dict: SysDict) {
	return request.put(SYS_API + '/sysDict', dict);
}

/**
 * 根据id删除
 * @param id 字典id
 * @returns 修改数量
 */
export function deleteById(id: number) {
	return request.delete(SYS_API + '/sysDict', { data: { id } });
}

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post(SYS_API + '/sysDict/page', { ...params, searchCount: true });
}

/**
 * 查询字典详情列表
 * @param id 字典id
 * @returns 字典值
 */
export function detailByDictId(id: number) {
	return request.get(SYS_API + '/sysDict/detailByDictId?id=' + id);
}

/**
 * 根据code查询字典
 * @param code 字典编码
 * @returns 字典值
 */
export function detailByCode(code: string) {
	return request.get(SYS_API + '/sysDict/detailByCode?code=' + code);
}

/**
 * 字典详情数据添加
 * @param detail 字典详情数据
 */
export function save(detail: SysDictSave) {
	return request.post(SYS_API + '/sysDict/save', detail);
}
