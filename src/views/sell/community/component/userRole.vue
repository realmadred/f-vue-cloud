<template>
	<div class="system-user-role-container">
		<el-dialog :title="name + '的角色:'" v-model="isShowDialog" width="769px">
			<el-row :gutter="35">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-transfer
						v-model="rolesIds"
						filterable
						:titles="['待选', '已选']"
						:button-texts="['移除', '选择']"
						:props="{
							key: 'id',
							label: 'name',
						}"
						:data="options"
						@change="handleChange"
					></el-transfer>
				</el-col>
			</el-row>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="small">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { roleByUserId, bind, unBind } from '/@/api/system/user/index';
import { selectAll } from '/@/api/system/role/index';
export default {
	name: 'systemUserRole',
	setup() {
		const state = reactive({
			isShowDialog: false,
			id: 0, // 用户id
			name: '', // 用户名称
			options: [], // 下来框数据
			rolesIds: [] as number[], // 用户角色id数组
		});
		// 打开弹窗
		const openDialog = (row: any) => {
			state.id = row.id
			state.name = row.name
			// 根据用户id查询角色
			roleByUserId(row.id).then((res) => {
				state.rolesIds = res.data
			})

			state.isShowDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};

		// 选择改变事件
		const handleChange = (value: number[],
			direction: 'left' | 'right',
			movedKeys: number[]) => {
			if (direction === 'left') {
				unBind({ userId: state.id, roleIds: movedKeys })
			} else {
				bind({ userId: state.id, roleIds: movedKeys })
			}
		};

		// 页面加载时
		onMounted(() => {
			// 获取所有角色
			selectAll().then((res) => {
				state.options = res.data
			})
		});
		return {
			openDialog,
			closeDialog,
			onCancel,
			handleChange,
			...toRefs(state),
		};
	},
};
</script>
