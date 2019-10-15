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
import { Input } from './Input';
import validate from './validate/validate';
class InputGroupEle extends Component {
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
    barHtml:"",
    type:"text",
    changeType:"blur",
    style:false,
    onValueChange:function(){},
  };
  componentWillMount(){
    
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value!=this.props.value){
      this.setState({value:nextProps.value})
    }
  }
  onValueChange=(val)=>{
    this.setState({value:val},()=>{
      let {onValueChange}=this.props;
      onValueChange(val);
    })
  }
  render() {  
   
    let {barHtml,onValueChange,value,...otherProps}=this.props;

    return  (
      <div className="input-group-wrap">
        <Input  value={this.state.value} {...otherProps} onValueChange={(val)=>{ this.onValueChange(val)}}  ></Input>
        <div className="group-bar">{barHtml}</div>
      </div>
    )
  }
}

export default  regComp(InputGroupEle, ['input-group'],{valueType:'string'});
export const InputGroup = InputGroupEle;
