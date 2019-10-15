import React, {
  Component,
  PropTypes,
  Children,
  cloneElement
} from 'react';
import tools from '../tools/public_tools';
import { regComp } from './higherOrders/FormItem';
/*import fetchJsonp from 'fetch-jsonp';*/
/*import reqwest from 'reqwest';*/
const ak = "vLa6DuXFVZLAj3xPyX6dhBXR";


class InputPositionEle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: this.props.value,
    };
  }
  static defaultProps = {
    value: "",
    title: "",
    auto: true,
    urlFilter: function (latitude, longitude) {
      return (`http://api.map.baidu.com/geocoder/v2/?ak=${ak}&callback=renderReverse&location=${latitude},${longitude}&output=json&pois=0`)
    },
    name: "",
    urlTransFilter: function (latitude, longitude,type=1) {
      return (`http://api.map.baidu.com/geoconv/v1/?coords=${longitude},${latitude}&from=${type}&to=5&ak=${ak}`)
    },
    valueTemp: function (data) {
      return (`${data.result.formatted_address}`)
    },
    placeholder: '',
    onValueChange: function () { },
    latLngChange: function () { }
  }
  componentWillMount() {
    if (this.props.auto) {
      this.getLocation()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getLocation = () => {
    if (window.wx && window.wx.checkJsApi) {
             wx.checkJsApi({
                 jsApiList: [
                     'getLocation'
                 ],
                 success: (res)=> {
                     this.setPosition(res, "weixin");
                     // alert(JSON.stringify(res.checkResult.getLocation));
                     if (res.checkResult.getLocation == false) {
                         this.error();
                     }
                 }
             });
         } else if(window.navigator.geolocation){
            
                 let options = {
                     enableHighAccuracy: true,
                 };

                 let success=(position)=> {
                     let p = {
                         lng: position.coords.longitude,
                         lat: position.coords.latitude
                     }
                     this.setPosition(p, "gps");
                 }
                 window.navigator.geolocation.getCurrentPosition(success, this.error, options);
             
         
   
    
    } else {
      this.error()
    }
  }

  error = (err) => {
     tools.getJSONP('http://api.map.baidu.com/highacciploc/v1?qterm=pc&ak=C12649ba908873e03afe5ef773204b51&coord=bd09ll&callback_type=jsonp&callback=sadasdsa',
        (data)=> {
          let posNow={};
          posNow.lat = data.content.location.lat;
          posNow.lng = data.content.location.lng;
          this.setPosition(posNow,'baidu');
        });
  }
  setPosition = (position,type) => {
   
    let {urlFilter, valueTemp, urlTransFilter, latLngChange} = this.props;
    this.setState({ loading: true })
   
    let fromType=1;
   
    if (type == "weixin") {
      fromType = 3
    }else if(type=="gps"){
      fromType = 1;
    }else if(type=="baidu"){
      this.getAddrValue(position.lat, position.lng);
      return ;
    }
    
    tools.getJSONP(urlTransFilter(position.lat, position.lng,fromType),(res)=>{
      if (latLngChange) {
          latLngChange(res.result[0]);
        }
        this.getAddrValue(res.result[0].y, res.result[0].x)
       
    })
  }
  getAddrValue=(y,x)=>{
    let {urlFilter, valueTemp, urlTransFilter, latLngChange} = this.props;
    tools.getJSONP(urlFilter(y, x),(result)=>{
            this.setState({ value: valueTemp(result), loading: false }, () => {
              this.onValueChange(valueTemp(result))
            });
        })
  }
  onValueChange = (value) => {
    this.props.onValueChange(value);
  }
  render() {
    let {value, loading} = this.state;
    let {valueTemp} = this.props;

    return (
      <div className="ui-drop-wrap ">
        <div className="ui-input-box" onClick={() => { this.getLocation() } } >
          <i className="iconfont icon-heilongjiangtubiao24" ></i>{loading ? "正在获取地址" : (value ? value : '请点击获取地址')}
        </div>
      </div>
    );
  }
}
export default regComp(InputPositionEle, ['position'], { valueType: 'string' });
export const InputPosition = InputPositionEle;