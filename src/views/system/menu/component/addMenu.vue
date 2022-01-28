<template>
	<div class="system-add-menu-container">
		<el-dialog title="新增菜单" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" size="small" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级菜单">
							<el-cascader
								:options="menuData"
								:props="{ checkStrictly: true, value: 'id', label: 'title' }"
								placeholder="请选择上级菜单"
								clearable
								class="w100"
								v-model="ruleForm.pid"
							>
								<template #default="{ node, data }">
									<span>{{ data.title }}</span>
									<span v-if="!node.isLeaf">({{ data.children.length }})</span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单类型">
							<el-radio-group v-model="ruleForm.type">
								<el-radio :label="1">菜单</el-radio>
								<el-radio :label="2">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单名称">
							<el-input v-model="ruleForm.meta.title" placeholder="格式：message.router.xxx" clearable></el-input>
						</el-form-item>
					</el-col>
					<template v-if="ruleForm.type === 1">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由名称">
								<el-input v-model="ruleForm.name" placeholder="路由中的 name 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由路径">
								<el-input v-model="ruleForm.path" @change="pathChange" placeholder="路由中的 path 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="重定向">
								<el-input v-model="ruleForm.redirect" placeholder="请输入路由重定向" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="菜单图标">
								<IconSelector placeholder="请输入菜单图标" v-model="ruleForm.meta.icon" type="all" />
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="组件路径">
								<el-input v-model="ruleForm.component" placeholder="组件路径" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<template v-if="ruleForm.type === 2">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识">
								<el-input v-model="ruleForm.btnPower" placeholder="请输入权限标识" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单排序">
							<el-input-number
								v-model="ruleForm.sort"
								controls-position="right"
								placeholder="请输入排序"
								class="w100"
							/>
						</el-form-item>
					</el-col>
					<template v-if="ruleForm.type === 1">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="页面缓存">
								<el-radio-group v-model="ruleForm.meta.isKeepAlive">
									<el-radio :label="true">缓存</el-radio>
									<el-radio :label="false">不缓存</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否固定">
								<el-radio-group v-model="ruleForm.meta.isAffix">
									<el-radio :label="true">固定</el-radio>
									<el-radio :label="false">不固定</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否内嵌">
								<el-radio-group v-model="ruleForm.meta.isIframe" @change="onSelectIframeChange">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否外链">
								<el-radio-group v-model="ruleForm.isLink" :disabled="ruleForm.meta.isIframe">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="链接地址">
								<el-input
									v-model="ruleForm.meta.isLink"
									placeholder="外链/内嵌时链接地址（http:xxx.com）"
									clearable
									:disabled="ruleForm.isLink === '' || !ruleForm.isLink"
								></el-input>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="small">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="small">新 增</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useStore } from '/@/store/index';
import IconSelector from '/@/components/iconSelector/index.vue';
import { add } from '/@/api/system/menu';
import { booleanToInt, setMenuTitle } from '/@/utils/common';
import { initBackEndControlRoutes } from "/@/router/backEnd";
import { ruleForm } from "./menu";
export default {
	name: 'systemAddMenu',
	components: { IconSelector },
	setup() {
		const store = useStore();
		const state = reactive({
			isShowDialog: false,
			// 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
			ruleForm: ruleForm,
			menuData: [] as any[], // 上级菜单数据
		});
		let refresh: Function;
		// 打开弹窗
		const openDialog = (row: any, handler: Function) => {
			if (row) {
				state.ruleForm.pid = row.id
				if ((row.level | 0) > 1) {
					state.ruleForm.type = 2
				} else {
					state.ruleForm.type = 1
				}
			}
			state.isShowDialog = true;
			refresh = handler
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 是否内嵌下拉改变
		const onSelectIframeChange = () => {
			if (state.ruleForm.meta.isIframe) {
				state.ruleForm.isLink = true;
			} else {
				state.ruleForm.isLink = false;
			}
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 路径改变事件
		const pathChange = () => {
			state.ruleForm.component = state.ruleForm.path + '/index'
		};
		// 新增
		const onSubmit = () => {
			const formData = state.ruleForm;
			let pid = formData.pid
			add({
				"pid": Array.isArray(pid) ? pid[pid.length - 1] : pid,
				"name": formData.name,
				"title": formData.meta.title,
				"url": formData.path,
				"component": formData.component,
				"isFrame": booleanToInt(formData.meta.isIframe),
				"link": formData.meta.isLink,
				"isKeepAlive": booleanToInt(formData.meta.isKeepAlive),
				"isAffix": booleanToInt(formData.meta.isAffix),
				"perms": formData.btnPower,
				"icon": formData.meta.icon,
				"type": formData.type,
				"sort": formData.sort,
				"status": 1
			}).then(() => {
				closeDialog(); // 关闭弹窗
				if (formData.type === 1) {
					// 是菜单才刷新
					initBackEndControlRoutes(true) // 刷新菜单，未进行后端接口测试
				}
				// 重新获取菜单数据
				refresh()
			});
		};
		// 页面加载时
		onMounted(() => {
			state.menuData = setMenuTitle(store.state.routesList.routesList);
		});
		return {
			openDialog,
			closeDialog,
			onSelectIframeChange,
			onCancel,
			onSubmit,
			pathChange,
			...toRefs(state),
		};
	},
};
</script>
