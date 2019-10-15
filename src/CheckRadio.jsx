/** 
* @fileOverview react checkbox组件封装 
* @author <a href="">pan</a> 
* @version 0.1 
*/ 
/** 
* @author pan 

* @description react checkbox组件封装  
* @since version 0.1 
* @param  Props {Array} value         checkbox组件的值,从外部传入可直接表单回填 
* @param  Props {String} title         标题 
* @param  Props {String} name          checkbox组件的name 
* @param  Props {String} type          checkbox组件的类型目前支持  radio,checkbox
* @param  Props {Array} options     渲染的选项数据[{title:'',value:''}]
* @param  Props {Function} onSelEnd    从外部传入事件，当value改变时调用，可向外部传参

* @param  Props {Number} selLen        设置多选时最多可选择的个数
*/ 

import React,{Component,createElement} from 'react';
import { regComp } from './higherOrders/FormItem';
import validate from './validate/validate';
import tools from '../tools/public_tools';
class CheckRadioEle extends Component {
  constructor(props) {
    super(props);
    let initVal=props.defaultValue||props.value;
    this.state = {
      value:this.filterStringValue(initVal)
    }
    if(this.filterStringValue(initVal)!=initVal){
      if(props.onValueChange) props.onValueChange(value);
    }
  }
  static defaultProps={ 
    title:"",
    options:[],
    value:[],
    selLen:1000,
    name:"",
    checkradioStyle:"normal",
    readOnly:false,
    type:"checkbox"
  };
  componentWillMount() {
    
  }
  componentWillReceiveProps(nextProps){
    
    if(nextProps.value instanceof Array &&JSON.stringify(nextProps.value)!=JSON.stringify(this.props.value)){
      this.setState({value:nextProps.value});
    }else if(typeof nextProps.value!="undefined"&&JSON.stringify(this.filterStringValue(nextProps.value))!=JSON.stringify(this.filterStringValue(this.props.value))){
      let setVal=this.filterStringValue(nextProps.value);
      this.setState({value:setVal});
      if(JSON.stringify(setVal)!=JSON.stringify(nextProps.value)){
        if(this.props.onValueChange) this.props.onValueChange(setVal);
      }
    }
  }
  filterStringValue=(val)=>{
    let newVal=val;

    if(typeof val ==="string"){
      newVal=val.split(',');
    }else if(typeof val ==="number"){
      newVal=[val];
    }
    return newVal;
  }
  chooseReset=(value)=>{
      let arr=this.props.options;
      for(let i in arr){
        if(arr[i].val==value){

          this.chooseRadio(i);
          return;
        }
      }
  }
  choose=(i)=>{
      let {readOnly,options,selLen,onValueChange,type}=this.props;
      if(readOnly||options[i].disabled){ return }
      let chooseVal=options[i].value;
      let {value}=this.state;
      let haveIdx=tools.indexOf(value,chooseVal);

      if(haveIdx< 0){
        if(type=="checkbox"&&selLen<=value.length){
          value.shift();
        }else if(type=="radio"){
          value=[];
        } 
        value.push(chooseVal);
      }else{
        value=tools.removeArr(value,chooseVal);
      }

      this.setState({value});
      if(onValueChange) onValueChange(value,chooseVal,haveIdx);
  }
  
  getHtml=(type)=>{
    let {options,readOnly,checkradioStyle}=this.props;
    let {value}=this.state;
      return options.map(function (obj,i) {
      
            let addClass=type=="checkbox"?"icon-duoxuan":"icon-danxuan";
         
            let selClass=tools.indexOf(value,obj.value)>=0?"checked":"";
                addClass=selClass?addClass:"icon-xuanze";
             
            let disabledClass=readOnly||obj.disabled?" disabled":"";
            if(checkradioStyle=="normal"){
              return (
                <li key={i} onClick={ ()=>{ this.choose(i);} } className={"check-row "+selClass+disabledClass}>
                    <i className={"iconfont "+addClass}></i><p className="check-txt">{obj.name}</p>
                </li>
              )
            }else if(checkradioStyle=="btn"){
              return (
                <li key={i} onClick={ ()=>{ this.choose(i);} } className={"check-btn-row "+selClass+disabledClass}>
                   {obj.name}
                </li>
              )
            }
            
      },this);
  }
  render() {
      let {value} = this.state;
      let {inline,type}=this.props;

      return (
        <div className="ui-check-wrap"  >
          
              
              <ul className={"ui-check "+(inline?"inline":"")}>
                   {this.getHtml(type)}
              </ul>
        </div>
      );
    }
  }
export default regComp(CheckRadioEle, ['checkbox','radio'],{valueType:'Array'});
export const CheckRadio = CheckRadioEle;



