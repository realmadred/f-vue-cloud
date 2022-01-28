<template>
	<div class="system-log-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-select size="small" placeholder="选中日志类型" v-model="type" style="max-width: 180px" @change="initTableData">
					<el-option
					v-for="item in logType"
					:key="item.id"
					:label="item.name"
					:value="item.value"
					>
					</el-option>
				</el-select>
				<el-button size="small" type="primary" class="ml10" @click="initTableData">
					<el-icon>
						<elementSearch />
					</el-icon>查询
				</el-button>
			</div>
			<el-table border stripe :data="tableData.data" style="width: 100%" highlight-current-row>
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="type" label="类型" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ getDictName(logType, scope.row.type + '') }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="className" label="类名" show-overflow-tooltip />
				<el-table-column prop="methodName" label="方法名" show-overflow-tooltip />
				<el-table-column prop="requestUri" label="请求路径" show-overflow-tooltip />
				<el-table-column prop="params" label="参数" show-overflow-tooltip />
				<el-table-column prop="requestIp" label="请求ip" show-overflow-tooltip />
				<el-table-column prop="errorDetail" label="错误信息" show-overflow-tooltip />
				<el-table-column prop="createName" label="创建人" show-overflow-tooltip />
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />>
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
				layout="sizes, prev, pager, next"
				:total="tableData.total"
			></el-pagination>
		</el-card>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted } from 'vue';
import { selectPage } from "/@/api/system/log/index";
import { detailByCode, SysDictDetail } from "/@/api/system/dict";
import { getDictName } from "/@/utils/common";
export default {
	name: 'systemlog',
	setup() {
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
			logType: [] as SysDictDetail[],
			type: '1',
		});

		// 初始化表格数据
		const initTableData = async () => {
			// 请求接口获取数据
			let json = await selectPage({
				page: state.tableData.param.pageNum,
				size: state.tableData.param.pageSize,
				entity: { type: state.type },
				orders: [{ column: 'id', asc: false }],
			});
			state.tableData.data = json.data.records;
			state.tableData.total = json.data.total;
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
			detailByCode('log_type').then(res => {
				state.logType = res.data
			})
		});
		return {
			initTableData,
			onHandleSizeChange,
			onHandleCurrentChange,
			getDictName,
			...toRefs(state),
		};
	},
};
</script>
