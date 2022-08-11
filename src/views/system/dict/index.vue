<template>
	<div class="system-dict-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-input
					v-model="name"
					@keydown.enter="initTableData"
					size="small"
					placeholder="请输入字典名称"
					style="max-width: 180px"
				></el-input>
				<el-button size="small" type="primary" class="ml10" @click="initTableData">
					<el-icon>
						<elementSearch />
					</el-icon>查询
				</el-button>
				<el-button size="small" type="success" class="ml10" @click="onOpenAddDict">
					<el-icon>
						<elementPlus />
					</el-icon>新增字典
				</el-button>
			</div>
			<el-table :data="tableData.data" style="width: 100%">
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="name" label="字典名称" />
				<el-table-column prop="code" label="字典编码" />
				<el-table-column prop="createTime" label="创建时间" />
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" type="primary" link @click="onOpenEditDict(scope.row)">修改</el-button>
						<el-button size="small" type="primary" link @click="onRowDel(scope.row)">删除</el-button>
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
		<AddDict ref="addDictRef" />
		<EditDict ref="editDictRef" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import AddDict from '/@/views/system/dict/component/addDict.vue';
import EditDict from '/@/views/system/dict/component/editDict.vue';
import { selectPage, deleteById } from '/@/api/system/dict';
export default {
	name: 'systemDict',
	components: { AddDict, EditDict },
	setup() {
		const addDictRef = ref();
		const editDictRef = ref();
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
		// 打开新增字典弹窗
		const onOpenAddDict = () => {
			addDictRef.value.openDialog(initTableData);
		};
		// 打开修改字典弹窗
		const onOpenEditDict = (row: Object) => {
			editDictRef.value.openDialog(row);
		};
		// 删除字典
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除字典名称：“${row.name}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					deleteById(row.id).then(() => {
						ElMessage.success('删除成功');
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
			addDictRef,
			editDictRef,
			onOpenAddDict,
			onOpenEditDict,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			initTableData,
			...toRefs(state),
		};
	},
};
</script>

