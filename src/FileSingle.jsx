import React, { Component, createElement } from 'react';
import { regComp } from './higherOrders/FormItem';
import plupload from 'plupload';
import Qiniu from 'qiniu';

import tools from '../tools/public_tools';
import PicLightBox from './PicLightBox';
import Toast from './Toast';

let imgSrc
class FileSingleEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proc: props.value ? 100 : 0,
      value: props.value,
      upFiling: false,
      modalShow: false
    }
    this.upFileObj = null;
  }
  static defaultProps = {
    value: "",
    title: "",
    readOnly: false,
    height: 70,
    core: "qiniu",//|| "plupload"
    width: 70,
    url: '/attachment.do',
    fileType: 'img',
    getKeyFunc: function () { },
    swfSrc: 'Moxie.swf',
    imgTypeSrc: {
      "pdf": "/images/pdf.png",
      "word": "/images/word.png",
      "video": "/images/video.png",
    },
    onValueChange: function () {

    },
    fileTypeAll: [
      { title: "img", extensions: "jpg,gif,png" },
      { title: "pdf", extensions: "pdf" },
      { title: "video", extensions: "mp4,avi,mp3" },
      { title: "zip", extensions: "zip,rar" }
    ],
    filterData: function (data) {
      // return data.data[0].url;
      return data.data.file.url;
    },
    name: "file" + (new Date()).valueOf()
  };
  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.props.value) {
      let setData = { value: nextProps.value };
      if (!this.state.value) {
        setData.proc = 100;
      }
      this.setState(setData);
    }
  }
  componentDidMount() {
    let { readOnly, url, swfSrc, name, filterData, fileType, fileTypeAll, core } = this.props
    if (readOnly) return;
    let _this = this;
    let typeArr = fileType.split(',');
    let setType = [];
    typeArr.map((obj, idx) => {
      fileTypeAll.map((o, i) => {
        if (o.title == obj) {
          setType.push(o);
        }
      })
    })
    if (core == "plupload") {
      this.setPlupload(setType);
    } else if (core == "qiniu") {
      if (window.qiniuJsToken) {
        this.setQiniu(setType);
      } else {

        if (!window.qiniuGetJsTokenFuncArr || window.qiniuGetJsTokenFuncArr.length == 0) {
          window.qiniuGetJsTokenFuncArr = [];
          window.qiniuGetJsTokenFuncArr.push({
            func:() => { this.setQiniu(setType);},
            name
          })
          fetch('/system/qiniu-upload-token.do', {
            method: "get",
            credentials: 'same-origin'
          }).then(response => response.json())
            .then((data) => {
              window.qiniuJsToken = data.uptoken;
              console.log(window.qiniuGetJsTokenFuncArr)
              for (let i in window.qiniuGetJsTokenFuncArr) {
                window.qiniuGetJsTokenFuncArr[i].func();
              }
              delete window.qiniuGetJsTokenFuncArr;
            })
        } else {
          if(!tools.filterObjVal(window.qiniuGetJsTokenFuncArr,name,"name")){
             window.qiniuGetJsTokenFuncArr.push(
              {
                func:() => { this.setQiniu(setType);},
                name
              }
            )
          }
        }
      }

    } else {
      console.log("core类型错误");
    }
  }
  setQiniu = (setType) => {
    let { readOnly, url, swfSrc, name, filterData, fileType, fileTypeAll } = this.props;
   

    this.upFileObj = Qiniu.uploader({
      runtimes: 'html5,flash,html4',      // 上传模式，依次退化
      browse_button: name,         // 上传选择的点选按钮，必需
      uptoken: window.qiniuJsToken || false,
      // uptoken_url: '/system/qiniu-upload-token.do',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
      get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken

      downtoken_url: '/system/qiniu-attachment.do',
      // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址

      domain: 'oiijeqo69.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
      max_file_size: '100mb',             // 最大文件体积限制
      flash_swf_url: swfSrc,  //引入flash，相对路径

      silverlight_xap_url: 'Moxie.xap',
      max_retries: 3,                     // 上传失败最大重试次数
      chunk_size: '4mb',                  // 分块上传时，每块的体积
      filters: {
        mime_types: setType,
      },
      unique_names: false,
      save_key: false,
      init: {
        'FilesAdded': function (up, files) {
          plupload.each(files, function (file) {
            // 文件添加进队列后，处理相关的事情
          });
        },
        'BeforeUpload': function (up, file) {
          // 每个文件上传前，处理相关的事情
        },
        'UploadProgress': (up, file) => {
          // 每个文件上传时，处理相关的事情
          this.setState({ proc: file.percent })
        },
        'FileUploaded': (up, file, info) => {
          this.file = file;
          let fileTypeArr = file.name.split('.');
          let fileType = [fileTypeArr[fileTypeArr.length - 1]];
          try {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var sourceLink = domain + "/" + res.key; //获取上传成功后的文件的Url

            this.setState({ value: res.url, upFiling: false, proc: 100 }, () => {
              if (res.url) {
                this.onValueChange(res.url, res.key, fileType);

              }
            });
          } catch (e) {
            Toast.show({ msg: "上传失败" })
            this.setState({ value: "", upFiling: false, proc: 0 }, () => {
              this.onValueChange("", false, fileType);
            });
          }
        },
        'Error': function (up, err, errTip) {
          //上传出错时，处理相关的事情
          if (err.code == -601) {
            Toast.show({ msg: "您上传的文件类型不对，请重新选择" });
          }

        },
        'QueueChanged': function (uploader, file) {
          //队列文件处理完毕后，处理相关的事情
          uploader.start();
        },
        "UploadFile": (uploader, files) => {
          this.setState({ upFiling: true });
        },
        'Key': function (up, file) {

          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在unique_names: false，save_key: false时才生效

          let type = file.name.indexOf('.') > 0 ? file.name.split('.')[file.name.split('.').length - 1] : "";

          var key = file.id + "." + type;
          // do something with key here
          return key
        }
      }
    });

  }
  setPlupload = (setType) => {
    let { readOnly, url, swfSrc, name, filterData, fileType, fileTypeAll } = this.props;
    this.upFileObj = new plupload.Uploader({ //实例化一个plupload上传对象
      browse_button: name,
      url: url,
      flash_swf_url: swfSrc,
      silverlight_xap_url: 'Moxie.xap',
      multi_selection: false,
      filters: {
        mime_types: setType,
      }

    });
    this.upFileObj.init(); //初始化

    this.upFileObj.bind('FileUploaded', (uploader, files, response) => {
      this.file = files;
      try {
        let imgValue = filterData(JSON.parse(response.response));
        this.setState({ value: imgValue, upFiling: false, proc: 100 }, () => {
          if (imgValue) {
            this.onValueChange(imgValue);
          }
        });
      } catch (e) {
        Toast.show({ msg: "上传失败" })
        this.setState({ value: "", upFiling: false, proc: 0 }, () => {
          this.onValueChange("");
        });
      }

    });
    this.upFileObj.bind('UploadFile', (uploader, files) => {
      this.setState({ upFiling: true });
    });
    this.upFileObj.bind('UploadProgress', (uploader, file) => {
      this.setState({ proc: file.percent })
    });
    this.upFileObj.bind('QueueChanged', (uploader, files, response) => {
      uploader.start();
    });

    this.upFileObj.bind('Error', (uploader, errObject) => {
      if (errObject.code == -601) {
        Toast.show({ msg: "您上传的文件类型不对，请重新选择" });
      }
    });
  }

  onValueChange = (imgValue, key = false, type = "") => {

    let { onValueChange, getKeyFunc } = this.props;
    getKeyFunc(key, type);
    onValueChange(imgValue, key)
  }

  componentWillUnmount() {
    if (this.upFileObj && this.upFileObj.destroy){
      this.upFileObj.destroy();
      this.upFileObj=null;
      console.log(this.upFileObj)
    } 
  }
  openSelFile = () => {
    let btnDom = document.getElementById(this.props.name);
    if (this.file) this.upFileObj.removeFile(this.file);
    if (document.all) {
      btnDom.click();
    } else {
      let evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      btnDom.dispatchEvent(evt);
    }
  }
  toggleModal = () => {

    PicLightBox.show({ conf: { title: "查看图片", imgList: [this.state.value], idx: 0 } })
  }
  filterShowImg = (type) => {
    let { imgTypeSrc } = this.props;
    let { value } = this.state;
    let showImg = "";
    if (type) {
      if ("jpg,png,jpeg,img".indexOf(type) >= 0) {
        showImg = value;
      } else {
        showImg = imgTypeSrc[type] ? imgTypeSrc[type] : ""
      }
    }
    return showImg;
  }
  render() {
    let { value, proc, modalShow, upFiling } = this.state;
    let { readOnly, title, fileType, width, height } = this.props;
    proc = 100 - proc;
    let style = { top: proc + "%" };
    let showImg = this.filterShowImg(fileType);
    return (
      <div className={"file-item " + (this.state.value ? "comp" : "")}>

        <div className="item-in" style={{ width, height, lineHeight: parseInt(height) + "px" }}>

          <div className="img-show">
            {showImg && value ? <img src={showImg} alt="" /> : ""}
          </div>
          <i className={"iconfont " + (readOnly && value == "" ? "icon-cubanwutu" : "icon-upload")} title={readOnly && value == "" ? "无图片" : "请点击上传"} id={"" + this.props.name}></i>
          <div className="success-box" >
            <a href="javascript:;" onClick={() => { if (fileType == "img") { this.toggleModal(); } else { window.open(value) } }} className="iconfont  icon-fangdajing"></a>
            {readOnly ? "" : <a href="javascript:;" onClick={this.openSelFile} className="iconfont icon-xiugai"></a>}
          </div>
          <div className="item-bg" style={style} ></div>
        </div>
        <div className="file-name" title={title} >{upFiling ? "上传中.." : (title || (readOnly ? "" : (value ? "可编辑" : "请上传")))}</div>
      </div>
    );
  }
};
export default regComp(FileSingleEle, ['file-single'], { valueType: 'string' });
export const FileSingle = FileSingleEle;



