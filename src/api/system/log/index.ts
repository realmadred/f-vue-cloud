import { request } from '/@/utils/request';
import { SYS_API } from '/@/api/constant';

/**
 * 列表查询
 * @param params 要传的参数值，非必传
 * @returns 返回接口数据
 */
export function selectPage(params: object) {
	return request.post(SYS_API + '/sysLog/page', { ...params, searchCount: true });
}
