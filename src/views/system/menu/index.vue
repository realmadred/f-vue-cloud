<template>
	<div class="system-menu-container">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
				<el-input size="small" placeholder="请输入菜单名称" v-model="name" style="max-width: 180px"></el-input>
				<el-button
					v-auth="'/sysMenu/post'"
					size="small"
					type="success"
					class="ml10"
					@click="onOpenAddMenu"
				>
					<el-icon>
						<elementFolderAdd />
					</el-icon>新增菜单
				</el-button>
			</div>
			<el-table
				highlight-current-row
				stripe
				:data="menuTableData"
				style="width: 100%"
				row-key="path"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column label="菜单名称" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.meta.icon" />
						<span class="ml10">{{ $t(scope.row.meta.title) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
				<el-table-column label="组件路径" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.component }}</span>
					</template>
				</el-table-column>
				<el-table-column label="权限标识" prop="perms" show-overflow-tooltip />
				<el-table-column prop="sort" label="排序" show-overflow-tooltip width="80" />
				<el-table-column label="类型" show-overflow-tooltip width="80">
					<template #default="scope">
						<el-tag v-if="scope.row.type === 1" type="success" size="small">菜单</el-tag>
						<el-tag v-else size="small">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button
							v-auth="'/sysMenu/post'"
							v-if="scope.row.type === 1"
							size="mini"
							type="text"
							@click="onOpenAddMenu(scope.row)"
						>新增</el-button>
						<el-button
							v-auth="'/sysMenu/put'"
							size="mini"
							type="text"
							@click="onOpenEditMenu(scope.row)"
						>修改</el-button>
						<el-button
							v-auth="'/sysMenu/delete'"
							size="mini"
							type="text"
							@click="onTabelRowDel(scope.row)"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<AddMenu ref="addMenuRef" />
		<EditMenu ref="editMenuRef" />
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, computed, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import AddMenu from '/@/views/system/menu/component/addMenu.vue';
import EditMenu from '/@/views/system/menu/component/editMenu.vue';
import { deleteById, getMenu } from '/@/api/system/menu/index';
import { initBackEndControlRoutes } from "/@/router/backEnd";
import { recursionFilterTree, setMenuTitle } from "/@/utils/common";
export default {
	name: 'systemMenu',
	components: { AddMenu, EditMenu },
	setup() {
		const addMenuRef = ref();
		const editMenuRef = ref();
		const state = reactive({ name: '', data: [] as any[] });

		// 获取 vuex 中的路由
		const menuTableData = computed(() => {
			const name = state.name.trim();
			if (name) {
				return recursionFilterTree(state.data, name)
			}
			return state.data;
		});


		// 打开新增菜单弹窗
		const onOpenAddMenu = (row: object) => {
			addMenuRef.value.openDialog(row, getMenuData);
		};

		// 打开编辑菜单弹窗
		const onOpenEditMenu = (row: object) => {
			editMenuRef.value.openDialog(row, getMenuData);
		};

		// 删除当前行
		const onTabelRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					deleteById(row.id).then(() => {
						getMenuData()
						ElMessage.success('删除成功');
						initBackEndControlRoutes(true)
					})
				})
				.catch(() => { });
		};

		const getMenuData = () => {
			getMenu(null).then((res) => {
				state.data = setMenuTitle(res.data)
			})
		}

		onMounted(() => {
			getMenuData()
		})

		return {
			addMenuRef,
			editMenuRef,
			onOpenAddMenu,
			onOpenEditMenu,
			menuTableData,
			onTabelRowDel,
			...toRefs(state),
		};
	},
};
</script>
