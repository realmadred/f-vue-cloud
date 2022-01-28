export const rule = {
	name: [
		{
			type: 'string',
			min: 2,
			max: 15,
			required: true,
			message: '请输入名称',
			trigger: 'change',
		},
	],
	description: [
		{
			type: 'string',
			required: true,
			message: '请输入描述',
			trigger: 'change',
		},
	],
};