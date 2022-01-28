import request from '/@/utils/request';

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post('/sysLog/page', { ...params, searchCount: true });
}
