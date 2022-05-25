import { request } from '/@/utils/request';
import { SELL_API } from '/@/api/constant';


export interface SellCommunity {
	name: string, // 小区名称
	address: string, // 地址
	houseNumber: number, // 户数
}

/**
 * 添加
 * @param data 数据
 * @returns 实体
 */
export function add(data: SellCommunity) {
	return request.post(SELL_API + '/sellCommunity', data);
}

/**
 * 修改
 * @param data 数据
 * @returns 修改数量
 */
export function update(data: SellCommunity) {
	return request.put(SELL_API + '/sellCommunity', data);
}

/**
 * 根据id删除
 * @param id 字典id
 * @returns 修改数量
 */
export function deleteById(id: number) {
	return request.delete(SELL_API + '/sellCommunity', { data: { id } });
}

/**
 * 详情
 * @param id id必传
 * @returns 返回详情
 */
export function selectById(id: number) {
	return request.get(SELL_API + '/sellCommunity?id=' + id);
}

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post(SELL_API + '/sellCommunity/page', { ...params, searchCount: true });
}
