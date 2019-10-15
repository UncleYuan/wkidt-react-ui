import React, { Component, createElement } from 'react';
import { regComp } from './higherOrders/FormItem';
import tools from '../tools/public_tools';
import { FileSingle } from './FileSingle';
import Toast from './Toast';
import plupload from 'plupload';
import Modal from './Modal';
import Qiniu from 'qiniu';

const previewImage = function (file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
  if (!file || !/image\//.test(file.type)) return; //确保文件是图片
  if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
    var fr = new mOxie.FileReader();
    fr.onload = function () {
      callback(fr.result);
      fr.destroy();
      fr = null;
    }
    fr.readAsDataURL(file.getSource());
  } else {
    var preloader = new mOxie.Image();
    preloader.onload = function () {
      preloader.downsize(300, 300);//先压缩一下要预览的图片,宽300，高300
      var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
      callback && callback(imgsrc); //callback传入的参数为预览图片的url
      preloader.destroy();
      preloader = null;
    };
    preloader.load(file.getSource());
  }
}


class FileGroupQuickEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      modalShow: false,
      waitUpImg: []
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
      { title: "video", extensions: "mp4,avi" },
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

    if (nextProps.value instanceof Array && nextProps.value.toString() != this.state.value.toString()) {

      this.setState({ value: nextProps.value });
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
            func: () => { this.setQiniu(setType); },
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
          if (!tools.filterObjVal(window.qiniuGetJsTokenFuncArr, name, "name")) {
            window.qiniuGetJsTokenFuncArr.push(
              {
                func: () => { this.setQiniu(setType); },
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
        'FilesAdded':  (up, files)=> {
          let {waitUpImg}=this.state;
          let startLen=waitUpImg.length;
          let _this=this;
          for(let i = 0, len = files.length; i< len; i++){
            !function(i){
              previewImage(files[i],function(imgsrc){
                waitUpImg.push({name:files[i].name,value:imgsrc,stateName:"准备上传",id:files[i].id})
                _this.setState({waitUpImg});
              })
            }(i);
          }
        },
        'BeforeUpload': function (up, file) {
          // 每个文件上传前，处理相关的事情
        },
        'UploadProgress': (up, file) => {
          // 每个文件上传时，处理相关的事情
          this.setState({ proc: file.percent })
        },
        'FileUploaded': (up, files, info) => {

          let { waitUpImg, value } = this.state;
          for (let i in waitUpImg) {
            if (files.id == waitUpImg[i].id) {
              delete waitUpImg[i].stateName;
              try {
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var sourceLink = domain + "/" + res.key; //获取上传成功后的文件的Url
                waitUpImg[i].value = res.url;
                console.log(res.key)
                waitUpImg[i].key = res.key;
              } catch (e) {
                console.log(e)
                waitUpImg[i].value="err.png";
              }
              value.push(waitUpImg[i]);
              waitUpImg.splice(i, 1);
            }
          }
          this.setState({ waitUpImg, value }, () => {
            this.onValueChange(value);
          });
         
        },
        'Error': function (up, err, errTip) {
          //上传出错时，处理相关的事情
          if (err.code == -601) {
            Toast.show({ msg: "您上传的文件类型不对，请重新选择" });
          }

        },
        'QueueChanged': function (uploader, file) {
          //队列文件处理完毕后，处理相关的事情
         // uploader.start();
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
  componentWillUnmount() {
    if (this.upFileObj && this.upFileObj.destroy) this.upFileObj.destroy();
  }

  onValueChange = (imgValue) => {
    let { onValueChange } = this.props;

    if (onValueChange) {
      onValueChange(imgValue);
    }
  }
  renderFileItem = () => {
    let { value } = this.state;

  }
  toggleModal = () => {
    this.setState({ modalShow: !this.state.modalShow })
  }
  upDataSelImg = (obj) => {

  }
  delItem = (t) => {
    let setVal = null;
    if (t == "all") {
      setVal = []
      this.setState({ value: [] })
    } else {
      let { value } = this.state;
      value.splice(t, 1);
      setVal = value;
      this.setState({ value })
    }
    this.onValueChange(setVal);
  }
  startUpload = () => {
    let { waitUpImg } = this.state;
    if (waitUpImg.length == 0) {
      Toast.show({ msg: "请先选择您要上传的图片" });
      return;
    } else {
      waitUpImg.forEach((obj, i) => {
        waitUpImg[i].stateName = "正在上传...";
      })
      this.setState({ waitUpImg }, () => {
        this.upFileObj.start();
      })

    }

  }
  render() {
    let { modalShow, waitUpImg, value } = this.state;
    let { name, readOnly } = this.props;
    return (
      <div className="file-group ">
        {(() => {
          if (waitUpImg.length > 0) {
            return (
              <div className="group-row">
                <div className="group-tit">上传中的图片</div>
                {waitUpImg.map((obj, idx) => {
                  return (
                    <FileSingle key={idx} readOnly={true} value={obj.value} title={obj.stateName} name={"wait" + idx} />
                  )
                })}
              </div>
            )
          }
        })()}
        {(() => {
          if (value.length > 0) {
            return (
              <div className="group-row">
                <div className="group-tit">已经上传图片</div>
                {value.map((obj, idx) => {
                  return (
                    <div key={idx} className="group-successed-item">
                      <FileSingle readOnly={true} value={obj.value} title={obj.name} name={"successed" + idx} />
                      {!readOnly ? <i className="iconfont icon-cuowu close-icon" onClick={() => { this.delItem(idx); }}></i> : ""}
                      {!readOnly ? <span className="eidt-btn" title="点击编辑图片说明" onClick={() => { this.delItem(idx); }}></span> : null}
                    </div>

                  )
                })}
              </div>
            )
          }
        })()}
        {(() => {
          if (!readOnly) {
            return (
              <div >
                <div id={name} className="btn btn-info">添加图片</div>
                <div onClick={() => { this.startUpload(); }} className="btn btn-info ml10">开始上传</div>
                {(() => {
                  if (value.length > 0) {
                    return (<a href="javascript:;" onClick={() => { this.delItem('all'); }} className="btn-warn btn ml10">清除所有</a>)
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
export default regComp(FileGroupQuickEle, ['file-group-quick'], { valueType: 'Array' });
export const FileGroupQuick = FileGroupQuickEle;