import { nextTick } from 'vue';
import { ElLoading } from 'element-plus'

let loading: any;
// 延迟200ms，如果在延迟时间调用完成了，就不加载loading，防止接口太快屏幕一闪
const delay = 200;
let closed = false;

/**
 * 页面全局 Loading
 * @method setCss 载入 css
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
	// 创建 loading
	start: () => {
		if (!loading) {
			// 设置没有关闭
			closed = false
			setTimeout(() => {
				// 指定延迟后还没有调用关闭
				if (!closed) {
					loading = ElLoading.service();
				}
			}, delay)
		}
	},
	// 移除 loading
	done: () => {
		// 表示以及调用关闭了
		closed = true
		if (loading) {
			loading.close()
			loading = null
		}
	},
};
