
export const ruleForm : any = {
	pid: [0], // 上级菜单id
	type: 1, // 菜单类型
	name: '', // 路由名称
	component: '', // 组件路径
	isLink: false, // 是否外链
	sort: 0, // 菜单排序
	path: '', // 路由路径
	redirect: '', // 路由重定向，有子集 children 时
	meta: {
		title: '', // 菜单名称
		icon: '', // 菜单图标
		isKeepAlive: true, // 是否缓存
		isAffix: false, // 是否固定
		isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink:true 2、链接地址不为空`
		isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、链接地址不为空`
	},
	btnPower: '', // 菜单类型为按钮时，权限标识
}
