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
import { regComp } from './higherOrders/FormItem';
import validate from './validate/validate';
import tools from '../tools/public_tools';
import {Input} from './Input';
import Dom from '../tools/Dom';
import CntoEn from '../tools/CntoEn';

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
class TagsEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:props.value||[],
      dropShow:props.dropShow,
      searchValue:"",
      tagsArr:[],
      addValue:""
    }
    this.dropShowClass="openUp";
    this.options=turnOtionsFilter(props.options,props.search);
  }
  static defaultProps={ 
    value:[],
    title:"",
    options:[],
    showStyle:'drop',
    dropShow:false,
    showClear:true,
    selLen:1000,
    dataSource:false,
    valueShowTel:function(obj){
      return `${obj.name}`;
    },
    source:false,
    autoHide:true,
    name:"",
    searchValue:"",
    search:false,
    checkradioStyle:"normal",
    disabled:false
  };
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value instanceof Array &&nextProps.value.toString()!=this.props.value.toString()){
      this.setState({value:nextProps.value});
    }
    if(nextProps.options instanceof Array &&nextProps.options.toString()!=this.props.options.toString()){
      this.options=turnOtionsFilter(nextProps.options,nextProps.search);
    }
  }
  chooseReset=(value)=>{
      let {options}=this.props;
      for(let i in options){
        if(options[i].val==value){

          this.chooseRadio(i);
          return;
        }
      }
  }
  checkIndex=(arr,obj)=>{
    let {valueTel}=this.state;
    let idx=-1;
    arr.forEach((o,i)=>{

      if(o.name==obj.name&&o.value==obj.value){
        idx=i;
        return;
      }
    })
    return idx;
  }
  choose=(i)=>{
      let {disabled,tagsArr,selLen,onValueChange}=this.props;
      let {value}=this.state;
      if(disabled || typeof tagsArr[i]!="undefined"&& tagsArr[i].disabled){ return }
      let chooseObj=tagsArr[i];
      let haveIdx=this.checkIndex(value,chooseObj);
      if(haveIdx< 0){
        if(selLen<=value.length){
          value.shift();
        }
        value.push(chooseObj)
      }else{
        value.splice(haveIdx,1);
      }

      this.setState({value},()=>{
        if(onValueChange) onValueChange(value)
      });

  }
  
  getTags=(val)=>{
    let {disabled,checkradioStyle,search,valueShowTel,source}=this.props;
    let {addValue,value}=this.state;
      if(!source){
        return ('');
      }
      fetch(source+"&"+tools.parseParam({keyword:val,len:6}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        if(data.code=="SUCCESS"){
          this.setState({
            tagsArr:data.data
          })
        }else if(data.code=="NO_DATA"){
          this.setState({
            tagsArr:[]
          })
        }
      })
  }
  hideDropFunc=(event)=>{
    window.event? window.event.cancelBubble = true : event.stopPropagation();
    let parentDom=Dom.parentNodeByClass(event.target,'ui-drop-box');
    if(parentDom.length==0 ) {
      this.setState({dropShow:false});
    }
  }
  checkTageClick=(dom,c)=>{
    return dom.className.indexOf(c)>=0||Dom.parentNodeByClass(dom,c).length>0
  }
  dropShowFunc=(event)=>{
    let {dropShow}= this.state;
      this.getDropShowClass();
    if(dropShow&&!this.checkTageClick(event.target,'tag-box')){
      this.setState({dropShow:false});
      return;
    }
    if(!this.checkTageClick(event.target,'icon-cuowu')){
      this.setState({dropShow:true});
    }
    
    Dom.removeEvent(document,'click',this.hideDropFunc);
    Dom.addEvent(document,'click',this.hideDropFunc)
  }
  getDropShowClass=()=>{
    let {select,selectBox}=this.refs;
    this.dropShowClass=selectBox.offsetHeight+select.offsetHeight+Dom.GetRect(select).top < Dom.getViewPortSize().h ?"openDown":"openUp";
  }
  changeInputValue=(name,val)=>{
    
    this.setState({[name]:val});
  }

  
  tagsList=()=>{
    let {value}=this.state;
    return value.map((obj,idx)=>{
      return (
        <li key={idx}  className="tag-box gray-tag" >
          <p className="tag-txt">{obj.name} <i onClick={(event)=>{ this.delItem(event,idx);}} className="iconfont icon-cuowu"></i></p>
        </li>
      );
    })

  }

  delItem=(event,i)=>{
    let {value}=this.state;
    value.splice(i,1);
    this.setState({value},()=>{
      this.props.onValueChange(value)
    })
  }
  addTags=()=>{
    let {addValue,value}=this.state;
    if(addValue){
      value.push({
        name:addValue,
        value:(new Date()).valueOf()
      })
      this.setState({
        value,
        addValue:''
      },()=>{
        this.props.onValueChange(value)
      })
    }
  }
  getTagArrHtml=()=>{
    let {tagsArr,value}=this.state;
    let {valueShowTel}=this.props;
    return tagsArr.map((obj,idx)=>{
        let filterSel=tools.filterObjVal(value,obj.id,'value');
        let selClass=filterSel&&filterSel.idx>=0?"selected":"";
       return (
        <li key={idx} onClick={ ()=>{ this.choose(idx);} } className={"tag-box "+selClass}>
          <p className="tag-txt">{valueShowTel(obj)}</p>
        </li>
      );
    })
  }
  clearValue=()=>{
    this.setState({value:[]})
  }
  render() {
      let {value,dropShow,searchValue,addValue}= this.state;
      let {inline,search,showStyle,showClear}=this.props;

      let showStyleClass=showStyle=="drop"?(dropShow?this.dropShowClass:""):"openStyle";
      return (
        <div className={"ui-drop-wrap "+showStyleClass}  >
              <div className="ui-input-box" ref="select" onClick={(event)=>{if(showStyle=="drop"){ this.dropShowFunc(event);} }}>
                <i className="iconfont icon-xia"></i>
                {value.length>0?this.tagsList():"请点击选择标签"}
                
              </div>
                <div className="ui-drop-box" ref="selectBox">
                  <div className="input-group-wrap">
                      <Input  value={addValue} 
                      onValueChange={(val)=>{ this.changeInputValue('addValue',val)}}
                      onUpData={(val)=>{ if(this.props.source){
                        this.getTags(val);
                         }}}
                      placeholder="请输入您要添加的标签"></Input>
                      <div className="group-bar"><a href="javascript:;" onClick={()=>{ this.addTags() }} className="btn btn-info ">添加</a></div>
                 
                  </div>
             
                  <ul className="ui-drop-ul">
                    {this.getTagArrHtml()}
                  </ul>
                  {showClear?(<div className="footer-btn-box" >
                    <a className="btn footer-btn" onClick={()=>{ this.clearValue(); }}>清除所有</a>
                  </div>):""}
                </div>
                 
        </div>
      );
    }
  }
export default  regComp(TagsEle, ['tags'],{valueType:'Array'});
export const Tags = TagsEle;



