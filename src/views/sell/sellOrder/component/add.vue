<template>
	<div class="add-SellOrder-container">
		<el-dialog title="新增订单" v-model="isShowDialog" width="756px">
			<el-form :model="ruleForm" :rules="rules" ref="form" size="small" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入名称" maxlength="15" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="小区名称" prop="communityId">
							<el-input v-model="ruleForm.communityId" placeholder="请输入小区id" maxlength="32" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="业主姓名" prop="memberName">
							<el-input v-model="ruleForm.memberName" placeholder="请输入业主姓名" maxlength="15" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="业主电话" prop="memberPhone">
							<el-input v-model="ruleForm.memberPhone" placeholder="请输入业主电话" maxlength="15" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="订单金额" prop="amount">
							<el-input-number class="input-number-len2" :precision="2" v-model="ruleForm.amount" :step="0.01" placeholder="请输入订单金额" :controls="false" :min="0.00" :max="99999999" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="优惠金额" prop="discountAmount">
							<el-input-number class="input-number-len2" :precision="2" v-model="ruleForm.discountAmount" :step="0.01" placeholder="请输入优惠金额" :controls="false" :min="0.00" :max="99999999" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="首付金额" prop="payAmount">
							<el-input-number class="input-number-len2" :precision="2" v-model="ruleForm.payAmount" :step="0.01" placeholder="请输入首付金额" :controls="false" :min="0.00" :max="99999999" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="支付方式" prop="payMethod">
							<el-input v-model="ruleForm.payMethod" placeholder="请选择支付方式" maxlength="32" clearable/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="尾款金额" prop="lastPayAmount">
							<el-input-number  class="input-number-len2" :precision="2" v-model="ruleForm.lastPayAmount" :step="0.01" placeholder="请输入尾款金额" :controls="false" :min="0.00" :max="99999999" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="尾款支付方式" prop="pastPayMethod">
							<el-input v-model="ruleForm.pastPayMethod" placeholder="请选择尾款支付方式" maxlength="32" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="支付时间" prop="payTime">
							<el-date-picker v-model="ruleForm.payTime" type="datetime" placeholder="请输入支付时间" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="尾款支付时间" prop="lastPayTime">
							<el-date-picker v-model="ruleForm.lastPayTime" type="datetime" placeholder="请输入尾款支付时间" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="status">
							<el-input v-model="ruleForm.status"
								placeholder="请输入状态"
								maxlength="32" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="100" clearable></el-input>
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
import { add, SellOrder } from '/@/api/sell/sellOrder';
import { submitForm } from '/@/utils/form';
import { rule } from './rule.ts';
export default {
	name: 'addSellOrder',
	setup() {
		const form = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				name: '', // 名称
				amount: 0, // 订单金额
				payAmount: 0, // 首付金额
				payMethod: 0, // 支付方式
				discountAmount: 0, // 优惠金额
				lastPayAmount: 0, // 尾款金额
				pastPayMethod: 0, // 尾款支付方式
				payTime: '', // 支付时间
				lastPayTime: '', // 尾款支付时间
				status: 0, // 状态
				communityId: 0, // 小区id
				communityName: '', // 小区名称
				memberName: '', // 业主姓名
				memberPhone: '', // 业主电话
				remark: '', // 备注
			} as SellOrder,
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