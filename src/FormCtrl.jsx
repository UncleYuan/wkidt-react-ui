import React, {
  Component,
  PropTypes,
  createElement
} from 'react';
import tools from '../tools/public_tools';
import {COMPONENTS} from '../src/higherOrders/FormItem';
import lang from '../lang/form';

const getName=function(name){
  return name?name:"FormCtrl"+(new Date()).valueOf()+parseInt(Math.random()*(1-99)+99);
}
class FormCtrl extends Component {
  constructor(props) {
      super(props);
      let {name}=this.props;
      this.state = {
        validateStatus:[],
        value:this.filterPropsValue(this.props.defaultValue||this.props.value,props.type)
      };

      this.firstRender=true;
      this.name=getName(name);

  }
  static defaultProps={ 
    readOnly:false,
    required:false,
    isLabel:true,
    inputCol:"",
    labelCol:"",
    type:"text",
    label:'',
    name:"",
    layoutType:"",
    value:""
  };

 
  componentWillMount() {
   
  }
  componentDidMount() {
    this.itemAlready(); 
    this.validateValue(this.state.value);
    
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.type!=this.props.type){
      //this.itemUnmount();
      let oldName=this.name;
      this.name=getName(nextProps.name);
      let value=this.filterPropsValue(nextProps.defaultValue||nextProps.value,nextProps.type)
      this.setState({value},()=>{
        this.itemAlready();
      })
      
    }
    switch(typeof nextProps.value){

      case "string":
        if(nextProps.value!=this.props.value){
          this.itemChange(nextProps.value);
        }
        break;
      case "object":
        if(JSON.stringify(nextProps.value)!=JSON.stringify(this.props.value)){
          this.itemChange(nextProps.value);
        }
        break;
    }
    
  }
  componentWillUnmount() {
    this.itemUnmount(); 
  }
  
  itemAlready=()=>{
    let {transmitForm} =this.props;
    let {value}=this.state;

    if(transmitForm){
      transmitForm.bindField(this.name,value); 
    }
  }
  itemUnmount=()=>{
    let {transmitForm} =this.props;

    if(transmitForm&&transmitForm.formData[this.name]){

      transmitForm.unbindField(this.name); 
    }
  }
  itemChange=(value)=>{
    let {itemChange,transmitForm}=this.props;
    this.setState({value:value})
    this.validateValue(value);
    if(transmitForm){
      transmitForm.setFieldValue(this.name,value);
    }
    if(itemChange)itemChange(value,transmitForm,this.name);
    
  }
  validateValue=(value)=>{
    let {type,max,min,required,error,exp,name,label,transmitForm}=this.props;
    let validateStatus=[]
    required &&validateStatus.push(
        this.validateFunc(
          "required",
          value.length==0,
          `${label}为必填项`
        )
    ); 
    exp&&validateStatus.push(
        this.validateFunc(
          "otherProps",
          !exp.reg.test(value),
          exp.info
        )
      ); 
    max&&validateStatus.push(
        this.validateFunc(
          "max",
          max< value.length,
          `超过最大值${max}`
        )
    ); 
    min&&validateStatus.push(
        this.validateFunc(
          "min",
          min> value.length,
          `少于最小值${min}`
        )
    ); 
    
    this.setState({validateStatus})
    if(transmitForm) this.sendErrMsg(validateStatus);
    
  }

  validateFunc=(name,exp,info="")=>{
    return {
      name:name,
      err:exp,
      info:exp?info:""
    }; 
  }
  sendErrMsg=(validateStatus)=>{
    let allErrMsg=[];
    validateStatus.forEach(function(obj){
      if(obj.err){
        allErrMsg.push({
          type:obj.name,
          info:obj.info
        });
      }
    })
    this.props.transmitForm.setValidate(this.name,allErrMsg);
    
  }
  filterPropsValue=(val,type)=>{
    let valType = COMPONENTS[type].valueType;
    let resVal=val;
    switch(valType){
      case 'Array':
        resVal=val instanceof Array?val:[];
        break;
      case 'string':

        resVal=typeof val==="string"||typeof val==="number"?val:"";
        break;
    }

    return resVal

  }
  renderItem=(type)=>{
    let props=tools.deepCopyProps(this.props);
    props.value=this.state.value;
   // props.value=this.filterPropsValue(this.state.value,type);
    props.name=this.name;
    props.onValueChange=(value)=>{    
      this.itemChange(value)
    }
    return COMPONENTS[type].render(props);
  }
  renderErr=()=>{
    let {validateStatus}=this.state;
    let errMsgInfo=[];
    validateStatus.forEach((obj,idx)=>{
      if(obj.err){
        if(obj.name=="required"&&this.firstRender) return;
          errMsgInfo.push(<div key={idx}><i className="iconfont icon-cuowu "></i> {obj.info}</div>)
        }else{
          //this.firstRender=false
        }
    })
    return errMsgInfo;
  }
  render(){
    let {label,type,required,tip,isLabel,inputCol,labelCol,layoutType}=this.props;
    let errMsg=this.renderErr();
    let ifCol=layoutType=="horiz"&&isLabel;
    if(!COMPONENTS[type]){
      return(
        <div className="form-ctrl" >
          {lang.noFormItem(type)}
        </div>
      )
    }
    
    return(
      <div className={"form-ctrl "+(ifCol?"clearfix":"")} >
        {(()=>{
          if(isLabel){
            return(
              <div className={"form-ctrl-label "+(ifCol?labelCol:"")}>
               {label?label+"：":" "}
              </div>
            )
          }
        })()}    
        <div className={"form-comp-wrap "+(ifCol?inputCol:"")}>
          {this.renderItem(type)}    
          <div className="msg-info ">
            {tip?<div ><i className="iconfont icon-tishi"></i> {tip}</div>:""}
            {errMsg.length>0?<div className="danger-color">{errMsg}</div>:""}
          </div>
        </div>
      </div>
    )
  }
}


export default FormCtrl;