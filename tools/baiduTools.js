import tools from './public_tools';

const ak = "vLa6DuXFVZLAj3xPyX6dhBXR";


class PositionClass {
  constructor(props) {
    this.props = {
      auto: true,
      urlFilter: function(latitude, longitude) {
        return (`http://api.map.baidu.com/geocoder/v2/?ak=${ak}&callback=renderReverse&location=${latitude},${longitude}&output=json&pois=0`)
      },
      urlTransFilter: function(latitude, longitude, type = 1) {
        return (`http://api.map.baidu.com/geoconv/v1/?coords=${longitude},${latitude}&from=${type}&to=5&ak=${ak}`)
      },
      valueTemp: function(data) {
        return (`${data.result.formatted_address}`)
      }
    }
  }
  getLocation = (callback) => {
    if (window.wx && window.wx.checkJsApi) {
      wx.checkJsApi({
        jsApiList: [
          'getLocation'
        ],
        success: (res) => {
          this.setPosition(res, "weixin", callback);
          if (res.checkResult.getLocation == false) {
            this.error();
          }
        }
      });
    } else if (window.navigator.geolocation) {

      let options = {
        enableHighAccuracy: true,
      };

      let success = (position) => {
        let p = {
          lng: position.coords.longitude,
          lat: position.coords.latitude
        }
        this.setPosition(p, "gps", callback);
      }
      window.navigator.geolocation.getCurrentPosition(success, (err) => {
        this.error(callback)
      }, options);



    } else {
      this.error(callback)
    }
  }

  error = (callback) => {
    tools.getJSONP('http://api.map.baidu.com/highacciploc/v1?qterm=pc&ak=C12649ba908873e03afe5ef773204b51&coord=bd09ll&callback_type=jsonp&callback=sadasdsa',
      (data) => {
        let posNow = {};
        posNow.lat = data.content.location.lat;
        posNow.lng = data.content.location.lng;
        this.setPosition(posNow, 'baidu', callback);
      });
  }
  setPosition = (position, type, callback) => {

    let {
      urlFilter,
      valueTemp,
      urlTransFilter,
      latLngChange
    } = this.props;

    let fromType = 1;

    if (type == "weixin") {
      fromType = 3
    } else if (type == "gps") {
      fromType = 1;
    } else if (type == "baidu") {
      callback(position.lat, position.lng);
      return;
    }

    tools.getJSONP(urlTransFilter(position.lat, position.lng, fromType), (res) => {

      callback(res.result[0].y, res.result[0].x)

    })
  }
  getAddrValue = (y, x) => {
    let {
      urlFilter,
      valueTemp,
      urlTransFilter,
      latLngChange
    } = this.props;
    tools.getJSONP(urlFilter(y, x), (result) => {

      let value = valueTemp(result);

    })
  }


}

export const Position = PositionClass;