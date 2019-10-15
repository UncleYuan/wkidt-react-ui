import React,{Component,createElement} from 'react';
import { regComp } from './higherOrders/FormItem';
import $ from 'jquery';
import WebUploader from 'webuploader';
import tools from '../tools/public_tools';
import Modal from './Modal';
let upFileObj=null;
let imgSrc 
class FileSingleEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proc:props.value?100:0,
      value:props.value,
      modalShow:false
    }
  }
  static defaultProps={ 
    value:"",
    title:"",
    readOnly:false,
    url:'/attachment.do',
    fileType:'pic',
    swfSrc:'/lib/Uploader.swf',
    onValueChange:function(){

    },
    filterData:function(data){
      console.log(data);
      return data.data[0].url;
    },
    name:"file"+(new Date()).valueOf()
  };
  componentWillMount() {
    
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value!=this.state.value){
  
      this.setState({value:nextProps.value});
    }
  }
  componentDidMount () {
    let {readOnly,url,swfSrc,name,filterData}=this.props
    if(readOnly) return;

    let _this=this;
    upFileObj=WebUploader.create({             
      auto: true,// swf文件路径
      swf:swfSrc , // 文件接收服务端。                           
      server: url,
      pick: '#'+name,
      fileNumLimit : 1,
      resize: false
    });

    upFileObj.on('uploadSuccess',(file,response)=>{
      this.file=file;
   
      let imgValue=filterData(response);

      this.setState({value:imgValue},()=>{
        if (imgValue) {
          this.onValueChange(imgValue); 
        }
      });
      
    });

    upFileObj.on('uploadProgress', ( file , percentage )=>{ 
        this.setState({proc:percentage*100})

        // if (percentage==1) {
        //   console.log(imgSrc)
        //    _this.postData(imgSrc);
        // }

    });

    upFileObj.on('fileQueued', (file)=> {
      
    });
    
  }

  onValueChange=(imgValue)=>{

    let {onValueChange}=this.props;

    onValueChange(imgValue)
  }

  componentWillUnmount () {

    if(upFileObj&&upFileObj.destroy)upFileObj.destroy();
  }
  openSelFile=()=>{
    if(this.file)upFileObj.removeFile(this.file);
    $('#'+this.props.name+" .webuploader-element-invisible").trigger('click')
  }
  toggleModal=()=>{
    Modal.show({conf:{title:"查看图片"},child:<img src={this.state.value} alt=""/>})
    //this.setState({modalShow:!this.state.modalShow})
  }
  filterShowImg=(type)=>{
    let {value}=this.state;
    let showImg="";
    if(type){
      switch(type){
        case "jpg":case "png":case "jpeg":case "pic":
        showImg=value;
        break;
        case "pdf":
        showImg="/images/pdf.png";
        break;
        case "word":
        showImg="/images/word.png";
        break;
      }
    }
    return showImg;
  }
  render() {
    let {value,proc,modalShow}=this.state;
    let {readOnly,title,fileType}=this.props;
        proc=80-(proc/100*80);
    let style={top:proc};

    /*let urlArr=value.split('.');*/
    let showImg=this.filterShowImg(fileType);
    
	  return (
      <div className={"file-item "+(this.state.value?"comp":"")}>
       
        <div className="item-in">
          <div id={""+this.props.name} ></div>
          <div className="img-show">
            {showImg?<img src={showImg} alt=""/>:""}
          </div>
          <i onClick={this.openSelFile} className="iconfont icon-xiao64">+</i>
          <div className="success-box" >
            <a href="javascript:;"  onClick={this.toggleModal} className="iconfont  icon-fangdajing"></a> 
            {readOnly?"":<a href="javascript:;"  onClick={this.openSelFile} className="iconfont icon-xiugai"></a>}
          </div>
          <div className="item-bg" style={style} ></div>
        </div>
        <div className="file-name" title={title} >{title||"未命名"}</div>
     </div>
    );
	}
};
export default regComp(FileSingleEle, ['file-single'],{valueType:'string'});
export const FileSingle = FileSingleEle;



