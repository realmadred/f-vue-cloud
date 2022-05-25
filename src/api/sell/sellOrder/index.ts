import { request } from '/@/utils/request';
import { SELL_API } from '/@/api/constant';


export interface SellOrder {
	name: String, // 名称
	amount: number, // 订单金额
	payAmount: number, // 首付金额
	payMethod: number, // 支付方式
	discountAmount: number, // 优惠金额
	lastPayAmount: number, // 尾款金额
	pastPayMethod: number, // 尾款支付方式
	payTime: string, // 支付时间
	lastPayTime: string, // 尾款支付时间
	status: number, // 状态;0-创建、1-支付定金、2-已量房、3-设计中、4-已复尺、5-设计确认、6-下单、7-安装、8-安装完成、9-完成
	communityId: number, // 小区id
	communityName: String, // 小区名称
	memberName: String, // 业主姓名
	memberPhone: String, // 业主电话
	remark: String, // 备注
}

/**
 * 添加
 * @param data 数据
 * @returns 实体
 */
export function add(data: SellOrder) {
	return request.post(SELL_API + '/sellOrder', data);
}

/**
 * 修改
 * @param data 数据
 * @returns 修改数量
 */
export function update(data: SellOrder) {
	return request.put(SELL_API + '/sellOrder', data);
}

/**
 * 根据id删除
 * @param id 字典id
 * @returns 修改数量
 */
export function deleteById(id: number) {
	return request.delete(SELL_API + '/sellOrder', { data: { id } });
}

/**
 * 详情
 * @param id id必传
 * @returns 返回详情
 */
export function selectById(id: number) {
	return request.get(SELL_API + '/sellOrder?id=' + id);
}

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post(SELL_API + '/sellOrder/page', { ...params, searchCount: true });
}
