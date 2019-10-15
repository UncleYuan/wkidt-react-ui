const valid = {
	email: {
		exp: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
		errorMsg: "您输入的email格式不正确"
	},
	phone: {
		exp: /^1(3|4|5|7|8)\d{9}$/,
		errorMsg: "您输入的手机号码格式不正确"
	},
	num: {
		exp: /^[0-9]*$/,
		errorMsg: ""
	}
}

module.exports = valid;