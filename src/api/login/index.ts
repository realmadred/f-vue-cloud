import { SYS_API } from '/@/api/constant';
import { notLoadRequest } from '/@/utils/request';

/**
 * 用户登录
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function signIn(params: object) {
	return notLoadRequest({
		url: SYS_API + '/auth/login',
		method: 'post',
		data: params,
	});
}

/**
 * 用户退出登录
 * @returns 无
 */
export function signOut() {
	return notLoadRequest({
		url: SYS_API + '/auth/logout',
		method: 'post'
	});
}


/**
 * 获取aes key
 * @param publickKey 公钥
 * @returns 密钥
 */
export function getKey(publickKey: string) {
	return notLoadRequest.get(SYS_API + '/auth/getKey?key=' + publickKey);
}

