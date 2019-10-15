webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(158);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _Loading = __webpack_require__(159);
	
	var _Loading2 = _interopRequireDefault(_Loading);
	
	var _Form = __webpack_require__(160);
	
	var _Form2 = _interopRequireDefault(_Form);
	
	var _FormCtrl = __webpack_require__(164);
	
	var _FormCtrl2 = _interopRequireDefault(_FormCtrl);
	
	var _Input = __webpack_require__(168);
	
	var _Input2 = _interopRequireDefault(_Input);
	
	var _InputGroup = __webpack_require__(169);
	
	var _InputGroup2 = _interopRequireDefault(_InputGroup);
	
	var _Process = __webpack_require__(170);
	
	var _Process2 = _interopRequireDefault(_Process);
	
	var _Toast = __webpack_require__(171);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	var _public_tools = __webpack_require__(161);
	
	var _public_tools2 = _interopRequireDefault(_public_tools);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Login = function (_Component) {
	  _inherits(Login, _Component);
	
	  function Login(props) {
	    _classCallCheck(this, Login);
	
	    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));
	
	    _this.getCodeImgSrc = function () {
	      return "/system/test.do?width=100&height=31&font_size=20&code_time=" + new Date().valueOf();
	    };
	
	    _this.resetCodeImgSrc = function () {
	      _this.setState({ codeImgSrc: _this.getCodeImgSrc() });
	    };
	
	    _this.getForm = function (data) {
	      _Process2["default"].show();
	      fetch('/auth.do', {
	        method: "post",
	        credentials: 'same-origin',
	        headers: {
	          "Content-Type": "application/x-www-form-urlencoded"
	        },
	        body: _public_tools2["default"].parseParam(data)
	      }).then(function (response) {
	        return response.json();
	      }).then(function (res) {
	        _Process2["default"].Close();
	        _Toast2["default"].show({ msg: res.info });
	        if (res.code == "SUCCESS") {
	          location.href = "/";
	        } else {
	          _this.resetCodeImgSrc();
	        }
	      });
	    };
	
	    _this.displayName = 'Form';
	    _this.state = {
	      codeImgSrc: _this.getCodeImgSrc()
	    };
	    _this.pointer = {};
	    return _this;
	  }
	
	  _createClass(Login, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state = this.state,
	          loading = _state.loading,
	          codeImgSrc = _state.codeImgSrc;
	
	      return _react2["default"].createElement(
	        'div',
	        { className: 'Card-box' },
	        _react2["default"].createElement(
	          _Form2["default"],
	          { formStyle: 'ver', onSubForm: this.getForm },
	          _react2["default"].createElement(_FormCtrl2["default"], { name: 'username', required: true, type: 'text', placeholder: '\u8BF7\u5728\u8FD9\u91CC\u8F93\u5165\u60A8\u7684\u8D26\u53F7' }),
	          _react2["default"].createElement(_FormCtrl2["default"], { name: 'password', required: true, type: 'password', placeholder: '\u8BF7\u5728\u8FD9\u91CC\u8F93\u5165\u60A8\u7684\u5BC6\u7801' }),
	          _react2["default"].createElement(_FormCtrl2["default"], { name: 'test_code', required: true, type: 'input-group', placeholder: '\u8BF7\u5728\u8FD9\u91CC\u8F93\u5165\u53F3\u8FB9\u9A8C\u8BC1\u7801', barHtml: _react2["default"].createElement('img', { className: 'code-img vm', onClick: this.resetCodeImgSrc, src: codeImgSrc }) })
	        )
	      );
	    }
	  }]);
	
	  return Login;
	}(_react.Component);
	
	_reactDom2["default"].render(_react2["default"].createElement(Login, null), document.getElementById('wrap'));

/***/ },

