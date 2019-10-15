const Dom = {
	addEvent: function(obj, type, handle) {
		try { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
			obj.addEventListener(type, handle, false);
		} catch (e) {
			try { // IE8.0及其以下版本
				obj.attachEvent('on' + type, handle);
			} catch (e) { // 早期浏览器
				obj['on' + type] = handle;
			}
		}
	},
	removeEvent: function(obj, type, handle) {

		try { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
			obj.removeEventListener(type, handle, false);
		} catch (e) {
			// IE8.0及其以下版本
			obj.detachEvent('on' + type, handle);

		}
	},
	parentNodeByClass: function(obj, className) {
		var Arr = [];
		if (obj.parentNode) {
			if (obj.parentNode.className && obj.parentNode.className.indexOf(className) >= 0) {

				Arr.push(obj.parentNode);
			}
			let getArr = this.parentNodeByClass(obj.parentNode, className);
			Arr = Arr.concat(getArr);
		}
		return Arr;
	},
	getViewPortSize: function() {
		// 除IE8及更早的版本以外的浏览器
		if (window.innerWidth != null) {
			return {
				w: window.innerWidth,
				h: window.innerHeight
			}
		}
		// 标准模式下的IE
		if (document.compatMode == "css1Compat") {
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			}
		}
		// 怪异模式下的浏览器
		return {
			w: document.body.clientWidth,
			h: document.body.clientHeight
		}
	},
	GetRect: function(element) {
		let docEle = document.documentElement;
		let rect = element.getBoundingClientRect();
		let top = docEle.clientTop;
		let left = docEle.clientLeft;
		return {
			top: rect.top - top, //如果是IE7以下那么 结果为 ‘2 - 2’。 不是为IE的话 结果是 ‘ 0 - 0 ’； 不管哪种方式，结果最终就是0
			bottom: rect.bottom - top,
			left: rect.left - left,
			right: rect.right - left
		}
	}
}
export default Dom;