<template>
	<div class="system-add-dict-container">
		<el-dialog title="新增字典" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" :rules="rules" ref="form" size="small" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="字典名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入字典名称" maxlength="32" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="字典编码" prop="code">
							<el-input v-model="ruleForm.code" placeholder="请输入字典编码" maxlength="32" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="small">取 消</el-button>
					<el-button type="primary" @click="submitForm(form, onSubmit)" size="small">新 增</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs,ref } from 'vue';
import { add, SysDict } from '/@/api/system/dict';
import { submitForm } from '/@/utils/form';
import { rule } from './dict';
export default {
	name: 'systemAddDict',
	setup() {
		const form = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				name: '', // 字典名称
				code: '', // 字段编码
			} as SysDict,
			rules: rule
		});

		let success: Function;

		// 打开弹窗
		const openDialog = (handler: Function) => {
			state.isShowDialog = true;
			success = handler
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
			add(state.ruleForm).then(() => {
				closeDialog();
				success()
			})
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			form,
			submitForm,
			...toRefs(state),
		};
	},
};
</script>