/***/ 160:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _public_tools = __webpack_require__(161);
	
	var _public_tools2 = _interopRequireDefault(_public_tools);
	
	var _lang = __webpack_require__(162);
	
	var _FormCtrl = __webpack_require__(164);
	
	var _FormCtrl2 = _interopRequireDefault(_FormCtrl);
	
	var _FormSub = __webpack_require__(167);
	
	var _FormSub2 = _interopRequireDefault(_FormSub);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Form = function (_Component) {
	  _inherits(Form, _Component);
	
	  function Form(props) {
	    _classCallCheck(this, Form);
	
	    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));
	
	    _initialiseProps.call(_this);
	
	    _this.state = {
	      data: props.data || {},
	      validate: {}
	    };
	    _this.haveFormSub = false;
	    return _this;
	  }
	
	  _createClass(Form, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (_typeof(nextProps.data) == "object" && JSON.stringify(nextProps.data) != JSON.stringify(this.state.data)) {
	        this.setState({ data: nextProps.data });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          children = _props.children,
	          formStyle = _props.formStyle,
	          className = _props.className,
	          formRendData = _props.formRendData,
	          disabled = _props.disabled,
	          rendForm = _props.rendForm;
	
	
	      return _react2["default"].createElement(
	        'div',
	        { className: 'form-wrap-box ' },
	        (0, _react.createElement)(rendForm ? 'form' : "div", { className: "form " + ("form-" + formStyle) + " " + className }, this.renderChildren(_react.Children.toArray(children)), formRendData ? this.rendFormItemByData(formRendData) : "", !this.haveFormSub ? (0, _react.createElement)(_FormSub2["default"], { disabled: disabled, onClick: this.formSubFunc }) : "")
	      );
	    }
	  }]);
	
	  return Form;
	}(_react.Component);
	
	Form.defaultProps = {
	  data: false,
	  className: '',
	  formRendData: false,
	  rendForm: true,
	  formStyle: "",
	  onSubForm: function onSubForm() {},
	  disabled: false
	};
	
	var _initialiseProps = function _initialiseProps() {
	  var _this2 = this;
	
	  this.setValidate = function (field, value) {
	    var validate = _this2.state.validate;
	
	
	    if (_public_tools2["default"].isDefinded(field) && _public_tools2["default"].isDefinded(value)) {
	      if (value.length > 0) {
	        validate[field] = value;
	      } else if (validate[field]) {
	        delete validate[field];
	      }
	      _this2.setState({ validate: validate });
	    }
	  };
	
	  this.getFieldValue = function () {
	    var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	    var data = _this2.state.data;
	
	    if (typeof field === "string") {
	      if (data[field]) {
	        return data[field];
	      } else {
	        _public_tools2["default"].log('lang.form.noField');
	      }
	    } else {
	      return data;
	    }
	  };
	
	  this.setFieldValue = function (field, value) {
	    var data = _this2.state.data;
	
	    if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === "object") {
	      _this2.setState({ data: field });
	      return;
	    }
	    if (_public_tools2["default"].isDefinded(field) && _public_tools2["default"].isDefinded(value)) {
	      data[field] = value;
	      _this2.setState({ data: data });
	    } else {
	      _public_tools2["default"].log('lang.form.noField');
	    }
	  };
	
	  this.bindField = function (name, value) {
	
	    if (_public_tools2["default"].isDefinded(name) && _public_tools2["default"].isDefinded(value)) {
	      var data = _this2.state.data;
	
	      if (data[name] != value) {
	        data[name] = value;
	
	        _this2.setState({ data: data });
	      }
	    } else {
	      _public_tools2["default"].log('lang.form.bindFieldArgErr');
	    }
	  };
	
	  this.unbindField = function (name) {
	    var data = _this2.state.data;
	
	    if (typeof data[name] !== "undefined") {
	      delete data[name];
	      _this2.setState(data);
	    } else {
	      _public_tools2["default"].log('lang.form.noUnbindField');
	    }
	  };
	
	  this.renderChildren = function (children) {
	    var data = _this2.state.data;
	    var disabled = _this2.props.disabled;
	
	    return _react.Children.map(children, function (child) {
	      if (!child) {
	        return null;
	      }
	      if (typeof child === 'string') {
	        return child;
	      }
	      var readOnly = child.props.readOnly;
	
	      var props = {
	        readOnly: readOnly || disabled
	      };
	
	      if (child.type === _FormSub2["default"]) {
	        props.disabled = disabled;
	        props.onClick = _this2.formSubFunc;
	        _this2.haveFormSub = true;
	      } else if (child.type === _FormCtrl2["default"]) {
	        props.transmitForm = {
	          formData: data,
	          setValidate: _this2.setValidate,
	          getFieldValue: _this2.getFieldValue,
	          setFieldValue: _this2.setFieldValue,
	          bindField: _this2.bindField,
	          unbindField: _this2.unbindField
	        };
	      } else if (child.props.children) {
	        props.children = _this2.renderChildren(child.props.children);
	      }
	
	      return (0, _react.cloneElement)(child, props);
	    });
	  };
	
	  this.rendFormItemByData = function (formData) {
	    var formCtrlArr = [];
	    formData.forEach(function (obj, idx) {
	      var transmitForm = {
	        formData: _this2.state.data,
	        setValidate: _this2.setValidate,
	        getFieldValue: _this2.getFieldValue,
	        setFieldValue: _this2.setFieldValue,
	        bindField: _this2.bindField,
	        unbindField: _this2.unbindField
	      };
	      formCtrlArr.push(_react2["default"].createElement(_FormCtrl2["default"], _extends({ transmitForm: transmitForm, key: idx }, obj)));
	    });
	    return formCtrlArr;
	  };
	
	  this.formSubFunc = function () {
	    var onSubForm = _this2.props.onSubForm;
	    var data = _this2.state.data;
	
	
	    onSubForm(_public_tools2["default"].deepCopy(data));
	  };
	};
	
	exports["default"] = Form;

/***/ },

