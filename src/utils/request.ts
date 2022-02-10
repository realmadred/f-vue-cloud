import axios from 'axios';
import { ElMessage } from 'element-plus';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (!config.headers) {
			config.headers = {}
		}
		if (Session.get('token')) {
			config.headers.token = Session.get('token')
		}
		NextLoading.start()
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		NextLoading.done()
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		NextLoading.done()
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code == 200) {
			return response.data;
		} else {
			if (response.config.url === '/auth/login') {
				ElMessage.warning('登录失败');
			} else if (res.code === 401 || res.code === 604) {
				// `token` 过期或者账号已在别处登录
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
			} else {
				// 提示信息
				ElMessage.warning(res.msg as string | 'warning');
			}
			return Promise.reject(res);
		}
	},
	(error) => {
		NextLoading.done()
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.warning(error.response.data.error);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
