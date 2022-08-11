<template>
	<div class="system-edit-dict-container">
		<el-dialog title="修改字典" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" :rules="rules" ref="form" size="small" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="字典名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入字典名称" maxlength="32" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="字典编码" prop="code">
							<el-input v-model="ruleForm.code" placeholder="请输入字典编码" maxlength="32" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-row v-for="(v, k) in ruleForm.list" :key="k">
							<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb10">
								<el-form-item :prop="`list[${k}].name`" :rules="{required: true,message: '请输入名称',trigger: 'change'}">
									<template #label>
										<el-button type="primary" circle size="small" @click="onAddRow" v-if="k === 0">
											<el-icon>
												<elementPlus />
											</el-icon>
										</el-button>
										<el-button type="danger" circle size="small" @click="onDelRow(k)" v-else>
											<el-icon>
												<elementDelete />
											</el-icon>
										</el-button>
										<span class="ml10">名称</span>
									</template>
									<el-input v-model="v.name" maxlength="15" style="width: 100%" placeholder="请输入名称"></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb10">
								<el-form-item label="值" :prop="`list[${k}].value`" :rules="{required: true,message: '请输入值',trigger: 'change'}">
									<el-input v-model="v.value" maxlength="15" style="width: 100%" placeholder="请输入值"></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb10">
								<el-form-item label="排序" :prop="`list[${k}].sort`">
									<el-input-number v-model="v.sort" :min="1" :max="999" style="width: 100%" placeholder="排序"></el-input-number>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
	<span class="dialog-footer">
		<el-button @click="onCancel" size="small">取 消</el-button>
		<el-button type="primary" @click="submitForm(form, onSubmit)" size="small">保 存</el-button>
	</span>
</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';
import { save, SysDictSave, SysDictDetail, detailByDictId } from '/@/api/system/dict';
import { submitForm } from '/@/utils/form';
import { rule } from './dict';
export default {
	name: 'systemEditDict',
	setup() {
		const form = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				name: '', // 字典名称
				code: '', // 字段名
				list: [
					// 子集字段 + 属性值
					{
						id: 0,
						name: '',
						value: '',
						sort: 1,
					},
				]
			} as SysDictSave,
			rules: rule
		});
		// 打开弹窗
		const openDialog = (row: any) => {
			state.ruleForm = row;
			// 查询下级
			detailByDictId(row.id).then((res) => {
				if (res.data && res.data.length) {
					state.ruleForm.list = res.data
				} else {
					state.ruleForm.list = [
						// 子集字段 + 属性值
						{
							id: 0,
							name: '',
							value: '',
							sort: 1,
						} as SysDictDetail,
					]
				}
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
		// 新增
		const onSubmit = () => {
			save(state.ruleForm).then(() => {
				closeDialog();
			})
		};

		// 新增行
		const onAddRow = () => {
			state.ruleForm.list.push({
				id: 0,
				name: '',
				value: '',
				sort: 1,
			} as SysDictDetail);
		};

		// 删除行
		const onDelRow = (row: any) => {
			state.ruleForm.list.splice(row, 1);
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			onAddRow,
			onDelRow,
			submitForm,
			form,
			...toRefs(state),
		};
	},
};
</script>
