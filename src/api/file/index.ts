import axios from 'axios';
import { FILE_API, FILE_BUCKET, FILE_EXPIRY } from '/@/api/constant';
import request from '/@/utils/request';

// 配置新建一个 axios 实例
const fileRequest = axios.create({
	timeout: 15000,
	headers: { 'Content-Type': 'application/octet-stream' },
});

export interface MyFile {
	file: File, // 文件
}

/**
 * 预上传请求路径
 * @param suffix 文件后缀
 * @returns 返回预请求路径
 */
export function getPreSignedPutObjectUrl(suffix: string) {
	return request.get(FILE_API + '/getPreSignedPutObjectUrl', {
		params: {
			"expiry": FILE_EXPIRY,
			"suffix": suffix,
			"bucket": FILE_BUCKET
		}
	});
}

/**
 * 用户退出登录
 * @param file 文件
 * @param url 上传路径
 * @returns 路径
 */
export function uploadFileByUrl(file: File, url: string) {
	return fileRequest.put(url, file)
}
