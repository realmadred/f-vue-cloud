<template>
	<div class="add-FlowDesign-container">
		<!-- <el-dialog title="新增流程图" v-model="isShowDialog" width="756px">
			<el-form :model="ruleForm" :rules="rules" ref="form" size="small" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="流程id" prop="flowId">
							<el-input v-model="ruleForm.flowId" placeholder="请输入流程id" maxlength="32" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="流程名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入流程名称" maxlength="32" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="xml" prop="xml">
							<el-input v-model="ruleForm.xml" placeholder="请输入xml" maxlength="32" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="svg" prop="svg">
							<el-input v-model="ruleForm.svg" placeholder="请输入svg" maxlength="32" clearable />
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
		</el-dialog> -->
		<el-dialog title="新增流程图" v-model="isShowDialog" :fullscreen="true">
			<ProsessDesign/>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';
import { add, FlowDesign } from '/@/api/flow/flowDesign';
import { submitForm } from '/@/utils/form';
import { rule } from './rule.ts';
import ProsessDesign from "/@/components/prosessDesign/prosessDesign.vue";
export default {
	name: 'addFlowDesign',
	components: { ProsessDesign },
	setup() {
		const form = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				flowId: '', // 流程id
				name: '', // 流程名称
				xml: '', // xml
				svg: '', // svg
			} as FlowDesign,
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