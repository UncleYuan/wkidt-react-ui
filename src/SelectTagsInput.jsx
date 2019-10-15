import React, {
  Component,
  PropTypes
} from 'react';
import Modal from './Modal';
import {SearchFilterList} from './SearchFilterList';
import { regComp } from './higherOrders/FormItem';
import Dom from '../tools/Dom';

class SelectTagsInputEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:typeof(props.value.length)=="number"?props.value:[],
      setName: props.name,
      selTagsList:props.selTagsList||[],
      ModalShow: false
    };
  }
  static defaultProps={ 
    title: "列表详情",
    name: "selTags",
    source:"/user.do",
    selLen: 100,
    value: [],
  };
  componentWillMount() {

    let {value}=this.props;
    if (value && typeof(value.length)=="number") {
      this.setState({
        value
      });
    }
  }
  componentWillReceiveProps(nextProps) {

    if (JSON.stringify(nextProps.value) != JSON.stringify(this.props.value) ) {
      this.setState({
        value: nextProps.value
      });
    }
     if(nextProps.selTagsList && JSON.stringify(nextProps.selTagsList)!=JSON.stringify(this.props.selTagsList) ){
      this.setState({selTagsList:nextProps.selTagsList});
    }
  }
  componentDidMount() {
  }
  getTag=(data)=>{
    for (let i in data) {
      data[i] = {
        "image": data[i],
        "title": ""
      }
    }
    this.setState({
      value: data
    });
  }
  arrToString(arr) {
    let newArr = []
    for (let i in arr) {
      newArr.push(arr[i].value)
    }
    return  newArr.join(',');
  }
  openAllList=()=>{
    this.setState({
      showUpFile: true
    });
  }
  toggleModal=()=>{
    this.setState({
      ModalShow: !this.state.ModalShow
    });
  }
  onSetTagsArr=(value)=>{
    let {onValueChange}=this.props;
    this.setState({value},()=>{
      if(onValueChange)onValueChange(value)
    })
  }
  tagsList=()=>{
    let {value}=this.state;
    console.log(value)
    return value.map((obj,idx)=>{
      return (
        <li key={idx}  className="tag-box gray-tag" >
          <p className="tag-txt">{obj.name} <i onClick={(event)=>{ this.delItem(event,idx);}} className="iconfont icon-cuowu"></i></p>
        </li>
      );
    })

  }
  
  checkTageClick=(dom,c)=>{
    return dom.className.indexOf(c)>=0||Dom.parentNodeByClass(dom,c).length>0
  }
  dropShowFunc=(event)=>{
    let {ModalShow}= this.state;
    if(ModalShow&&!this.checkTageClick(event.target,'tag-box')){
      this.setState({ModalShow:false});
      return;
    }
    if(!this.checkTageClick(event.target,'icon-cuowu')){
      this.setState({ModalShow:true});
    }
    
  }
  delItem=(event,i)=>{
    let {value}=this.state;
    value.splice(i,1);
    this.setState({value},()=>{
      this.props.onValueChange(value)
    })
  }
  render() {
    let {value,ModalShow,selTagsList}=this.state;
    let {title,selLen,source}=this.props;
    let addClass = value.length > 0 ? " focus" : "";

    return (
      <div>
      <div className={"ui-drop-wrap "+addClass} >

        <div className="ui-input-box" ref="select" onClick={(event)=>{ this.dropShowFunc(event); }}>
          <i className="iconfont icon-xia"></i>
          {value.length>0?this.tagsList():"请点击选择标签"}  
        </div>
        

        <Modal title={"选择"+title} sizeClass="m" show={ModalShow} onClose={()=>{this.toggleModal()} }>
          <SearchFilterList selLen={selLen} selTagsList={selTagsList} value={value} onValueChange={this.onSetTagsArr} source={source} title={title} ></SearchFilterList>
        </Modal>
      </div>
      
      </div>
    );
  }
}
export default regComp(SelectTagsInputEle, ['select-tags-input'],{valueType:'Array'});
export const SelectTagsInput = SelectTagsInputEle;