/***/ 161:
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var tools = {
		turnDate: function turnDate(oDate, sFomate, bZone) {
	
			sFomate = sFomate.replace("Y", oDate.getFullYear());
			sFomate = sFomate.replace("y", String(oDate.getFullYear()).substr(2));
			sFomate = sFomate.replace("m", this.toTwoNum(oDate.getMonth() + 1));
			sFomate = sFomate.replace("d", this.toTwoNum(oDate.getDate()));
			sFomate = sFomate.replace("H", this.toTwoNum(oDate.getHours()));
			sFomate = sFomate.replace("i", this.toTwoNum(oDate.getMinutes()));
			sFomate = sFomate.replace("s", this.toTwoNum(oDate.getSeconds()));
			if (bZone) sFomate = sFomate.replace(/\b(\d)\b/g, '0$1');
			return sFomate;
		},
		toTwoNum: function toTwoNum(n) {
			if (n < 10) {
				n = "0" + n;
			}
			return n;
		},
		arrIndexOf: function arrIndexOf(arr, val) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == val) return i;
			}
			return -1;
		},
	
		deepCopy: function deepCopy(source) {
			//深拷贝方法
	
			var isArray = source instanceof Array;
			var result = isArray ? [] : {};
			for (var key in source) {
				if (_typeof(source[key]) === 'object' && !(source[key] instanceof Array) && !source[key].$$typeof) {
					if (isArray) {
						result.push(this.deepCopy(source[key]));
					} else {
						result[key] = this.deepCopy(source[key]);
					}
				} else if (_typeof(source[key]) === 'object' && source[key] instanceof Array) {
					if (isArray) {
						result.push(this.deepCopy(source[key]));
					} else {
						result[key] = this.deepCopy(source[key]);
					}
				} else {
					if (isArray) {
						result.push(source[key]);
					} else {
						result[key] = source[key];
					}
				}
			}
	
			return result;
		},
		deepCopyProps: function deepCopyProps(source) {
			//深拷贝Props方法
			var result = {};
			for (var key in source) {
				if (_typeof(source[key]) === 'object' && !(source[key] instanceof Array) && !source[key].$$typeof) {
					result[key] = this.deepCopyProps(source[key]);
				} else if (_typeof(source[key]) === 'object' && source[key] instanceof Array) {
					result[key] = source[key].slice(0);
				} else {
					result[key] = source[key];
				}
			}
	
			return result;
		},
		formData: function formData(data) {
			var dataStr = [];
			for (var i in data) {
				dataStr.push(i + "=" + data[i]);
			}
	
			return encodeURI(dataStr.join('&').replace(/(^\s*)|(\s*$)/g, ""));
		},
		getQueryString: function getQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		indexOf: function indexOf(arr, val) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === val) return i;
			}
			return -1;
		},
		removeArr: function removeArr(arr, val) {
			var index = this.indexOf(arr, val);
			if (index > -1) {
				arr.splice(index, 1);
			}
			return arr;
		},
	
		Equals: function Equals(obj1, obj2) {
			var result = true;
	
			for (var key in obj1) {
	
				if (_typeof(obj1[key]) === 'object' && _typeof(obj2[key]) === 'object') {
	
					if (!this.Equals(obj1[key], obj2[key])) {
						return false;
					}
				} else if (obj1[key] !== obj2[key]) {
					return false;
				}
			}
			return result;
		},
		cmp: function cmp(x, y) {
	
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
	
					if (_typeof(x[p]) !== "object") {
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
	
		filterObjVal: function filterObjVal(data, val, keyname, getValName) {
			for (var i in data) {
				if (data[i][keyname] == val) {
					if (getValName) {
						return data[i][getValName];
					} else {
						return {
							data: data[i],
							idx: i
						};
					}
				}
			}
			return false;
		},
		supportCss3: function supportCss3(style) {
			var prefix = ['webkit', 'Moz', 'ms', 'o'],
			    i,
			    humpString = [],
			    htmlStyle = document.documentElement.style,
			    _toHumb = function _toHumb(string) {
				return string.replace(/-(\w)/g, function ($0, $1) {
					return $1.toUpperCase();
				});
			};
	
			for (i in prefix) {
				humpString.push(_toHumb(prefix[i] + '-' + style));
			}humpString.push(_toHumb(style));
	
			for (i in humpString) {
				if (humpString[i] in htmlStyle) return true;
			}return false;
		},
		objCount: function objCount(data) {
			var x = 0;
			for (var i in data) {
				x++;
			}
			return x;
		},
		serializeObject: function serializeObject(data) {
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
		setCookie: function setCookie(name, value) {
			//设置名称为name,值为value的Cookie
			var expdate = new Date(); //初始化时间
			expdate.setTime(expdate.getTime() + 30 * 60 * 1000); //时间
			document.cookie = name + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";
			//即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
		},
		getCookie: function getCookie(c_name) {
			if (document.cookie.length > 0) {
				var c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					var c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return "";
		},
		delCookie: function delCookie(name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = getCookie(name);
			if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		},
		log: function log() {
			var _console;
	
			(_console = console).log.apply(_console, arguments);
		},
		IE9: navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0",
		isDefinded: function isDefinded(a) {
			return typeof a !== "undefined";
		},
		parseParam: function parseParam(param, key) {
	
			var paramStr = "";
	
			if (typeof param == "string" || typeof param == "number" || typeof param == "boolean") {
	
				paramStr += "&" + key + "=" + encodeURIComponent(param);
			} else {
				for (var i in param) {
					var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
					paramStr += '&' + this.parseParam(param[i], k);
				}
			}
			return paramStr.substr(1);
		},
		guid: function guid() {
			return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
				    v = c == 'x' ? r : r & 0x3 | 0x8;
				return v.toString(16);
			});
		},
		getJSONP: function getJSONP(url, callback) {
			var jsonpScript = document.createElement("script");
			var guid = 'id' + this.guid();
			var lian = url.indexOf('?') >= 0 ? "&" : "?";
			jsonpScript.type = "text/javascript";
			jsonpScript.src = url + lian + "callback=" + guid;
			window[guid] = callback;
			document.getElementsByTagName("head")[0].appendChild(jsonpScript);
		}
	};
	module.exports = tools;

/***/ },

