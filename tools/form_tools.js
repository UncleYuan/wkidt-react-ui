const tools = {
	dataArrToObj: function(arr) {
		let newObj = {};
		arr.forEach((obj, i) => {
			newObj[obj.id] = obj;
		})
		return newObj;
	},
	setArrObjVal: function(arr, name, val, key = false) {
	
		arr.forEach((obj, i) => {
			
			if (obj.name == name) {
				
				if (key) {
					arr[i][key] = val
				} else {
					arr[i]["value"] = val
				}
			
			}
		})
		return arr;
	},
	arrToStringValue: function(arr, tel) {
		let now = [];
		arr.length > 0 && arr.forEach((obj, i) => {
			now.push(tel(obj));
		})
		return now.join(',')
	}
}

module.exports = tools;