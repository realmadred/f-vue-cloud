<template>
	<div class="system-edit-role-container">
		<el-dialog title="修改角色" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" :rules="rules" ref="form" size="small" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="角色名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入角色名称" maxlength="15" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="角色描述" prop="description">
							<el-input
								v-model="ruleForm.description"
								type="textarea"
								placeholder="请输入角色描述"
								maxlength="150"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="small">取 消</el-button>
					<el-button type="primary" @click="submitForm(form, onSubmit)" size="small">修 改</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';
import { rule } from './role';
import { submitForm } from '/@/utils/form';
import { update, SysRole} from '/@/api/system/role/index';
export default {
	name: 'systemEditRole',
	setup() {
		const form = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				id: 0, // 角色名称
				name: '', // 角色名称
				description: '', // 角色描述
			} as SysRole,
			rules: rule,
		});

		let success: Function
		// 打开弹窗
		const openDialog = (row: any, fun: Function) => {
			state.ruleForm = row;
			state.isShowDialog = true;
			success = fun
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
			success()
		};
		// 新增
		const onSubmit = () => {
			update(state.ruleForm).then(() => {
				closeDialog();
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