/***/ 162:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var form = exports.form = __webpack_require__(163)["default"];

/***/ },

/***/ 163:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports["default"] = {
		noField: '传入的参数不存在',
		bindFieldArgErr: "请在bindField的时候传入name和value",
		noUnbindField: "要卸载的值找不到",
		noFormItem: function noFormItem(type) {
			return "\u60A8\u6240\u8BBE\u7F6E\u7684 " + type + " \u7C7B\u578B\u7684 \u8868\u5355\u7EC4\u4EF6\u672A\u6CE8\u518C\u6216\u4E0D\u5B58\u5728";
		},
		formItemReged: function formItemReged(type) {
			return "\u60A8\u6240\u8BBE\u7F6E\u7684 " + type + " \u7C7B\u578B\u7684 \u8868\u5355\u7EC4\u4EF6\u5DF2\u7ECF\u52A0\u8F7D\u6CE8\u518C";
		}
	};

/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _public_tools = __webpack_require__(161);
	
	var _public_tools2 = _interopRequireDefault(_public_tools);
	
	var _FormItem = __webpack_require__(165);
	
	var _form = __webpack_require__(163);
	
	var _form2 = _interopRequireDefault(_form);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var getName = function getName(name) {
	  return name ? name : "FormCtrl" + new Date().valueOf() + parseInt(Math.random() * (1 - 99) + 99);
	};
	
	var FormCtrl = function (_Component) {
	  _inherits(FormCtrl, _Component);
	
	  function FormCtrl(props) {
	    _classCallCheck(this, FormCtrl);
	
	    var _this = _possibleConstructorReturn(this, (FormCtrl.__proto__ || Object.getPrototypeOf(FormCtrl)).call(this, props));
	
	    _initialiseProps.call(_this);
	
	    var name = _this.props.name;
	
	    _this.state = {
	      validateStatus: [],
	      value: _this.filterPropsValue(_this.props.defaultValue || _this.props.value, props.type)
	    };
	
	    _this.firstRender = true;
	    _this.name = getName(name);
	
	    return _this;
	  }
	
	  _createClass(FormCtrl, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.itemAlready();
	      this.validateValue(this.state.value);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this2 = this;
	
	      if (nextProps.type != this.props.type) {
	        //this.itemUnmount();
	        var oldName = this.name;
	        this.name = getName(nextProps.name);
	        var value = this.filterPropsValue(nextProps.defaultValue || nextProps.value, nextProps.type);
	        this.setState({ value: value }, function () {
	          _this2.itemAlready();
	        });
	      }
	      switch (_typeof(nextProps.value)) {
	
	        case "string":
	          if (nextProps.value != this.props.value) {
	            this.itemChange(nextProps.value);
	          }
	          break;
	        case "object":
	          if (JSON.stringify(nextProps.value) != JSON.stringify(this.props.value)) {
	            this.itemChange(nextProps.value);
	          }
	          break;
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.itemUnmount();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          label = _props.label,
	          type = _props.type,
	          required = _props.required,
	          tip = _props.tip,
	          isLabel = _props.isLabel;
	
	      var errMsg = this.renderErr();
	      if (!_FormItem.COMPONENTS[type]) {
	        return _react2["default"].createElement(
	          'div',
	          { className: 'form-ctrl' },
	          _form2["default"].noFormItem(type)
	        );
	      }
	
	      return _react2["default"].createElement(
	        'div',
	        { className: 'form-ctrl ' },
	        function () {
	          if (isLabel) {
	            return _react2["default"].createElement(
	              'div',
	              { className: 'form-ctrl-label ' },
	              label ? label + "：" : " "
	            );
	          }
	        }(),
	        _react2["default"].createElement(
	          'div',
	          { className: 'form-comp-wrap ' },
	          this.renderItem(type),
	          _react2["default"].createElement(
	            'div',
	            { className: 'msg-info ' },
	            tip ? _react2["default"].createElement(
	              'div',
	              null,
	              _react2["default"].createElement('i', { className: 'iconfont icon-tishi' }),
	              ' ',
	              tip
	            ) : "",
	            errMsg.length > 0 ? _react2["default"].createElement(
	              'div',
	              { className: 'danger-color' },
	              errMsg
	            ) : ""
	          )
	        )
	      );
	    }
	  }]);
	
	  return FormCtrl;
	}(_react.Component);
	
	FormCtrl.defaultProps = {
	  readOnly: false,
	  required: false,
	  isLabel: true,
	  type: "text",
	  label: '',
	  name: "",
	  value: ""
	};
	
	var _initialiseProps = function _initialiseProps() {
	  var _this3 = this;
	
	  this.itemAlready = function () {
	    var transmitForm = _this3.props.transmitForm;
	    var value = _this3.state.value;
	
	
	    if (transmitForm) {
	      transmitForm.bindField(_this3.name, value);
	    }
	  };
	
	  this.itemUnmount = function () {
	    var transmitForm = _this3.props.transmitForm;
	
	
	    if (transmitForm && transmitForm.formData[_this3.name]) {
	
	      transmitForm.unbindField(_this3.name);
	    }
	  };
	
	  this.itemChange = function (value) {
	    var _props2 = _this3.props,
	        itemChange = _props2.itemChange,
	        transmitForm = _props2.transmitForm;
	
	    _this3.setState({ value: value });
	    _this3.validateValue(value);
	    if (transmitForm) {
	      transmitForm.setFieldValue(_this3.name, value);
	    }
	    if (itemChange) itemChange(value, transmitForm, _this3.name);
	  };
	
	  this.validateValue = function (value) {
	    var _props3 = _this3.props,
	        type = _props3.type,
	        max = _props3.max,
	        min = _props3.min,
	        required = _props3.required,
	        error = _props3.error,
	        exp = _props3.exp,
	        name = _props3.name,
	        label = _props3.label,
	        transmitForm = _props3.transmitForm;
	
	    var validateStatus = [];
	    required && validateStatus.push(_this3.validateFunc("required", value.length == 0, label + '\u4E3A\u5FC5\u586B\u9879'));
	    exp && validateStatus.push(_this3.validateFunc("otherProps", !exp.reg.test(value), exp.info));
	    max && validateStatus.push(_this3.validateFunc("max", max < value.length, '\u8D85\u8FC7\u6700\u5927\u503C' + max));
	    min && validateStatus.push(_this3.validateFunc("min", min > value.length, '\u5C11\u4E8E\u6700\u5C0F\u503C' + min));
	
	    _this3.setState({ validateStatus: validateStatus });
	    if (transmitForm) _this3.sendErrMsg(validateStatus);
	  };
	
	  this.validateFunc = function (name, exp) {
	    var info = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
	
	    return {
	      name: name,
	      err: exp,
	      info: exp ? info : ""
	    };
	  };
	
	  this.sendErrMsg = function (validateStatus) {
	    var allErrMsg = [];
	    validateStatus.forEach(function (obj) {
	      if (obj.err) {
	        allErrMsg.push({
	          type: obj.name,
	          info: obj.info
	        });
	      }
	    });
	    _this3.props.transmitForm.setValidate(_this3.name, allErrMsg);
	  };
	
	  this.filterPropsValue = function (val, type) {
	    var valType = _FormItem.COMPONENTS[type].valueType;
	    var resVal = val;
	    switch (valType) {
	      case 'Array':
	        resVal = val instanceof Array ? val : [];
	        break;
	      case 'string':
	
	        resVal = typeof val === "string" || typeof val === "number" ? val : "";
	        break;
	    }
	
	    return resVal;
	  };
	
	  this.renderItem = function (type) {
	    var props = _public_tools2["default"].deepCopyProps(_this3.props);
	    props.value = _this3.state.value;
	    // props.value=this.filterPropsValue(this.state.value,type);
	    props.name = _this3.name;
	    props.onValueChange = function (value) {
	      _this3.itemChange(value);
	    };
	    return _FormItem.COMPONENTS[type].render(props);
	  };
	
	  this.renderErr = function () {
	    var validateStatus = _this3.state.validateStatus;
	
	    var errMsgInfo = [];
	    validateStatus.forEach(function (obj, idx) {
	      if (obj.err) {
	        if (obj.name == "required" && _this3.firstRender) return;
	        errMsgInfo.push(_react2["default"].createElement(
	          'div',
	          { key: idx },
	          _react2["default"].createElement('i', { className: 'iconfont icon-cuowu ' }),
	          ' ',
	          obj.info
	        ));
	      } else {
	        //this.firstRender=false
	      }
	    });
	    return errMsgInfo;
	  };
	};
	
	exports["default"] = FormCtrl;

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.regComp = exports.enhance = exports.COMPONENTS = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _public_tools = __webpack_require__(161);
	
	var _public_tools2 = _interopRequireDefault(_public_tools);
	
	var _form = __webpack_require__(163);
	
	var _form2 = _interopRequireDefault(_form);
	
	var _validate = __webpack_require__(166);
	
	var _validate2 = _interopRequireDefault(_validate);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var COMPONENTS = exports.COMPONENTS = {};
	var enhance = exports.enhance = function enhance(ComponsedComponent) {
	  var FormItem = function (_Component) {
	    _inherits(FormItem, _Component);
	
	    function FormItem(props) {
	      _classCallCheck(this, FormItem);
	
	      return _possibleConstructorReturn(this, (FormItem.__proto__ || Object.getPrototypeOf(FormItem)).call(this, props));
	    }
	    /*shouldComponentUpdate(nextProps, nextState) {
	      //return nextProps.value!=this.props.value;
	      // 根据实际情况判断当前帖子的状态是否和之前不同
	    }*/
	
	
	    _createClass(FormItem, [{
	      key: 'render',
	      value: function render() {
	        var props = _public_tools2["default"].deepCopy(this.props);
	
	        delete props.transmitForm;
	        return _react2["default"].createElement(ComponsedComponent, props);
	      }
	    }]);
	
	    return FormItem;
	  }(_react.Component);
	
	  ;
	  return FormItem;
	};
	
	var regComp = exports.regComp = function regComp(ComposedComponent) {
	  var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	  var newComponent = enhance(ComposedComponent);
	  if (!Array.isArray(types)) {
	    types = [types];
	  }
	
	  types.forEach(function (type) {
	
	    if (COMPONENTS.hasOwnProperty(type)) {
	      console.warn(_form2["default"].formItemReged(type));
	      return;
	    }
	
	    var valueType = options.valueType,
	        render = options.render;
	
	    if (!valueType) {
	      valueType = ['integer', 'number'].indexOf(type) > -1 ? 'number' : 'string';
	    }
	
	    if (!render) {
	      render = function render(props) {
	        return (0, _react.createElement)(newComponent, props);
	      };
	    }
	
	    COMPONENTS[type] = {
	      render: render,
	      valueType: valueType,
	      component: ComposedComponent
	    };
	  });
	
	  return newComponent;
	};

