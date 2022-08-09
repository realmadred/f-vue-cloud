import { request } from '/@/utils/request';
import { FLOW_API } from '/@/api/constant';


export interface FlowDesign {
	flowId: string , // 流程id
	name: string , // 流程名称
	xml: string , // xml
	svg: string , // svg
}

/**
 * 添加
 * @param data 数据
 * @returns 实体
 */
export function add(data: FlowDesign) {
	return request.post(FLOW_API + '/flowDesign', data);
}

/**
 * 修改
 * @param data 数据
 * @returns 修改数量
 */
export function update(data: FlowDesign) {
	return request.put(FLOW_API + '/flowDesign', data);
}

/**
 * 根据id删除
 * @param id 字典id
 * @returns 修改数量
 */
export function deleteById(id: number) {
	return request.delete(FLOW_API + '/flowDesign', { data: { id } });
}

/**
 * 详情
 * @param id id必传
 * @returns 返回详情
 */
export function selectById(id: number) {
	return request.get(FLOW_API + '/flowDesign?id=' + id);
}

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post(FLOW_API + '/flowDesign/page', { ...params, searchCount: true });
}
