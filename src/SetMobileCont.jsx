import React, { Component, createElement } from 'react';
import { regComp } from './higherOrders/FormItem';
import tools from '../tools/public_tools';
import Dom from '../tools/Dom';
import Form from './Form';
import { Select } from './Select';
import Modal from './Modal';
const config = [
  {
    tit: '文字',
    type: 'txt',
    form: [{
      label: "文字内容",
      name: "text",
      type: 'textarea'
    },
    {
      label: "文字大小",
      name: "fontSize",
      type: 'num'
    }],
    temp: function (data) {

      let arr = data.text.split(/[\n\r]/);
      return arr.map((obj, idx) => {
        return (
          <p className="text-item" style={{ fontSize: data.fontSize || '16px',textIndent:'2em' }}> {obj}</p>
        )
      })

    }
  },
  {
    tit: '图片',
    type: 'img',
    form: [
      {
        label: "图片",
        name: "src",
        type: 'file-single'
      },
      {
        label: "图片链接",
        type: 'text',
        name: "link",
      }
    ],
    temp: function (data) {
      return (
        <div className="img-item">
          <a href={data.link} className="img-item-a">
            <img src={data.src} alt="" />
          </a>
        </div>

      )
    }
  },
  {
    tit: '视频',
    type: 'video',
    form: [
      {
        label: "视频标题",
        name: "text",
        type: 'text'
      },
      {
        label: "文字大小",
        name: "fontSize",
        type: 'num'
      },
      {
        label: "视频链接",
        type: 'text',
        name: "link",
      }
    ],
    temp: function (data) {
      return (
        <div className="img-item">
          <p className="text-item" style={{ fontSize: data.fontSize }}> {data.text}</p>
          <iframe src={data.link}>
            {/*<a href= className="img-item-a"></a>*/}
          </iframe>
        </div>

      )
    }
  },

]
const getOption = function (conf) {
  conf.forEach((obj, idx) => {
    checkRadio.push({ name: obj.tit, value: idx })
  })
}
let checkRadio = [];
getOption(config);
const moveArr = {
  swapItems: function (arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },
  upRecord: function (arr, $index) {
    if ($index == 0) {
      return;
    }
    this.swapItems(arr, $index, $index - 1);
  },
  downRecord: function (arr, $index) {
    if ($index == arr.length - 1) {
      return;
    }
    this.swapItems(arr, $index, $index + 1);
  }
}
class SetMobileContEle extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'Form';
    this.state = {
      showUpFile: false,
      imgList: this.props.imgArr,
      value: this.props.value,
      showAddModal: false,
      addType: [],
      setText: ""
    }
    this.getEditType = "add";
    this.formRandData = [];
    this.getEditIdx = false;
  }
  static defaultProps = {
    value: [],
    title: "我上传过的的图片",
    name: "SetMobileCont",
    selLen: 100,
    imgArr: [],
    ifBindSP: false,
    contentArr: []
  }
  getImg = (data) => {
    let {contentArr} = this.state;
    if (this.getImgType == "add") {
      for (let i in data) {
        contentArr.push({ type: 'img', src: data[i] })
      }
    } else if (!isNaN(this.getImgType)) {
      let idx = this.getImgType;
      let start = 1;
      for (let i in data) {
        contentArr.splice(idx, start, { type: 'img', src: data[i] });
        start = 0;
        idx++;
      }
    }
    this.setState({ contentArr: contentArr, imgList: [], showUpFile: false });
  }
  toggleModalShow = () => {
    let {showAddModal} = this.state;
    this.setState({ showAddModal: !showAddModal })
  }
  componentWillMount() {

  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) != JSON.stringify(this.props.value)) {
      this.setState({ value: nextProps.value })
    }
  }
  componentDidMount() {
    this.textIdx = false;
  }
  delItem = (i) => {
    let {value} = this.state;
    let {onValueChange} = this.props;
    value.splice(i, 1);
    this.setState({ value }, () => {
      onValueChange(value)
    });
  }
  moveItem = (idx, type) => {
    let {value} = this.state;
    let {onValueChange} = this.props;
    if (type == "up") {
      moveArr.upRecord(value, idx);
    } else if (type == "down") {
      moveArr.downRecord(value, idx);
    }
    this.setState({ value }, () => {
      onValueChange(value)
    })
  }
  openEditItem = (type = "new", idx = false) => {
    if (type === "new") {
      this.setState({ addType: [] })
      this.toggleModalShow();
      this.getEditType = "add";
      this.getEditIdx = false;
    } else if (type == "edit") {
      let {value} = this.state;
      let nowData = value[idx];
      this.setState({ addType: [] }, () => {
        this.formRandData = this.getFormRenderData(config[nowData.confIdx].form, nowData)
        this.setState({ addType: [nowData.confIdx] })
        this.toggleModalShow();
        this.getEditType = "edit";
        this.getEditIdx = idx;
      })

    }
  }
  addTypeChange = (val) => {

    this.formRandData = this.getFormRenderData(config[val[0]] ? config[val[0]].form : [])
    this.setState({ addType: val })
  }
  getFormRenderData = (formPrototype, data = false) => {
    let formData = JSON.parse(JSON.stringify(formPrototype));
    if (data) {
      formData.forEach((obj, idx) => {
        if (data[obj.name] !== "undefined") {
          obj.value = data[obj.name];
        }
      })
    }
    return formData;
  }
  getForm = (data) => {
    let {addType, value} = this.state;
    let {onValueChange} = this.props;
    if (this.getEditType == "edit") {
      value[this.getEditIdx] = {
        confIdx: addType[0],
        type: config[addType[0]].type,
        ...data
      }
    } else {
      value.push({
        confIdx: addType[0],
        type: config[addType[0]].type,
        ...data
      })
    }
    this.setState({ value }, () => {
      onValueChange(value)
    })
    this.toggleModalShow();
  }
  render() {
    let { addType, value} = this.state;

    return (

      <div className="ui-setContBox">
        {value.map(function (obj, idx) {
          return (
            <div key={idx} className={config[obj.confIdx].type + "-box item-box"}>
              {config[obj.confIdx].temp(obj)}
              <div className="edit_mask">
                <span className="vm_box"></span>
                <a href="javascript:;" className="iconfont icon-shang" onClick={this.moveItem.bind(this, idx, 'up')}></a>
                <a href="javascript:;" className="iconfont icon-xia" onClick={this.moveItem.bind(this, idx, 'down')}></a>
                <a href="javascript:;" className="iconfont icon-xiugai" onClick={() => { this.openEditItem("edit", idx); } }></a>
                <a href="javascript:;" className="iconfont icon-shanchu" onClick={this.delItem.bind(this, idx)}></a>
              </div>
            </div>
          );

        }, this)}
        <div className="addBtnBox">
          <i className="jia-btn iconfont icon-xiao64"></i>
          <div className="item-btn-box" onClick={() => { this.openEditItem("new") } }>

            <div className="item-btn" >
              <i className="iconfont icon-jia"></i>
              <span className="item-name">添加内容项</span>
            </div>
          </div>
        </div>
        <Modal title="添加项" show={this.state.showAddModal} sizeClass="sm" onClose={() => { this.toggleModalShow() } }>

          <Select showClear={false} options={checkRadio} value={addType} showStyle="open" onValueChange={(val) => { this.addTypeChange(val) } } />
          {(() => {
            if (typeof config[addType[0]] !== "undefined") {
              return (
                <div className="mt15">
                  <Form rendForm={false} formStyle={"ver"} formRendData={this.formRandData} onSubForm={this.getForm} ></Form>
                </div>
              )
            }
          })()}


        </Modal>
      </div>

    );
  }
}

export default regComp(SetMobileContEle, ['set-mobile-cont'], { valueType: 'Array' });
export const SetMobileCont = SetMobileContEle;


