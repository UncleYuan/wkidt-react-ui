var tools = {
	turnImgSize: function (url, width, height) {
		let urlArr = [];
		try {
			urlArr = url.split('#');
		} catch (e) {
			urlArr = [url];
		}
		let joinStr = urlArr[0].indexOf('?') >= 0 ? "&" : "?";
		return urlArr[0] + joinStr + "imageView2/1/w/" + width + "/h/" + height + "#" + (urlArr[1] || "");
	},
	turnDate: function (oDate, sFomate, bZone) {

		sFomate = sFomate.replace("Y", oDate.getFullYear());
		sFomate = sFomate.replace("y", String(oDate.getFullYear()).substr(2))
		sFomate = sFomate.replace("m", this.toTwoNum(oDate.getMonth() + 1));
		sFomate = sFomate.replace("d", this.toTwoNum(oDate.getDate()));
		sFomate = sFomate.replace("H", this.toTwoNum(oDate.getHours()));
		sFomate = sFomate.replace("i", this.toTwoNum(oDate.getMinutes()));
		sFomate = sFomate.replace("s", this.toTwoNum(oDate.getSeconds()));
		if (bZone) sFomate = sFomate.replace(/\b(\d)\b/g, '0$1');
		return sFomate;
	},
	toTwoNum: function (n) {
		if (n < 10) {
			n = "0" + n;
		}
		return n;
	},
	arrIndexOf: function (arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == val) return i;
		}
		return -1;
	},

	deepCopy: function (source) { //深拷贝方法

		var isArray = source instanceof Array;
		var result = isArray ? [] : {};

		for (var key in source) {

			if (typeof source[key] === 'object' && !(source[key] instanceof Array) && source[key] != null && !source[key].$$typeof) {
				if (isArray) {
					result.push(this.deepCopy(source[key]))
				} else {
					result[key] = this.deepCopy(source[key])
				}
			} else if (typeof source[key] === 'object' && (source[key] instanceof Array)) {
				if (isArray) {
					result.push(this.deepCopy(source[key]))
				} else {
					result[key] = this.deepCopy(source[key])
				}
			} else {
				if (isArray) {
					result.push(source[key])
				} else {
					result[key] = source[key]
				}
			}
		}

		return result;
	},
	deepCopyProps: function (source) { //深拷贝Props方法
		var result = {};
		
		for (var key in source) {
			if (typeof source[key] === 'object' && !(source[key] instanceof Array) && !source[key].$$typeof) {
				result[key] = this.deepCopyProps(source[key])
			} else if (typeof source[key] === 'object' && (source[key] instanceof Array)) {
				result[key] = source[key].slice(0);
			} else {
				result[key] = source[key];
			}


		}

		return result;
	},
	formData: function (data) {
		let dataStr = []
		for (var i in data) {
			dataStr.push(i + "=" + data[i]);
		}

		return encodeURI(dataStr.join('&').replace(/(^\s*)|(\s*$)/g, ""));
	},
	getQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	indexOf: function (arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === val) return i;
		}
		return -1;
	},
	removeArr: function (arr, val) {
		var index = this.indexOf(arr, val);
		if (index > -1) {
			arr.splice(index, 1);
		}
		return arr;
	},

	Equals: function (obj1, obj2) {
		var result = true;

		for (var key in obj1) {

			if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {

				if (!this.Equals(obj1[key], obj2[key])) {
					return false;
				}
			} else if (obj1[key] !== obj2[key]) {
				return false;
			}
		}
		return result;
	},
	cmp: function (x, y) {

		if (x === y) {
			return true;
		}
		if (!(x instanceof Object) || !(y instanceof Object)) {
			return false;
		}

		if (x.constructor !== y.constructor) {
			return false;
		}

		for (var p in x) {
			if (x.hasOwnProperty(p)) {

				if (!y.hasOwnProperty(p)) {
					return false;
				}


				if (x[p] === y[p]) {
					continue;
				}

				if (typeof (x[p]) !== "object") {
					return false;
				}

				if (!Object.equals(x[p], y[p])) {
					return false;
				}
			}
		}

		for (p in y) {
			if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
				return false;
			}
		}
		return true;
	},

	filterObjVal: function (data, val, keyname, getValName) {
		for (let i in data) {
			if (data[i][keyname] == val) {
				if (getValName) {
					return data[i][getValName];
				} else {
					return {
						data: data[i],
						idx: parseInt(i)
					};
				}

			}
		}
		return false;
	},
	supportCss3: function (style) {
		var prefix = ['webkit', 'Moz', 'ms', 'o'],
			i,
			humpString = [],
			htmlStyle = document.documentElement.style,
			_toHumb = function (string) {
				return string.replace(/-(\w)/g, function ($0, $1) {
					return $1.toUpperCase();
				});
			};

		for (i in prefix)
			humpString.push(_toHumb(prefix[i] + '-' + style));

		humpString.push(_toHumb(style));

		for (i in humpString)
			if (humpString[i] in htmlStyle) return true;

		return false;
	},
	objCount: function (data) {
		var x = 0;
		for (var i in data) {
			x++;
		}
		return x;
	},
	serializeObject: function (data) {
		var o = {};
		var a = data;
		$.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	},
	setCookie: function (name, value) {
		//设置名称为name,值为value的Cookie
		var expdate = new Date(); //初始化时间
		expdate.setTime(expdate.getTime() + 30 * 60 * 1000); //时间
		document.cookie = name + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";
		//即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
	},
	getCookie: function (c_name) {
		if (document.cookie.length > 0) {
			var c_start = document.cookie.indexOf(c_name + "=")
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1
				var c_end = document.cookie.indexOf(";", c_start)
				if (c_end == -1) c_end = document.cookie.length
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return ""
	},
	delCookie: function (name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	},
	log: function (...arg) {
		console.log(...arg)
	},
	IE9: (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0"),
	isDefinded: function (a) {
		return typeof a !== "undefined"
	},
	parseParam: function (param, key) {
		var paramStr = "";
		if (typeof param == "string" || typeof param == "number" || typeof param == "boolean") {
			paramStr += "&" + key + "=" + encodeURIComponent(param);
		} else {
			for (let i in param) {
				let k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
				paramStr += '&' + this.parseParam(param[i], k);
			}
		}
		return paramStr.substr(1);
	},
	guid: function () {
		return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	getJSONP: function (url, callback) {
		var jsonpScript = document.createElement("script");
		var guid = 'id' + this.guid();
		var lian = url.indexOf('?') >= 0 ? "&" : "?";
		jsonpScript.type = "text/javascript";
		jsonpScript.src = url + lian + "callback=" + guid;
		window[guid] = callback;
		document.getElementsByTagName("head")[0].appendChild(jsonpScript);
	},
	getDaysInMonth: function (year, month) {
		month = parseInt(month, 10); //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。 
		var temp = new Date(year, month, 0);
		return temp.getDate();
	},
	sendUpdataUser: function () {
		if (window.upDataProperFunc) {
			window.upDataProperFunc();
		} else {
			location.reload();
		}
	}

}
module.exports = tools;