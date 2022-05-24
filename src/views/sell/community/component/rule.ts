export const rule = {
	name: [
		{
			required: true,
			message: '请输入用户名称',
			trigger: 'change',
		},
	],
	phone: [
		{
			type: 'string',
			min: 11,
			max: 15,
			required: true,
			message: '请输入正确的手机号',
			trigger: 'change',
		},
	],
	email: [
		{
			type: 'email',
			required: true,
			message: '请输入正确的 email',
			trigger: 'change',
		},
	],
};
