import React, { Component, createElement } from 'react';
import { regComp } from './higherOrders/FormItem';
import tools from '../tools/public_tools';
import { FileSingle } from './FileSingle';
import Toast from './Toast';
import Modal from './Modal';
import PicLightBox from './PicLightBox';
import Form from './Form';
import { FileGroupQuick } from './FileGroupQuick';
const formDataSingle = [
  {
    "label": "上传图片",
    "value": "",
    "width": 200,
    "height": 150,
    "name": "url",
    "type": "file-single"
  },
  {
    "name": "remark",
    "label": "图片备注",
    "value": "",
    "type": "textarea"
  }
]
const formDataGroup = [
  {
    "label": "",
    "value": "",
    "width": 200,
    "isLabel":false,
    "height": 150,
    "name": "url",
    "type": "file-group-quick"
  }
]
class ImgUploadGroupEle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      modalShow: [false, false, false],
      editItemForm: this.newForm(),
      openImgIdx: 0
    }
    this.editIdx = null;
    this.editKey = false;
  }
  static defaultProps = {
    value: [],
    url: '/attachment.do',
    width: false,
    height: false,
    upLoadType: "group",
    title: "图片集",
    isShowEditList: false
  };
  componentWillMount() {

  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.value instanceof Array && JSON.stringify(nextProps.value) != JSON.stringify(this.state.value)) {
      this.setState({ value: nextProps.value });
    }
  }
  componentDidMount() {


  }
  componentWillUnmount() {

  }
  newForm = (typeSingle = false) => {
    let { upLoadType } = this.props;
    let newForm = tools.deepCopy(upLoadType == "single" || typeSingle ? formDataSingle : formDataGroup);
    newForm[0].getKeyFunc = this.getKey;
    return newForm;
  }
  getKey = (key, type) => {
    this.editKey = key;
  }
  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
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
  RendEditItemHtml = ( type = "normal") => {
    let isEdit = true;
    let {value}=this.state;
    return value.map((obj, idx) => {
      return (
        <div className="file-item comp mr20 " style={{ "position": "relative" }} key={idx} >
          <i className="iconfont icon-cuowu close-icon pointer fs24" onClick={() => { this.delectImgItem(idx); }} style={{ "display": "block !important" }}></i>
          <div className="item-in" style={{ "width": "200px", "height": "150px", "lineHeight": "150px" }} >
            <div className="img-show" ><img src={obj.url} alt="" /></div>
            <div className="success-box"  >
              <i style={{ "color": "#eee", "textShadow": "0 0 5px rgba(0,0,0,0.5)" }} onClick={() => { this.itemEdit(idx); }} className={"iconfont fs36 icon-xiugai"}  ></i>
            </div>
          </div>
          <div className="file-name"   >
            {obj.remark || "图片" + (idx + 1)}
          </div>
        </div>
      )
    })
  }
  delectImgItem = (i) => {
    let { value } = this.state;
    value.splice(i, 1);
    this.setState({ value });
    this.onValueChange(value);
  }
  itemEdit = (i) => {
    this.editIdx = i;
    let { value, editItemForm } = this.state;
    let newForm = this.newForm(true);
    newForm[0].value = value[i].url;
    newForm[1].value = value[i].remark;
    this.setState({ editItemForm: newForm });
    this.toggleModal(1);

  }
  filterImgList = (images) => {
    let imgArr = [];
    let textArr = [];
    if (images && images.length && images.length > 0) {
      for (let i in images) {
    
          imgArr.push(images[i].url || "");
          textArr.push(images[i].remark || "");
        
        
      }
    }
    return {
      imgList: imgArr,
      infoList: textArr
    }
  }
  openPicBox = (i) => {
    let { openImgIdx } = this.state;
    if (openImgIdx != i) {
      openImgIdx = i;
      this.setState({ openImgIdx });
    }
    this.toggleModal(0);
  }
  turnSelectPicBox = (i) => {
    this.setState({ openImgIdx: i })
  }
  filterImgGroup=(data)=>{
    let newArr=[];
    for(let i  in data){
      newArr.push({url:data[i].value,remark:data[i].name,key:data[i].key});
    }
    return newArr;
  }
  subEdit = (data) => {

    let { upLoadType } = this.props;
    if (!data.url) {
      Toast.show({ msg: "请上传图片" });
      return;
    }
    let { value } = this.state;
    let setVal=tools.deepCopy(value);
    if (upLoadType == "single"||this.editIdx!== null) {
      if (this.editIdx !== null) {
        setVal[this.editIdx] = data;
        if (this.editKey) setVal[this.editIdx].key = this.editKey;
        
      } else {
        if (this.editKey) data.key = this.editKey;
        setVal.push(data);
      }
    }else{
      let newValue=this.filterImgGroup(data.url);
      setVal=setVal.concat(newValue);
    }
    Toast.show({ msg: "添加成功" });
    this.setState({ value :setVal},()=>{
      this.onValueChange(setVal);
    });
    
    this.toggleModal(1);
  }
  addItem = () => {
    this.editIdx = null;
    if(this.props.upLoadType!="single"){
      let newForm = this.newForm();
      this.setState({ editItemForm: newForm },()=>{
         this.toggleModal(1);
      });
    }else{
      this.toggleModal(1);
    }
    
  }
  render() {
    let { modalShow, waitUpImg, value, openImgIdx, editItemForm } = this.state;
    let { name, readOnly, title, width, height, upLoadType } = this.props;
    let picbox = this.filterImgList(value);
    let setStyle = {};
    let valueRight = value && value.length && value.length > 0;
    if (width) setStyle.width = Number(width);
    if (height) setStyle.height = Number(height);
    return (
      <div className="img-upload-group-wrap " style={setStyle}>
        <div className="car-img-light-box">
          {(() => {
            if (!readOnly) {
              return (
                <div>
                  <Modal title="编辑图片项" show={modalShow[2]} onClose={() => { this.toggleModal(2); }}>
                    {modalShow[2] ? this.RendEditItemHtml() : null}
                  </Modal>
                  <Modal zIndex={1050} title={upLoadType == "single" ? "编辑图片集" : "上传多张图片"} show={modalShow[1]} onClose={() => { this.toggleModal(1); }}>
                    {modalShow[1] ? <Form rendForm={false} formStyle="ver" formRendData={editItemForm} onSubForm={this.subEdit} ></Form> : null}
                  </Modal>
                </div>
              )
            }
          })()}
          <PicLightBox title="查看图片" onSelectImg={this.turnSelectPicBox} imgList={picbox.imgList} infoList={picbox.infoList} idx={openImgIdx} show={modalShow[0]} onClose={() => { this.toggleModal(0); }} ></PicLightBox>
          {valueRight ? <div className="txt-bg"><span className="fr">{value.length}张</span>{title}</div> : ""}
          <div className="btn-box">
            {valueRight ? <a href="javascript:;" onClick={() => { this.openPicBox(0) }} className="iconfont  icon-fangdajing" ></a> : null}
            {valueRight && !readOnly ? <a href="javascript:;" onClick={() => { this.toggleModal(2) }} className="iconfont  icon-xiugai" ></a> : null}
            {!readOnly ? <a href="javascript:;" onClick={() => { this.addItem(); }} className="iconfont  icon-jia" ></a> : null}
          </div>
          <img className="img-resize pointer img-first" src={valueRight ? value[value.length - 1].url : "/admin/img/noimg.png"} alt="" />
        </div>
      </div>
    );
  }
};
export default regComp(ImgUploadGroupEle, ['img-upload-group'], { valueType: 'Array' });
export const ImgUploadGroup = ImgUploadGroupEle;