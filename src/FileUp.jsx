var React = require('react');
var $= require('jquery');
var WebUploader = require('webuploader');
var upFileObj=null;
var imgSrc 
var FileUp = React.createClass({
	getDefaultProps:function(){
	    return {
	    	value:"",
        title:"",
        eidt:true,
        name:"file"+(new Date()).valueOf(),
	    };
	},
  getInitialState: function() {
      return {
        proc:this.props.value?100:0,
        value:this.props.value
      };
  },
  componentWillReceiveProps:function(nextProps){
    // if(nextProps.value!=this.state.value){
    //   this.setState({value:nextProps.value,proc:nextProps.value?100:0})
    // }
    console.log(nextProps.value)
  },
  componentDidMount: function () {
    if(!this.props.eidt) return;

    var _this=this;
    upFileObj=WebUploader.create({             
      auto: true,// swf文件路径
      swf: '/Public/mall/jscd/lib/webuploader/Uploader.swf', // 文件接收服务端。                           
      server: '/Member/Public/uploadImg',
      pick: '#'+this.props.name,
     /* fileNumLimit:1,*/
      resize: false
    });

    upFileObj.on('uploadSuccess',function(file,response){
      this.file=file;
      _this.setState({value:response.data[0]});
      imgSrc = response.data[0]
      if (response.data[0]) {
         _this.postData(imgSrc);
        
      }
     
    });

    upFileObj.on('uploadProgress', function( file , percentage ) { 
        _this.setState({proc:percentage*100})
        // if (percentage==1) {
        //   console.log(imgSrc)
        //    _this.postData(imgSrc);
        // }

    });

    upFileObj.on('fileQueued', function(file) {
        // if (handler == "Q_EXCEED_NUM_LIMIT") {
        //     alert("只能上传一张图片");
        // }
        
    });
    
  },

  postData:function(imgSrc){
     if (this.props.getValue) {
      this.props.getValue(imgSrc)
    }
  },

  componentWillUnmount: function () {

    upFileObj.destroy();
  },
  openSelFile:function(){

    if(this.file)upFileObj.removeFile(this.file)

    $('#'+this.props.name+" .webuploader-element-invisible").trigger('click')

    
  },
  render: function() {
    var _this=this;
    var proc=80-(this.state.proc/100*80);
    var style={top:proc};
    console.log(this.state.value)
    var urlArr=this.state.value.split('.');
    var type=urlArr.length>1?urlArr[urlArr.length-1]:false;
    var showImg=this.props.value;
    if(type){
      switch(type){
        case "jpg":case "png":case "jpeg":
        showImg=this.state.value+"?imageView2/1/w/100/h/100";
        break;
        case "pdf":
        showImg="/chinaCheck/images/pdf.png";
        break;
        case "word":
        showImg="/chinaCheck/images/word.png";
        break;
      }
    }
    
	  return (


              <div className={"file-item "+(this.state.value?"comp":"")}>
                  <div className="item-in">
                    <div id={""+this.props.name} ></div>
                    <div className="img-show">
                      {showImg?<img src={showImg} alt=""/>:""}
                    </div>
                    <i onClick={this.openSelFile} className="iconfont icon-xiao64">+</i>
                    <div className="success-box" onClick={this.openSelFile}>
                        {/*<a  target="_BLANK" href={this.state.value} className="iconfont icon-paixudigaoicon"></a>
                                                <a href="javascript:;"  onClick={this.openSelFile}  className="iconfont icon-paixugaodiicon"></a>*/}
                    </div>
                    <input type='hidden' name={this.props.name} value={this.state.value} />
                    <div className="item-bg" style={style} onClick={this.openSelFile}></div>
                  </div>

                  <div className="file-name" onClick={this.openSelFile}>{this.props.title||"未命名"}</div>
              </div>


   
            );
	}
});

module.exports = FileUp;


