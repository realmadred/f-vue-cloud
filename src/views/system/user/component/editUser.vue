<template>
	<div class="system-edit-user-container">
		<el-dialog title="修改用户" v-model="isShowDialog" width="769px">
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
						<el-form-item label="密码错误" show-overflow-tooltip>
							<el-input-number style="width: 222px" :min="0" v-model="ruleForm.passwordErrorNum"></el-input-number>次数
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
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="头像" prop="head">
							<div @click="onCropperDialogOpen">
								<el-avatar :size="80" :src="getSrc(ruleForm.headImage)"></el-avatar>
							</div>
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
			<CropperDialog ref="cropperDialogRef" title="修改头像" @on-croppe="onCroppe" />
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, ref } from 'vue';
import { update, SysUser } from '/@/api/system/user/index';
import { rule } from './rule.ts';
import { submitForm } from '/@/utils/form';
import { encrypt } from '/@/utils/aes';
import { getSrc } from '/@/utils/common';
import CropperDialog from '/@/components/cropper/index.vue';
export default {
	name: 'systemEditUser',
	components: { CropperDialog },
	setup() {
		const form = ref()
		const cropperDialogRef = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				id: 0, // id
				name: '', // 账户名称
				phone: '', // 手机号
				email: '', // 邮箱
				headImage: '', // 头像
				sex: 1, // 性别
				passwordErrorNum: 0, // 密码错误次数
				status: 1, // 状态
			} as SysUser,
			rules: {
				...rule
			}
		});
		// 打开弹窗
		const openDialog = (row: SysUser) => {
			state.ruleForm = row
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
			const data = await encrypt(JSON.stringify(state.ruleForm))
			await update({ data })
			closeDialog()
		};

		// 打开裁剪弹窗
		const onCropperDialogOpen = () => {
			cropperDialogRef.value.openDialog(getSrc(state.ruleForm.headImage));
		};

		// 打开裁剪弹窗
		const onCroppe = (image: string) => {
			state.ruleForm.headImage = image
		};

		// 初始化部门数据
		const initTableData = () => {
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			submitForm,
			cropperDialogRef,
			onCropperDialogOpen,
			form,
			onCroppe,
			getSrc,
			...toRefs(state),
		};
	},
};
</script>

