/** 
* @fileOverview react checkbox组件封装 
* @author <a href="">pan</a> 
* @version 0.1 
*/ 
/** 
* @author pan 

* @description react checkbox组件封装  
* @since version 0.1 
* @param  Props {String} value         checkbox组件的值,从外部传入可直接表单回填 
* @param  Props {String} title         标题 
* @param  Props {String} name          checkbox组件的name 
* @param  Props {String} type          checkbox组件的类型目前支持  radio,checkbox
* @param  Props {Array} options     渲染的选项数据[{title:'',value:''}]
* @param  Props {Function} onSelEnd    从外部传入事件，当value改变时调用，可向外部传参
* @param  Props {Array} chooseArr      选中的选项的数组
* @param  Props {Number} selLen        设置多选时最多可选择的个数
*/ 

import React,{Component,createElement} from 'react';
/*import fetch from 'fetch-polyfill2';*/
import { regComp } from './higherOrders/FormItem';
import validate from './validate/validate';
import tools from '../tools/public_tools';
import {Select} from './Select';
import Dom from '../tools/Dom';


const tranCnToEnCode =function(arr){
  arr.forEach((obj,idx)=>{
    arr[idx].filter=CntoEn(arr[idx].name)[0];
  })
  return arr;
}
const turnOtionsFilter =function(arr,search){
  let newOptions=arr.slice(0);
  return search?tranCnToEnCode(newOptions):newOptions;
}

class CascaderEle extends Component {
  constructor(props) {
    super(props);
    let initDataAll=[];
    let initValue=[];
    props.config.forEach(()=>{
      initValue.push('');
      initDataAll.push([]);
    })
    this.state = {
      value:props.value.length>0?props.value.slice(0):initValue,
      dataAll:initDataAll
    }

  }
  static defaultProps={ 
    value:[],
    onValueChange:function(val){

    },
    defaultFilter:function(res){
      let nowData=[];
      if(res.code=="SUCCESS"&&res.data && res.data.length>0){
        for(let i=0;i< res.data.length;i++){
          nowData.push({name:res.data[i].name,value:res.data[i].id});
        }
      }
      return nowData;
    },
    readOnly:false,
    config:[]
  };
  componentWillMount() {
    
  }
  componentDidMount() {
    this.resetSelectItem("",0,"reset");

  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value.join(',')!=this.props.value.join(',')){
      this.resetSelectItem("",0,"reset");
    }
  }
  getTypeFetch=(url,callback,type)=>{
    if(type=="fetch"){
      fetch(url, {
        method: "get",
         credentials:'same-origin',
      }).then(response => response.json())
      .then(callback, function(e) {
 
      })
    }else{
      tools.getJSONP(url,callback)
    }
    
  }
  resetSelectItem=(id="",idx=0,type="only")=>{
    let {config,onValueChange,defaultFilter}=this.props;
    let {value,dataAll}=this.state;
    if(idx==config.length){
      value[idx-1]=id;
      this.setState({value})
      onValueChange(value,dataAll);
      return;
    }
    let lian=config[idx].url.indexOf('?')>=0?"&":"?";
    let fetchType=config[idx].type=="jsonp"?"jsonp":"fetch";
    this.getTypeFetch(config[idx].url+lian+config[idx].keyName+"="+id,(res)=>{
      let nowData=config[idx].filter?config[idx].filter(res):defaultFilter(res);
      for(let i=idx-1;i< config.length;i++){
        if(i>=idx&&i>=0&&config[i]){
          dataAll[i]=[];
          if(type!="reset"){ value[i]="";}
        }
      }
      dataAll[idx]=nowData;
      if(idx>=1)value[idx-1]=id;
      this.setState({dataAll,value});
      onValueChange(value,dataAll);
      if(idx< config.length-1&&type!="only"&&value[idx]!==""){
        let nextType=type=="reset"?"reset":"only";
        this.resetSelectItem(value[idx],idx+1,nextType);
      }
    },fetchType)   
  }
  selectItemChange=(idx,val)=>{
    this.resetSelectItem(val,idx+1);
  } 
  render() {

      let {config,readOnly}=this.props;
      let {dataAll,value}=this.state;
      return (
        <div className="ui-cascader-group "  >
          {config.map(function(obj,idx){
              return (
                <div key={idx} className="cascader-box">
                  <Select value={value[idx] instanceof Array?value[idx]:[value[idx]]} search={true} readOnly={readOnly} type="select-single" options={dataAll[idx]} onValueChange={(v)=>{ this.selectItemChange(idx,v[0]||""); }} ></Select>
                </div>
              )
          },this)}
        </div>
      );
    }
  }
export default  regComp(CascaderEle, ['cascader'],{valueType:'Array'});
export const Cascader = CascaderEle;



