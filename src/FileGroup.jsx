import React,{Component,createElement} from 'react';
import { regComp } from './higherOrders/FormItem';
import tools from '../tools/public_tools';
import {FileSingle} from './FileSingle';
import Toast from './Toast';
import plupload from 'plupload';
import Modal from './Modal';


const previewImage=function(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if(!file || !/image\//.test(file.type)) return; //确保文件是图片
    if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
      var fr = new mOxie.FileReader();
      fr.onload = function(){
        callback(fr.result);
        fr.destroy();
        fr = null;
      }
      fr.readAsDataURL(file.getSource());
    }else{
      var preloader = new mOxie.Image();
      preloader.onload = function() {
        preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
        var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
        callback && callback(imgsrc); //callback传入的参数为预览图片的url
        preloader.destroy();
        preloader = null;
      };
      preloader.load( file.getSource() );
    } 
}


class FileGroupEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
      modalShow:false,
      waitUpImg:[]
    }
    this.upFileObj=null;

  }
  static defaultProps={ 
    value:[],
    url:'/attachment.do',
    swfSrc:'/lib/Uploader.swf',
    title:"",
    eidt:true,
    max_file_count:25,
    name:"fileGroup"+(new Date()).valueOf(),
    filterData:function(data){

      return data.data.file.url;
    }
  };
  componentWillMount() {
    
  }
  componentWillReceiveProps(nextProps){

    if(nextProps.value instanceof Array &&nextProps.value.toString()!=this.state.value.toString()){
 
      this.setState({value:nextProps.value});
    }
  }
  componentDidMount () {
    let _this=this;
    let {url,name,swfSrc,filterData,max_file_count}=this.props;

    this.upFileObj = new plupload.Uploader({ //实例化一个plupload上传对象
      browse_button : name,
      url :url,
      flash_swf_url : swfSrc,
      silverlight_xap_url : 'Moxie.xap',
      max_file_count:max_file_count
      /*filters: {
        mime_types : [ //只允许上传图片文件
          { title : "图片文件", extensions : "jpg,gif,png" }
        ]
      }*/
    });
    this.upFileObj.init(); //初始化

  
    this.upFileObj.bind('QueueChanged',(uploader,files,response)=>{
      //upFileObj.start();
    });
    this.upFileObj.bind('FileUploaded',(uploader,files,response)=>{
      let {waitUpImg,value}=_this.state;
      for(let i in waitUpImg){
        if(files.id==waitUpImg[i].id){  
          delete waitUpImg[i].stateName;
          waitUpImg[i].src=filterData(JSON.parse(response.response))
          value.push(waitUpImg[i]);
          waitUpImg.splice(i,1);
        }
      }
      _this.setState({waitUpImg,value},()=>{
        _this.onValueChange(value);
      });
      
    });
    this.upFileObj.bind('FilesAdded',function(uploader,files){
      let {waitUpImg}=_this.state;
      let startLen=waitUpImg.length;
      for(let i = 0, len = files.length; i< len; i++){
        !function(i){
          previewImage(files[i],function(imgsrc){
            waitUpImg.push({name:files[i].name,src:imgsrc,stateName:"准备上传",id:files[i].id})
            _this.setState({waitUpImg});
          })
        }(i);
      }
    });
    
  }
  componentWillUnmount () {
    if(this.upFileObj&&this.upFileObj.destroy)this.upFileObj.destroy();
  }

  onValueChange=(imgValue)=>{
    let {onValueChange}=this.props;

    if(onValueChange){
      onValueChange(imgValue);
    }
  }
  renderFileItem=()=>{
    let {value}=this.state;

  }
  toggleModal=()=>{
    this.setState({modalShow:!this.state.modalShow})
  }
  upDataSelImg=(obj)=>{

  }
  delItem=(t)=>{
    let setVal=null;
    if(t=="all"){
      setVal=[]
      this.setState({value:[]})
    }else{
      let {value}=this.state;
      value.splice(t,1);
      setVal=value;
      this.setState({value})
    }
    this.onValueChange(setVal);
  }
  startUpload=()=>{
    let {waitUpImg}=this.state;
    if(waitUpImg.length==0){
      Toast.show({msg:"请先选择您要上传的图片"});
      return ;
    }else{
      waitUpImg.forEach((obj,i)=>{
        waitUpImg[i].stateName="正在上传...";
      })
      this.setState({waitUpImg},()=>{
        this.upFileObj.start();
      })
      
    }
    
  }
  render() {
    let {modalShow,waitUpImg,value}=this.state;
    let {name,readOnly}=this.props;
	  return (
      <div className="file-group ">
        {(()=>{
          if(waitUpImg.length>0){
            return (
              <div  className="group-row">
                <div className="group-tit">上传中的图片</div>
                {waitUpImg.map((obj,idx)=>{
                  return (
                    <FileSingle key={idx} readOnly={true} value={obj.src} title={obj.stateName} name={"wait"+idx} />
                  )
                })}
              </div>
            )
          }
        })()}
        {(()=>{
          if(value.length>0){
            return (
              <div className="group-row">
                <div className="group-tit">已经上传图片</div>
                {value.map((obj,idx)=>{
                  return (
                    <div key={idx} className="group-successed-item">
                      <FileSingle  readOnly={true} value={obj.src} title={obj.name} name={"successed"+idx} />
                        {!readOnly?<i className="iconfont icon-cuowu close-icon" onClick={()=>{ this.delItem(idx); }}></i>:""}
                    </div>
                    
                  )
                })}
              </div>
            )
          }
        })()}
        {(()=>{
          if(!readOnly){
            return(
              <div >
                <div  id={name} className="btn btn-info">添加图片</div>
                <div  onClick={()=>{ this.startUpload(); }} className="btn btn-info ml10">开始上传</div>
                {(()=>{
                  if(value.length>0){
                    return (<a href="javascript:;"  onClick={()=>{ this.delItem('all'); }} className="btn-warn btn ml10">清除所有</a>)
                  }
                })()}
              </div>
            )
          }
        })()}
        
        
      </div>
    );
	}
};
export default regComp(FileGroupEle, ['file-group'],{valueType:'Array'});
export const FileGroup = FileGroupEle;