export default {
	noField: '传入的参数不存在',
	bindFieldArgErr: "请在bindField的时候传入name和value",
	noUnbindField: "要卸载的值找不到",
	noFormItem: (type) => {
		return `您所设置的 ${type} 类型的 表单组件未注册或不存在`
	},
	formItemReged: (type) => {
		return `您所设置的 ${type} 类型的 表单组件已经加载注册`
	}
}