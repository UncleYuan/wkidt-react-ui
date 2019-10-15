/** 
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

import React,{Component,createElement} from 'react';
import { regComp } from './higherOrders/FormItem';
import validate from './validate/validate';
class InputEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputEd:false,
      value:this.props.value,
      focus:false,
      textareaHeight:false
    }
    this.firstHeight=0;
  }
  static defaultProps={ 
    value:"",
    title:"",
    name:"",
    readOnly:false,
    expType:false,
    expReg:false,

    type:"text",
    changeType:"blur",
    style:false,
    onValueChange:false,
  };
  componentWillMount(){
    
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value!=this.state.value){
      this.setState({value:nextProps.value})
    }
  }
  componentDidMount() {
    if(this.props.type=="textarea"){

    }     
  }
  change=(event,t=false)=>{
  
    let {type,onValueChange,changeType}=this.props;
    let dom=this.refs.inputObj||event.target
    let value=t!==false?t:dom.value;
    if(type=="textarea"){
      this.textareaChange(dom);
    }
    if(!this.expFilter(value)){
      return;
    }
    
    this.setState({value:value});

    if(onValueChange&&changeType=="upData"||t!==false)this.props.onValueChange(value);
  }
  focus=()=>{
    let {onFocusFunc,value}=this.props;
    this.setState({focus:true});
    if(onFocusFunc)onFocusFunc(value);
  }
  blur=()=>{
    let {onValueChange,changeType}=this.props;
    let {value}=this.state;
    setTimeout(()=>{
      this.setState({focus:false});
    },1000)
    if(onValueChange&&changeType=="blur")onValueChange(value);
  }
  expFilter=(value)=>{
    let {type,expReg,readOnly}=this.props;
    if(readOnly){
      return false;
    }
    if(expReg&& !this.expFunc(value,expReg)){
      return false;
    }
    if(type=="num"&& !this.expFunc(value,validate.num.exp)){
      return false;
    } 
    return true;
  }
  expFunc=(val,exp)=>{
    return exp.test(val);
  }
  rendInputHtml=()=>{
    let {type,placeholder,name,style}=this.props;
    let {value,focus}=this.state;
    let eleType=type=="textarea"?"textarea":"input";
    let tagType=type=="password"?"password":"text";
    style=style?style:{};
    placeholder=placeholder||"";

    return createElement(eleType,
      {
        type:tagType,
        name:name,
        style:style,
        placeholder:placeholder,
        ref:"inputObj",
        value:value,
        onChange:this.change,
        onFocus:this.focus,
        onBlur:this.blur,
        className:`ui-${eleType}`
      });
  }
  textareaChange=(dom)=>{
    let tH=this.state.textareaHeight;
    if(this.firstHeight==0){
      this.firstHeight=dom.offsetHeight;
    }
    dom.style.height=this.firstHeight+'px';
    tH=dom.scrollHeight;
    dom.style.height=tH+'px';
  }
  clearValue=(event)=>{
    this.change(event,"")
  }
  render() {  
    let {focus,value}=this.state;
    return  (
      <div className="ui-input-wrap">
        {this.rendInputHtml()}
        {focus&&value?<i onClick={(event)=>{this.clearValue(event)}} className="iconfont icon-cuowu"></i>:""}
      </div>
    )
  }
}

export default  regComp(InputEle, ['text','email','password','phone','num','textarea'],{valueType:'string'});
export const Input = InputEle;