/***/ },

/***/ 166:
/***/ function(module, exports) {

	"use strict";
	
	var valid = {
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
	};
	
	module.exports = valid;

/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _public_tools = __webpack_require__(161);
	
	var _public_tools2 = _interopRequireDefault(_public_tools);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var FormSub = function (_Component) {
	  _inherits(FormSub, _Component);
	
	  function FormSub(props) {
	    _classCallCheck(this, FormSub);
	
	    var _this = _possibleConstructorReturn(this, (FormSub.__proto__ || Object.getPrototypeOf(FormSub)).call(this, props));
	
	    _this.state = {};
	    return _this;
	  }
	
	  _createClass(FormSub, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {}
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          text = _props.text,
	          disabled = _props.disabled,
	          _onClick = _props.onClick,
	          className = _props.className;
	
	      return _react2["default"].createElement(
	        'div',
	        { className: "form-sub-box " + className },
	        _react2["default"].createElement(
	          'div',
	          { className: 'form-sub' },
	          (0, _react.createElement)('a', {
	            className: 'btn btn-info ' + (disabled ? "disabled" : ""),
	            onClick: function onClick() {
	              if (disabled) {
	                return;
	              }
	              _onClick();
	            }
	          }, text)
	        )
	      );
	    }
	  }]);
	
	  return FormSub;
	}(_react.Component);
	
	FormSub.defaultProps = {
	  disabled: false,
	  text: "提交",
	  onClick: function onClick() {}
	};
	exports["default"] = FormSub;

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Input = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _FormItem = __webpack_require__(165);
	
	var _validate = __webpack_require__(166);
	
	var _validate2 = _interopRequireDefault(_validate);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @fileOverview react input组件封装 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @author <a href="">pan</a> 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @version 0.1 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */
	/** 
	* @author pan 
	
	* @description react input组件封装  
	* @since version 0.2 
	* @param  Props {String} value            input组件的值,从外部传入可直接表单回填 
	* @param  Props {String} title            标题 
	* @param  Props {String} name             input组件的name 
	* @param  Props {String} type             input组件的类型目前支持  'text','email','password','phone','num','textarea'
	* @param  Props {Function} onValueChange  从外部传入事件，当value改变时调用，可向外部传参
	* @param  Props {String} title            标题 
	* @param  Props {String} style            设置input样式
	* @param  Props {String} expType          正则过滤器，(暂未开放)
	* @param  Props {String} expReg           过滤正则
	
	*/
	
	var InputEle = function (_Component) {
	  _inherits(InputEle, _Component);
	
	  function InputEle(props) {
	    _classCallCheck(this, InputEle);
	
	    var _this = _possibleConstructorReturn(this, (InputEle.__proto__ || Object.getPrototypeOf(InputEle)).call(this, props));
	
	    _this.change = function (event) {
	      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      var _this$props = _this.props,
	          type = _this$props.type,
	          onValueChange = _this$props.onValueChange,
	          changeType = _this$props.changeType,
	          onUpData = _this$props.onUpData;
	
	      var dom = _this.refs.inputObj || event.target;
	      var value = t !== false ? t : dom.value;
	      if (type == "textarea") {
	        _this.textareaChange(dom);
	      }
	      if (!_this.expFilter(value)) {
	        return;
	      }
	
	      _this.setState({ value: value });
	
	      if (onValueChange && changeType == "upData" || t !== false) onValueChange(value);
	      if (onUpData && changeType != "upData") {
	        onUpData(value);
	      }
	    };
	
	    _this.focus = function () {
	      var _this$props2 = _this.props,
	          onFocusFunc = _this$props2.onFocusFunc,
	          value = _this$props2.value,
	          readOnly = _this$props2.readOnly;
	
	      if (readOnly) return;
	      _this.setState({ focus: true });
	      if (onFocusFunc) onFocusFunc(value);
	    };
	
	    _this.blur = function () {
	      var _this$props3 = _this.props,
	          onValueChange = _this$props3.onValueChange,
	          changeType = _this$props3.changeType;
	      var value = _this.state.value;
	
	      setTimeout(function () {
	        _this.setState({ focus: false });
	      }, 1000);
	      if (onValueChange && changeType == "blur") onValueChange(value);
	    };
	
	    _this.expFilter = function (value) {
	      var _this$props4 = _this.props,
	          type = _this$props4.type,
	          expReg = _this$props4.expReg,
	          readOnly = _this$props4.readOnly;
	
	      if (readOnly) {
	        return false;
	      }
	      if (expReg && !_this.expFunc(value, expReg)) {
	        return false;
	      }
	      if (type == "num" && !_this.expFunc(value, _validate2["default"].num.exp)) {
	        return false;
	      }
	      return true;
	    };
	
	    _this.expFunc = function (val, exp) {
	      return exp.test(val);
	    };
	
	    _this.rendInputHtml = function () {
	      var _this$props5 = _this.props,
	          type = _this$props5.type,
	          placeholder = _this$props5.placeholder,
	          name = _this$props5.name,
	          style = _this$props5.style,
	          readOnly = _this$props5.readOnly;
	      var _this$state = _this.state,
	          value = _this$state.value,
	          focus = _this$state.focus;
	
	      var eleType = type == "textarea" ? "textarea" : "input";
	      var tagType = type == "password" ? "password" : "text";
	      var readOnlyClass = readOnly ? "disabled" : "";
	      style = style ? style : {};
	      placeholder = placeholder || "";
	
	      return (0, _react.createElement)(eleType, {
	        type: tagType,
	        name: name,
	        style: style,
	        placeholder: placeholder,
	        ref: "inputObj",
	        value: value,
	        onChange: _this.change,
	        onFocus: _this.focus,
	        onBlur: _this.blur,
	        className: 'ui-' + eleType + ' ' + readOnlyClass
	      });
	    };
	
	    _this.textareaChange = function (dom) {
	      var tH = _this.state.textareaHeight;
	      if (_this.firstHeight == 0) {
	        _this.firstHeight = dom.offsetHeight;
	      }
	      dom.style.height = _this.firstHeight + 'px';
	      tH = dom.scrollHeight;
	      dom.style.height = tH + 'px';
	    };
	
	    _this.clearValue = function (event) {
	      _this.change(event, "");
	    };
	
	    _this.state = {
	      inputEd: false,
	      value: _this.props.value,
	      focus: false,
	      textareaHeight: false
	    };
	    _this.firstHeight = 0;
	    return _this;
	  }
	
	  _createClass(InputEle, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.value != this.props.value) {
	        this.setState({ value: nextProps.value });
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      if (this.props.type == "textarea") {}
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var _state = this.state,
	          focus = _state.focus,
	          value = _state.value;
	
	      return _react2["default"].createElement(
	        'div',
	        { className: 'ui-input-wrap' },
	        this.rendInputHtml(),
	        focus && value ? _react2["default"].createElement('i', { onClick: function onClick(event) {
	            _this2.clearValue(event);
	          }, className: 'iconfont icon-cuowu' }) : ""
	      );
	    }
	  }]);
	
	  return InputEle;
	}(_react.Component);
	
	InputEle.defaultProps = {
	  value: "",
	  title: "",
	  name: "",
	  readOnly: false,
	  expType: false,
	  expReg: false,
	
	  type: "text",
	  changeType: "blur",
	  style: false,
	  onValueChange: false
	};
	exports["default"] = (0, _FormItem.regComp)(InputEle, ['text', 'email', 'password', 'phone', 'num', 'textarea'], { valueType: 'string' });
	var Input = exports.Input = InputEle;

