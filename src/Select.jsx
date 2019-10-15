/** 
* @fileOverview react checkbox组件封装 
* @author <a href="">pan</a> 
* @version 0.1 
*/
/** 
* @author pan 

* @description react Select组件封装  
* @since version 0.1 
* @param  Props {Array} value           Select组件的值,从外部传入可直接表单回填 
* @param  Props {String} defaultTitle   未选择时的默认标题 
* @param  Props {String} name           组件的name 
* @param  Props {String} type           select组件的类型目前支持  select-single,select-multiple
* @param  Props {Array} options         渲染的选项数据[{title:'',value:''}]
* @param  Props {Function} onSelEnd     从外部传入事件，当value改变时调用，可向外部传参
* @param  Props {Array} chooseArr       选中的选项的数组
* @param  Props {Number} selLen         设置多选时最多可选择的个数
*/

import React, { Component, createElement } from 'react';
import { regComp } from './higherOrders/FormItem';
import validate from './validate/validate';
import tools from '../tools/public_tools';
import { Input } from './Input';
import Dom from '../tools/Dom';
import CntoEn from '../tools/CntoEn';

const tranCnToEnCode = function (arr) {
  arr.forEach((obj, idx) => {
    arr[idx].filter = CntoEn(arr[idx].name)[0];
  })
  return arr;
}
const turnOtionsFilter = function (arr, search) {
  let newOptions = arr.slice(0);
  return search ? tranCnToEnCode(newOptions) : newOptions;
}
class SelectEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      dropShow: props.dropShow,
      options:turnOtionsFilter(props.options, props.search)
    }
    this.dropShowClass = "openUp";
    
  }
  static defaultProps = {
    value: [],
    defaultTitle: "请点击选择",
    options: [],
    showStyle: 'drop',
    dropShow: false,
    selLen: 1000,
    dataSource: false,
    valueShowTel: function (obj) {
      return `${obj.name}`;
    },
    showClear: true,
    autoHide: true,
    name: "",
    searchValue: "",
    search: false,
    source:false,
    checkradioStyle: "normal",
    readOnly: false,
    type: "select-single"
  };
  componentWillMount() {
    Dom.removeEvent(document, 'click', this.hideDropFunc);
    if(this.props.source){
      this.getOptionsList();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value instanceof Array && nextProps.value.toString() != this.props.value.toString()) {
     
      this.setState({ value: nextProps.value });
    }
    let nextStr = JSON.stringify(nextProps.options);
    let propsStr = JSON.stringify(this.props.options);

    if (nextProps.options instanceof Array && nextStr != propsStr) {
      this.setState({options:turnOtionsFilter(nextProps.options, nextProps.search)});
    }
  }
  componentWillUnmount = () => {
    Dom.removeEvent(document, 'click', this.hideDropFunc);
  }
  getOptionsList=()=>{
    let {source,search}=this.props;
     fetch(source, {
      method: "get",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          try{
             this.setState({options:turnOtionsFilter(data.data, search)});

          }catch(e){
            console.log("返回数据格式不正确");
          }
        }
      })
  }
  chooseReset = (value) => {
    let {options} = this.props;
    for (let i in options) {
      if (options[i].val == value) {

        this.chooseRadio(i);
        return;
      }
    }
  }
  checkIndex = (arr, obj) => {
    let {valueTel} = this.state;
    let idx = -1;
    arr.forEach((o, i) => {
      if (o == obj) {
        idx = i;
        return;
      }
    })
    return idx;
  }
  choose = (i) => {
    let {readOnly,  selLen, onValueChange, type} = this.props;
    let {value,options} = this.state;
    if (readOnly || options[i].disabled) { return }
    let chooseVal = options[i].value;
    let haveIdx = this.checkIndex(value, chooseVal);
    if (haveIdx < 0) {
      if (type == "select-multiple" && selLen <= value.length) {
        value.shift();
      } else if (type == "select-single") {
        value = [];
      }
      value.push(chooseVal);

      if (options[i].parentValue) {
        let parentSearch = tools.filterObjVal(options, options[i].parentValue, 'value');
        let full = true;
        parentSearch.data.connect.forEach((c, idx) => {
          if (this.checkIndex(value, c) < 0) {
            full = false;
          }
        })
        if (full) {
          value.push(options[i].parentValue);
        }
      }
      if (options[i].connect && options[i].connect.length > 0) {
        options[i].connect.forEach((obj, idx) => {
          if (this.checkIndex(value, obj) < 0) {
            value.push(obj)
          }
        })
      }
    } else {
      if (options[i].parentValue) {
        let parentIdx = this.checkIndex(value, options[i].parentValue);
        if (parentIdx > 0) { value.splice(parentIdx, 1); }
      }
      if (options[i].connect && options[i].connect.length > 0) {
        options[i].connect.forEach((obj, idx) => {
          value = tools.removeArr(value, obj);
        })
      }

      value = tools.removeArr(value, chooseVal);
    }
    this.setState({ value }, () => {
      if (onValueChange) onValueChange(value)
    });

  }

  getHtml = (type) => {
    let {readOnly, checkradioStyle, search, valueShowTel} = this.props;
    let {searchValue,options, value} = this.state;


    searchValue = searchValue ? searchValue.toUpperCase() : searchValue;
    return options.map(function (obj, i) {
      let selClass = tools.indexOf(value, obj.value) >= 0 ? "selected" : "";
      let addClass = selClass ? "icon-zhengque" : "";
      let disabledClass = readOnly || obj.disabled ? " disabled" : "";

      let liObj = (
        <li key={i} onClick={() => { this.choose(i); }} className={"select-row " + selClass + disabledClass}>
          <i className={"iconfont " + addClass}></i><p className={"select-txt " + (obj.className ? obj.className : "")} >{valueShowTel(obj)}</p>
        </li>
      );
      if (!search || !searchValue || obj.filter.indexOf(searchValue) >= 0 || obj.name.indexOf(searchValue) >= 0) {
        return liObj;
      }


    }, this);
  }
  hideDropFunc = (event) => {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    let parentDom = Dom.parentNodeByClass(event.target, 'ui-drop-box');
    let {type} = this.props;
    
    if (parentDom.length == 0 || type == "select-single" && event.target.className.indexOf('ui-input') < 0) {
      this.setState({ dropShow: false });
    }

  }
  dropShowFunc = () => {
    let {readOnly} = this.props;
    if (readOnly) return;
    let {dropShow} = this.state;
    this.getDropShowClass();
    if (dropShow) {
      this.setState({ dropShow: false });
      return;
    }

    this.setState({ dropShow: true });
    Dom.removeEvent(document, 'click', this.hideDropFunc);
    Dom.addEvent(document, 'click', this.hideDropFunc)
  }
  getDropShowClass = () => {
    let {select, selectBox} = this.refs;
    this.dropShowClass = selectBox.offsetHeight + select.offsetHeight + Dom.GetRect(select).top < Dom.getViewPortSize().h ? "openDown" : "openUp";
  }
  changeSearchValue = (val) => {
    this.setState({ searchValue: val });
  }
  toText = (arr) => {
    let {valueShowTel} = this.props;
    let {options}=this.state;
    let textArr = [];
 
    options.forEach((obj, idx) => {
      arr instanceof Array && arr.forEach((o, i) => {

        if (o === obj.value) {
          textArr.push(valueShowTel(options[idx]));
        }
      })
    })
    return textArr;
  }
  clearValue = () => {
    this.setState({ value: [] })
  }
  render() {
    let {value, dropShow, searchValue} = this.state;
    let {inline, type, search, showStyle, showClear, readOnly,defaultTitle} = this.props;
    let chooseText = this.toText(value);
    let showStyleClass = showStyle == "drop" ? (dropShow ? this.dropShowClass : "") : "openStyle";
    let readOnlyClass = readOnly ? "disabled" : "";
    return (
      <div className={"ui-drop-wrap " + showStyleClass}  >
        <div className={"ui-input-box " + readOnlyClass} ref="select" onClick={() => { if (showStyle == "drop") { this.dropShowFunc(); } }}>
          <i className="iconfont icon-xia"></i>
          {chooseText.length > 0 ? chooseText.join(',') :defaultTitle}

        </div>
        <div className="ui-drop-box" ref="selectBox">
          {search ? (<div className="search-box">
            <Input  changeType="upData" domDisabled={!dropShow} value={searchValue}
              onValueChange={this.changeSearchValue}

              placeholder="请输入您要搜索的选项"></Input>
          </div>) : ""}
          <ul className="ui-drop-ul">
            {this.getHtml(type, searchValue)}
          </ul>
          {showClear ? (<div className="footer-btn-box" >
            <a className="btn footer-btn" onClick={() => { this.clearValue(); }}>清除所有</a>
          </div>) : ""}
        </div>

      </div>
    );
  }
}
export default regComp(SelectEle, ['select-single', 'select-multiple'], { valueType: 'Array' });
export const Select = SelectEle;



