<template>
	<div class="system-role-menu-container">
		<el-dialog :title="name + '的菜单'" v-model="isShowDialog" width="769px">
			<el-row :gutter="35">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-tree
						:data="menuData"
						:props="menuProps"
						@check="handleCheckChange"
						node-key="id"
						ref="tree"
						show-checkbox
						class="menu-data-tree"
					/>
				</el-col>
			</el-row>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog" size="small">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';
import { setMenuTitle, recursionLastLevelIds } from '/@/utils/common';
import type { ElTree } from 'element-plus'
import { menuByRoleId, bind, unBind } from '/@/api/system/role/index';
import { getMenu } from '/@/api/system/menu/index';
import Node from 'element-plus/es/components/tree/src/model/node';
export default {
	name: 'systemRoleMenu',
	setup() {
		const tree = ref<InstanceType<typeof ElTree>>()

		const disabledTree = (data: any, _: Node) => {
			// return data.name === 'systemMenu' || data.name === 'systemUser' || data.name === 'systemRole' || data.name === 'system'
			return false
		}

		const state = reactive({
			isShowDialog: false,
			name: '',
			menuProps: {
				children: 'children',
				label: 'title',
				disabled: disabledTree
			}
		});


		let roleId: number;
		// 上次的数据
		let ids: number[] = []
		let lastIds: number[]
		const menuData: any[] = []
		getMenu(null).then((res) => {
			menuData.push(...setMenuTitle(res.data))
			lastIds = recursionLastLevelIds(res.data)
		})

		// 打开弹窗
		const openDialog = (row: any) => {
			state.isShowDialog = true;
			state.name = row.name;
			roleId = row.id
			menuByRoleId(row.id).then(res => {
				ids = res.data;
				tree.value!.setCheckedKeys(ids.filter(id => lastIds.includes(id)), false)
			})
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};

		const handleCheckChange = (current: any, checked: any) => {
			const currentIds: number[] = []
			currentIds.push(...checked.checkedKeys)
			currentIds.push(...checked.halfCheckedKeys)
			if (checked.checkedKeys.includes(current.id)) {
				bind({ roleId: roleId, menuIds: currentIds.filter(id => !ids.includes(id)) })
			} else {
				unBind({ roleId: roleId, menuIds: ids.filter(id => !currentIds.includes(id)) })
			}
			ids = currentIds;
		}

		return {
			openDialog,
			closeDialog,
			menuData,
			tree,
			handleCheckChange,
			...toRefs(state),
		};
	},
};
</script>

<style scoped lang="scss">
.system-edit-role-container {
	.menu-data-tree {
		border: var(--el-input-border, var(--el-border-base));
		border-radius: var(
			--el-input-border-radius,
			var(--el-border-radius-base)
		);
		padding: 5px;
	}
}
</style>
