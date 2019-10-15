import React, {
  Component,
  PropTypes
} from 'react';
import $ from 'jquery';
import Loading from '../components/Loading';
import DragBox from '../components/DragBox';

var WebUploader = require('webuploader');
var upFileObj=null;
var  arrIndexOf = function(arr,val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) return i;
  }
  return -1;
};

const btnStyle={"position":"relative","overflow":"hidden","height":"23px","verticalAlign":"top"}
const defaultProps={ 
  value:"",
  title:"",
  name:"",
  selImg:"",
  loading:true,
};
class ImageCut extends Component {
  constructor(props) {
      super(props);

      this.dragData=null;
      this.state = {
          selImg:this.props.selImg,
          waitUpImgObj:[],
          wrapWidth:0
      };
      
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selImg!=this.state.selImg){
      this.setState({selImg:nextProps.selImg});
    }
    if(nextProps.show!=this.state.show && nextProps.show){
      this.setState({wrapWidth:this.refs.curImgBox.clientWidth});
    }
  }
  componentDidMount() {

    let _this=this;
    _this.setState({wrapWidth:_this.refs.curImgBox.clientWidth});
    upFileObj=WebUploader.create({             
      auto: true,// swf文件路径
      swf: '/js/Uploader.swf', // 文件接收服务端。                           
      server: '/Member/Public/uploadImg',
      pick: '#'+this.props.name,
      resize: false
    });
    upFileObj.on('uploadSuccess',function(file,response){
      let dataState=_this.state.waitUpImgObj;
      for(let i in dataState){
        if(file.id==dataState[i].id){
          dataState.splice(i,1);
        }
      }

      _this.setState({waitUpImgObj:dataState,selImg:response.data[0].url});
      setTimeout(function(){
        _this.setState({wrapWidth:_this.refs.curImgBox.clientWidth});
      },1000)
    });
    upFileObj.on('fileQueued', function( file ) { 
        let dataState=_this.state.waitUpImgObj;
        let idx=dataState.length;
        if(idx==dataState.length){
          dataState.push({name:file.name,stateName:"正在上传..",id:file.id});
        }
        upFileObj.makeThumb(file,function(error,src){
            if(error){
              dataState[idx].stateName='不能预览';
              dataState[idx].src='no_img.png';
              return;
            }
            dataState[idx].src=src;
            _this.setState({waitUpImgObj:dataState});
        },100,100);

      });
   
  }
  componentWillUnmount() {
    
    upFileObj.destroy();
  }
  dragChange=(res)=>{
    this.dragData=res;
  }
  subImg=()=>{
    let postData={
      url:this.state.selImg,
      t_width:this.refs.curImgBox.clientWidth,
      t_height:this.refs.curImgBox.clientHeight,
      rotate:0,
      c_width:this.dragData.data.width,
      c_height:this.dragData.data.height,
      top: this.dragData.data.top,
      left:this.dragData.data.left
    }
    $.post('/Member/Public/uploadImg',postData,(data)=>{
      if(data.code=="SUCCESS"){
        this.props.onSuccess()
      }
    },'json')
  }
  render(){
    let _this=this;
    let LoadingStyle=this.state.loading?{display:"block"}:{display:"none"};

	  return (

            <div>
              <div className="form-item ">
                <div className="item-input-box">
                  <div className="img-list pb15">
                  <div style={LoadingStyle}>
                    <Loading />
                  </div>
                    {this.state.waitUpImgObj.map(function (obj,idx) {
                       return (
                          <div className="img-item"  key={idx}>
                            <i style={{"display":"none"}} className="close iconfont icon-chacha" ></i>
                            <span className="file-status">{obj.stateName}</span>
                            <img src={obj.src}  className="img" alt="" />
                          </div>
                        );
                      })
                    }
                    {(()=>{
                      if(this.state.waitUpImgObj.length==0){
                        return(
                          <div className="cut-img-box" >
                            <div className="box-img" ref="curImgBox">
                              <DragBox className={this.state.selImg?"item-point":"hide"} onItemChange={this.dragChange} wrapWidth={this.state.wrapWidth}></DragBox>
                              <img src={this.state.selImg} alt=""/>
                            </div>
                          </div>
                        )
                      }
                    })()}
                </div>  
                <a href="javascript:;" style={btnStyle} ref="upfileBtn" className="btn mr15 assist-btn" id={this.props.name} >点击上传</a>
                <a href="javascript:;" className="btn base-btn" onClick={this.subImg}>确定</a>
                </div>
              </div>

            </div>
   
            );
	}
};
ImageCut.defaultProps = defaultProps;
module.exports = ImageCut;


