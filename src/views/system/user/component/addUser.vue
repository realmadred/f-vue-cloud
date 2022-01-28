<template>
	<div class="system-add-user-container">
		<el-dialog title="新增用户" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" :rules="rules" size="small" label-width="90px" ref="form">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入账户名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="ruleForm.email" placeholder="请输入邮箱" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="头像" prop="head">
							<el-input v-model="ruleForm.headImage" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="性别" prop="sex">
							<el-select v-model="ruleForm.sex" placeholder="请选择" clearable class="w100">
								<el-option label="男" :value="1"></el-option>
								<el-option label="女" :value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户密码" prop="password">
							<el-input v-model="ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch
								v-model="ruleForm.status"
								inline-prompt
								active-text="启"
								inactive-text="禁"
								:active-value="1"
								:inactive-value="0"
							></el-switch>
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
import { reactive, toRefs, onMounted, getCurrentInstance, ref } from 'vue';
import { add } from '/@/api/system/user/index';
import { submitForm } from '/@/utils/form';
import { rule } from './rule.ts';
import { encryptMessage } from '/@/utils/aes';

export default {
	name: 'systemAddUser',
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const form = ref()
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				name: '', // 账户名称
				phone: '', // 手机号
				email: '', // 邮箱
				headImage: '', // 头像
				sex: '', // 性别
				status: 1, // 状态
			},
			rules: {
				...rule
			}
		});
		// 打开弹窗
		const openDialog = () => {
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
		const onSubmit = async () => {
			const data = await encryptMessage(JSON.stringify(state.ruleForm))
			await add({ data });
			closeDialog();
			// 刷新列表
			proxy.mittBus.emit('search');
		};
		// 页面加载时
		onMounted(() => { });
		return {
			openDialog,
			closeDialog,
			onCancel,
			form,
			onSubmit,
			submitForm,
			...toRefs(state),
		};
	},
};
</script>