/***/ },

/***/ 169:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.InputGroup = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _FormItem = __webpack_require__(165);
	
	var _Input = __webpack_require__(168);
	
	var _validate = __webpack_require__(166);
	
	var _validate2 = _interopRequireDefault(_validate);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @fileOverview react input组件封装 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @author <a href="">pan</a> 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @version 0.1 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */
	/** 
	* @author pan 
	
	* @description react input组件封装  
	* @since version 0.2 
	* @param  Props {String} value            input组件的值,从外部传入可直接表单回填 
	* @param  Props {String} title            标题 
	* @param  Props {String} name             input组件的name 
	* @param  Props {String} type             input组件的类型目前支持  'text','email','password','phone','num','textarea'
	* @param  Props {Function} onValueChange  从外部传入事件，当value改变时调用，可向外部传参
	* @param  Props {String} title            标题 
	* @param  Props {String} style            设置input样式
	* @param  Props {String} expType          正则过滤器，(暂未开放)
	* @param  Props {String} expReg           过滤正则
	
	*/
	
	var InputGroupEle = function (_Component) {
	  _inherits(InputGroupEle, _Component);
	
	  function InputGroupEle(props) {
	    _classCallCheck(this, InputGroupEle);
	
	    var _this = _possibleConstructorReturn(this, (InputGroupEle.__proto__ || Object.getPrototypeOf(InputGroupEle)).call(this, props));
	
	    _this.onValueChange = function (val) {
	      _this.setState({ value: val }, function () {
	        var onValueChange = _this.props.onValueChange;
	
	        onValueChange(val);
	      });
	    };
	
	    _this.state = {
	      inputEd: false,
	      value: _this.props.value,
	      focus: false,
	      textareaHeight: false
	    };
	    _this.firstHeight = 0;
	    return _this;
	  }
	
	  _createClass(InputGroupEle, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {}
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.value != this.props.value) {
	        this.setState({ value: nextProps.value });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var _props = this.props,
	          barHtml = _props.barHtml,
	          onValueChange = _props.onValueChange,
	          value = _props.value,
	          otherProps = _objectWithoutProperties(_props, ['barHtml', 'onValueChange', 'value']);
	
	      return _react2["default"].createElement(
	        'div',
	        { className: 'input-group-wrap' },
	        _react2["default"].createElement(_Input.Input, _extends({ value: this.state.value }, otherProps, { onValueChange: function onValueChange(val) {
	            _this2.onValueChange(val);
	          } })),
	        _react2["default"].createElement(
	          'div',
	          { className: 'group-bar' },
	          barHtml
	        )
	      );
	    }
	  }]);
	
	  return InputGroupEle;
	}(_react.Component);
	
	InputGroupEle.defaultProps = {
	  value: "",
	  title: "",
	  name: "",
	  readOnly: false,
	  expType: false,
	  expReg: false,
	  barHtml: "",
	  type: "text",
	  changeType: "blur",
	  style: false,
	  onValueChange: function onValueChange() {}
	};
	exports["default"] = (0, _FormItem.regComp)(InputGroupEle, ['input-group'], { valueType: 'string' });
	var InputGroup = exports.InputGroup = InputGroupEle;

