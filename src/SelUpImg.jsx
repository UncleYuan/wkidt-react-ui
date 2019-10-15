var React = require('react');
var UpImgFileM = require('../components/UpImgFileM');
var Modal = require('../components/Modal');
var InputEle = require('../components/InputEle');
var SelUpImg=React.createClass({
  getDefaultProps:function(){
      return {
        value:"",
          title:"我上传过的的图片",
          name:"selUpFile",
          selLen:3,
          imgArr:[],
          ifBindSP:false,
        };
    },
  getInitialState:function(){

      return {
          showUpFile:false,
          imgList:this.props.imgArr,
          setName:this.props.name,
          setText:"",
          modalShow:[false,false],
          showTextModal:false
      };
  },
  getImg:function(data){
     for(var i in data){
      data[i]={
        "image":data[i],
        "title":""
      }
    }
    this.setState({imgList:data});
  },
  componentWillMount:function(){
    if(this.props.value){
      this.setState({imgList:this.props.value});
    }
  },
  componentDidMount: function () {


  },
  toggleModal:function(n,v){
    let nowModalState=this.state.modalShow;
    nowModalState[n]=v?v:!nowModalState[n];
    this.setState({modalShow:nowModalState})
  },
  arrToString:function(arr){
    var newArr=[]
    for(var i in arr){
      newArr.push(JSON.stringify(arr[i]))
    }
    return "["+newArr.join(',')+"]";
  },
  openUpFile:function(){
    this.setState({showUpFile:true});
    this.toggleModal(0)
  },
  openSetText:function(idx){
    this.textIdx=idx;
    this.setState({showTextModal:true,setText:this.state.imgList[idx].title});
  },
  setTextChange:function(data){
    this.setState({setText:data});
  },
  closeSetText:function(){
    this.setState({showTextModal:false});
  },
  setTextFn:function(){
    var data=this.state.imgList
    data[this.textIdx].title=this.state.setText;
    this.setState({imgList:data,showTextModal:false});
  },
  render: function () {
    var addClass=this.state.imgList.join(',')!=""?" focus":"";
    var val=this.arrToString(this.state.imgList);
    return (
      <div>
      <div className={"pt15 form-item ubdb2 fuzzy-border pb30 mb10"+addClass} >
         <div className="img-list">
         <div className="item-tit  mb15 ">{this.props.title}</div>
              <input type='hidden' name={this.props.name} value={val}/>
              {this.state.imgList.map(function(obj,idx){
                  return (
                     <div key={idx} className="img-item" >
                      <div className="bg" onClick={this.openSetText.bind(this,idx)}>
                        {obj.title==""?"点击这里设置图片对应的标题文字":obj.title}
                      </div>
                      <img src={obj.image}  className="img" alt="" />
                    </div>
                  );
              },this)}
          </div>
        <a className="btn base-btn" onClick={this.openUpFile} > {this.state.imgList.length>0?"修改图片":"选择图片"} </a>    
        <UpImgFileM  name={this.state.setName} show={this.state.modalShow[0]}  onClose={this.toggleModal.bind(this,0,false)} getImgArr={this.getImg} selLen={this.props.selLen}   title={this.props.title} />
        <div className="input-bottom-line" ></div>
      </div>
      <Modal name={this.state.setName+'Text'} ifBindSP="true"  onClose={this.closeSetText} show={this.state.showTextModal}>
            <InputEle title="请输入你要的添加的文字" value={this.state.setText} valChange={this.setTextChange} type="textarea" />
            <div className="pt15 pb15">
              <a className="btn base-btn" onClick={this.setTextFn} >确定</a>
            </div>
        </Modal>
      </div>
    );
  }
})

module.exports = SelUpImg;


