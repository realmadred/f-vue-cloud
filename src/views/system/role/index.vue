<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-input
					size="small"
					placeholder="请输入角色名称"
					v-model="name"
					style="max-width: 180px"
					@keydown.enter="initTableData"
				></el-input>
				<el-button size="small" type="primary" class="ml10" @click="initTableData">
					<el-icon>
						<elementSearch />
					</el-icon>查询
				</el-button>
				<el-button v-auth="'/sysRole/post'" size="small" type="success" class="ml10" @click="onOpenAddRole">
					<el-icon>
						<elementPlus />
					</el-icon>新增角色
				</el-button>
			</div>
			<el-table stripe :data="tableData.data" style="width: 100%" highlight-current-row>
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="description" label="角色描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button v-auth="'/sysRole/put'" size="small" type="primary" link @click="onOpenEditRole(scope.row)">修改</el-button>
						<el-button v-auth="'/sysRole/put'" size="small" type="primary" link @click="onOpenRoleMenu(scope.row)">菜单</el-button>
						<el-button v-auth="'/sysRole/delete'"
							:disabled="scope.row.name === '超级管理员'"
							size="small"
							type="primary" link
							@click="onRowDel(scope.row)"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="tableData.param.pageNum"
				background
				v-model:page-size="tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableData.total"
			></el-pagination>
		</el-card>
		<AddRole ref="addRoleRef" />
		<EditRole ref="editRoleRef" />
		<RoleMenu ref="roleMenuRef" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { selectPage, deleteById } from "/@/api/system/role/index";
import AddRole from '/@/views/system/role/component/addRole.vue';
import EditRole from '/@/views/system/role/component/editRole.vue';
import RoleMenu from '/@/views/system/role/component/roleMenu.vue';
export default {
	name: 'systemRole',
	components: { AddRole, EditRole, RoleMenu },
	setup() {
		const addRoleRef = ref();
		const editRoleRef = ref();
		const roleMenuRef = ref();
		const state: any = reactive({
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
				},
			},
			name: '',
		});

		// 初始化表格数据
		const initTableData = async () => {
			// 请求接口获取数据
			let json = await selectPage({
				page: state.tableData.param.pageNum,
				size: state.tableData.param.pageSize,
				entity: { name: state.name },
			});
			state.tableData.data = json.data.records;
			state.tableData.total = json.data.total;
		};

		// 打开新增角色弹窗
		const onOpenAddRole = () => {
			addRoleRef.value.openDialog(initTableData);
		};
		// 打开修改角色弹窗
		const onOpenEditRole = (row: object) => {
			editRoleRef.value.openDialog(row, initTableData);
		};
		// 打开修改菜单关联窗口
		const onOpenRoleMenu = (row: object) => {
			roleMenuRef.value.openDialog(row);
		};
		// 删除角色
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.name}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					deleteById(row.id).then(() => {
						ElMessage.success("删除成功");
						initTableData()
					})
				})
				.catch(() => { });
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
			initTableData()
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.pageNum = val;
			initTableData()
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			addRoleRef,
			editRoleRef,
			roleMenuRef,
			onOpenAddRole,
			onOpenEditRole,
			onOpenRoleMenu,
			onRowDel,
			initTableData,
			onHandleSizeChange,
			onHandleCurrentChange,
			...toRefs(state),
		};
	},
};
</script>

<style scoped lang="scss">
.system-role-container {
}
</style>
