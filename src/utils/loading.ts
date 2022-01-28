import { nextTick } from 'vue';
import { ElLoading } from 'element-plus'

let loading: any;

/**
 * 页面全局 Loading
 * @method setCss 载入 css
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
	// 创建 loading
	start: () => {
		loading = ElLoading.service();
	},
	// 移除 loading
	done: () => {
		nextTick(() => {
			loading.close()
		});
	},
};
