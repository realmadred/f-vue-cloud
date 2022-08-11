<template>
	<div class="add-FlowDesign-container">
		<el-dialog title="编辑流程图" v-model="isShowDialog" :fullscreen="true">
			<ProsessDesign @bpmn-save="save" :row="ruleForm" destroy-on-close/>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';
import { update, FlowDesign } from '/@/api/flow/flowDesign';
import { submitForm } from '/@/utils/form';
import { rule } from './rule';
import ProsessDesign from "/@/components/prosessDesign/prosessDesignIndex.vue";
export default {
	name: 'editFlowDesign',
	components: { ProsessDesign },
	setup() {
		const form = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				id: 0, // id
				flowId: '', // 流程id
				name: '', // 流程名称
				xml: '', // xml
				svg: '', // svg
			} as FlowDesign,
			rules: rule
		});
		// 打开弹窗
		const openDialog = (row: any) => {
			state.ruleForm = row;
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
		// 保存
		const save = (data: FlowDesign) => {
			console.log('update', data);
			state.ruleForm = Object.assign(state.ruleForm, data)
			update(state.ruleForm).then(() => {
				closeDialog();
			})
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			save,
			submitForm,
			form,
			...toRefs(state),
		};
	},
};
</script>
