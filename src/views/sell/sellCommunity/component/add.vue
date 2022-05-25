<template>
	<div class="add-SellCommunity-container">
		<el-dialog title="新增小区" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" :rules="rules" ref="form" size="small" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="小区名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入小区名称" maxlength="32" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="地址" prop="address">
							<el-input v-model="ruleForm.address" placeholder="请输入地址" maxlength="32" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="户数" prop="houseNumber">
							<el-input-number v-model="ruleForm.houseNumber" placeholder="请输入户数" :min="1" :max="99999"/>
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
import { reactive, toRefs, ref } from 'vue';
import { add, SellCommunity } from '/@/api/sell/sellCommunity';
import { submitForm } from '/@/utils/form';
import { rule } from './rule';
export default {
	name: 'addSellCommunity',
	setup() {
		const form = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				name: '', // 小区名称
				address: '', // 地址
				houseNumber: 0, // 户数
			} as SellCommunity,
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