/***/ },

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(158);
	var ProcessComp = React.createClass({
	  displayName: 'ProcessComp',
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      show: false,
	      title: "玩命加载中..."
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      show: this.props.show
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.show != this.state.show) {
	      this.setState({ show: nextProps.show });
	    }
	  },
	  render: function render() {
	    var classShow = this.state.show ? "show" : "hide";
	    return React.createElement(
	      'div',
	      { className: "load-container load-ring " + classShow },
	      React.createElement(
	        'div',
	        { className: 'loader' },
	        React.createElement(
	          'div',
	          { className: 'spinner' },
	          React.createElement('div', { className: 'double-bounce1' }),
	          React.createElement('div', { className: 'double-bounce2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'tip-txt' },
	          this.props.title
	        )
	      )
	    );
	  }
	});
	
	var containerDOM = null;
	var Process = {};
	var config = {};
	Process.show = function (conf) {
	  conf = conf || {};
	
	  conf.show = true;
	  config = conf;
	  conf.onClose = function () {
	    Process.Close();
	  };
	  if (!containerDOM) {
	    containerDOM = document.createElement('div');
	    document.body.appendChild(containerDOM);
	  }
	  ReactDOM.render(React.createElement(ProcessComp, conf), containerDOM);
	};
	Process.Close = function (content, type) {
	  config.show = false;
	  ReactDOM.render(React.createElement(ProcessComp, config), containerDOM);
	  setTimeout(function () {
	    ReactDOM.render(React.createElement('div', null), containerDOM);
	  }, 500);
	};
	module.exports = Process;

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(158);
	var ToastComp = React.createClass({
	  displayName: 'ToastComp',
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      show: false,
	      msg: "玩命加载中..."
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      show: this.props.show
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.show != this.state.show) {
	      this.setState({ show: nextProps.show });
	    }
	  },
	  render: function render() {
	    var classShow = this.state.show ? "show" : "hide";
	    return React.createElement(
	      'div',
	      { className: "toast " + classShow },
	      React.createElement(
	        'div',
	        { className: 'msg' },
	        this.props.msg
	      )
	    );
	  }
	});
	
	var containerDOM = null;
	var Toast = {};
	var config = {};
	Toast.show = function (conf) {
	  conf = conf || {};
	  var closeTime = conf.closeTime || 2000;
	  conf.show = true;
	  config = conf;
	  conf.onClose = function () {
	    Toast.Close();
	  };
	  if (!containerDOM) {
	    containerDOM = document.createElement('div');
	    document.body.appendChild(containerDOM);
	  }
	  ReactDOM.render(React.createElement(ToastComp, conf), containerDOM);
	  setTimeout(function () {
	    Toast.Close();
	  }, closeTime);
	};
	Toast.Close = function (content, type) {
	  config.show = false;
	  ReactDOM.render(React.createElement(ToastComp, config), containerDOM);
	  setTimeout(function () {
	    ReactDOM.render(React.createElement('div', null), containerDOM);
	  }, 500);
	};
	module.exports = Toast;

/***/ }

});
//# sourceMappingURL=login.bundle.js.map