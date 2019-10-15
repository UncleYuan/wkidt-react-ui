import React, {
  Component,
  PropTypes,
  Children,
  cloneElement,
  createElement
} from 'react';
import tools from '../tools/public_tools';
import {lang} from '../lang';
import FormCtrl from './FormCtrl';
import FormSub from './FormSub';

class Form extends Component {
  constructor(props) {
      super(props);
      this.state = {
        data:props.data||{},
        validate:{}
      };
      this.haveFormSub=false;
  }
  static defaultProps={ 
    data:false,
    className:'',
    formRendData:false,
    labelCol:"col-md-4",
    inputCol:"col-md-8",
    rendForm:true,
    formStyle:"horiz",
    onSubForm:function(){},
    disabled:false
  };
  setValidate=(field,value)=>{
    
    let {validate}=this.state;

    if(tools.isDefinded(field)&&tools.isDefinded(value)){
      if(value.length>0){
        validate[field]=value;
      }else if(validate[field]){
        delete validate[field]
      }
      this.setState({validate});
    }
  }
  getFieldValue=(field=false)=>{
    let {data}=this.state;
    if(typeof field === "string"){
      if(data[field]){
        return data[field];
      }else {
        tools.log('lang.form.noField');
      }
    }else{
      return data;
    }
  }
  setFieldValue=(field,value)=>{
    let {data}=this.state;
    if(typeof field ==="object"){
      this.setState({data:field});
      return;
    }
    if(tools.isDefinded(field)&&tools.isDefinded(value)){
        data[field]=value;
        this.setState({data:data});
    }else {
        tools.log('lang.form.noField');
    }
  }
  bindField=(name,value)=>{

    if(tools.isDefinded(name)&&tools.isDefinded(value)){
      let {data}=this.state;
      if(data[name]!=value){
        data[name]=value;

        this.setState({data:data})
      }
    }else{
      tools.log('lang.form.bindFieldArgErr');
    }
  }

  unbindField=(name)=>{
    let {data}=this.state;
    if(typeof data[name]!=="undefined"){
      delete data[name];
      this.setState({data:data}); 
    }else{
      tools.log('lang.form.noUnbindField');
    }  
  }
  componentWillMount() {
   
  }
  componentWillReceiveProps(nextProps) {
    if(typeof nextProps.data =="object"&&JSON.stringify(nextProps.data)!=JSON.stringify(this.state.data)){
      this.setState({data:nextProps.data});
    }
  }

  renderChildren=(children)=>{
    let { data } = this.state;
    let { disabled } = this.props;
    return Children.map(children,(child)=>{
      if (!child) { return null; }
      if (typeof child === 'string') { return child; }
      let { readOnly } = child.props;
      let props = {
        readOnly: readOnly || disabled
      };
      
      if (child.type === FormSub) {
       let {inputCol,labelCol,layoutType} = child.props;
         props.layoutType=layoutType?layoutType: this.props.formStyle;
        
        props.inputCol=inputCol?inputCol:this.props.inputCol;
        props.labelCol=labelCol?labelCol:this.props.labelCol;

        props.disabled = disabled;
        props.onClick=this.formSubFunc;
        this.haveFormSub=true;
      } else if(child.type === FormCtrl){
        let {inputCol,labelCol,layoutType} = child.props;
        props.layoutType=layoutType?layoutType: this.props.formStyle;
        props.inputCol=inputCol?inputCol:this.props.inputCol;
        props.labelCol=labelCol?labelCol:this.props.labelCol;
        props.transmitForm={
          formData:data,
          setValidate:this.setValidate,
          getFieldValue:this.getFieldValue,
          setFieldValue:this.setFieldValue,
          bindField:this.bindField,
          unbindField:this.unbindField
        };
    
      }else if (child.props.children) {
        props.children = this.renderChildren(child.props.children);
      }
        return cloneElement(child, props);
    })
  }
  rendFormItemByData=(formData)=>{
    let formCtrlArr=[];
    let { disabled ,inputCol,labelCol,formStyle} = this.props;
    formData.forEach((obj,idx)=>{
      let transmitForm={
          formData:this.state.data,
          setValidate:this.setValidate,
          getFieldValue:this.getFieldValue,
          setFieldValue:this.setFieldValue,
          bindField:this.bindField,
          unbindField:this.unbindField
      };

      obj.readOnly= obj.readOnly || disabled;
      obj.inputCol= obj.inputCol || inputCol;
      obj.labelCol= obj.labelCol || labelCol;
      obj.layoutType=formStyle;
     
      formCtrlArr.push(<FormCtrl transmitForm={transmitForm}  key={idx} {...obj}></FormCtrl>)
    })
    return formCtrlArr;
  } 
  formSubFunc=()=>{
    let {onSubForm}=this.props;
    let {data}=this.state;
    
    onSubForm(tools.deepCopy(data));
  }
  render(){
    let {children,formStyle,className,formRendData,disabled,rendForm,inputCol,labelCol}=this.props;
    let matchSize=inputCol.match(/md|sm|lg/g);
    let lcSize=matchSize[0]?"label-ctrl-"+matchSize[0]:"label-ctrl-md";

    return(
      <div className="form-wrap-box ">
        {
          createElement(
            rendForm?'form':"div",
            {  className: "form " + ("form-" + formStyle) + " " + className+" "+(formStyle=="horiz"?lcSize:"") },
            this.renderChildren(Children.toArray(children)),
            formRendData ? this.rendFormItemByData(formRendData) : "",
            !this.haveFormSub&&!disabled ? createElement(FormSub, { disabled: disabled,inputCol,labelCol,layoutType:formStyle, onClick: this.formSubFunc }) : ""
          )
        }
      </div>
    )
  }
}


export default Form;