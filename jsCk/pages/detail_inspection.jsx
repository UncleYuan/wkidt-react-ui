
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';
import Modal from '../../src/Modal';
import Form from '../../src/Form';
import Loading from '../../src/Loading';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';

import FormCtrl from '../../src/FormCtrl';
import FileSingle from '../../src/FileSingle';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import { InputGroup } from '../../src/InputGroup';
import Panel from '../../jsCk/comp/Panel';
import { FileGroup } from '../../src/FileGroup';
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
import DetailInspectionItem from './detail_inspection_item';
import ZcdetailsFiles from './zcDetails_files';
import TableList from './public/TableList';
const FormDataPro =  //修改项表单
  [
    {
      "label": "车况评价",
      "value": [],
      "inline": true,
      "type": "radio",
      "name": "status",
      "options": []
    },
    {
      "name": "file",
      "label": "图片",
      "value": "",
      "type": "file-single"
    },
    {
      "name": "remark",
      "label": "备注",
      "value": "",
      "type": "textarea"
    }
  ]

const formData1 =
  [


    {
      "label": "验车选择",
      "value": [],
      "inline": true,
      "type": "cascader",
      "config": [
        {
          name: "Brand",
          url: `https://api.che300.com/service/getCarBrandList?token=`,
          keyName: '',
          type: "jsonp"

        },

        {
          name: "Series",
          url: `https://api.che300.com/service/getCarSeriesList?token=`,
          keyName: 'brandId',
          type: "jsonp"
        },
        {
          name: "Model",
          url: `https://api.che300.com/service/getCarModelList?token=`,
          keyName: 'seriesId',
          type: "jsonp"
        }
      ]
    },
    {

      "label": "相片",
      "value": "",
      "type": "file-group"
    },
    {
      "name": "remarks",
      "label": "验车综评",
      "value": "",
      "type": "textarea"
    }
  ]
const FormReviewDataPro =  //审核表单
  [
    {
      "label": "验车结果",
      "value": [],
      "name": "status",
      "inline": true,
      "type": "radio",
      "options": [
        {
          name: "通过",
          value: 1
        },
        {
          name: "不通过",
          value: 2
        }
      ]
    },
    {
      "label": "车况评级",
      "value": [],
      "name": "level",
      "inline": true,
      "type": "radio",
      "options": [
        {
          name: "一般",
          value: "low"
        },
        {
          name: "良好",
          value: "good"
        },
        {
          name: "优秀",
          value: "high"
        }
      ]
    },
    {
      "name": "attachment",
      "label": "验车截图",
      "value": "",
      "type": "img-upload-group"
    },
    {
      "name": "remark",
      "label": "备注",
      "value": "",
      "type": "textarea"
    }
  ]
const defaultProps = {
};
class DetailInsoection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      selTab: 0,
      inspectionData: [],
      changeItemForm: tools.deepCopy(FormDataPro),
      itemSelectObj: null,
      problemData: [],
      evaluation:"",
      reviewFormData: tools.deepCopy(FormReviewDataPro) //表单数据渲染
    };
    this.openContId = ""
  }
  static contextTypes = {
    orderInfo: React.PropTypes.object,
    getOrderState: React.PropTypes.func
  }
  componentWillReceiveProps(nextProps) {


  }

  componentDidMount() {

    this.setState({ evaluation: this.context.orderInfo.evaluation });
  }
  componentWillMount() {
    this.getInspectionData();
  }

  textChange = (name, val) => {
    let setState = {};
    setState[name] = val;
    this.setState(setState);
  }
  getInspectionData = (callback) => { //获取检验数据
    let { order_id } = this.props;
    fetch(`/order/inspection/data.do?order_id=${order_id}`, {
      method: "get",
      credentials: 'same-origin',
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({ inspectionData: data.data, problemData: data.problem, loading: false })
        } else {
          this.setState({ loading: false })
        }
        if (callback) callback();
      });
  }
  toggleModal = (i,type) => { //切换弹窗显示
    let arr = this.state.modalShow;
    if(typeof type=="undefined"){
      arr[i] = !arr[i];
    }else{
      arr[i] = type;
    }
    this.setState({ modalShow: arr })
  }

  goSubAll = () => {
    let { order_id } = this.props;
    let { evaluation } = this.state;
    if (!evaluation) {
      Toast.show({ msg: "请填写综合评价" });
      return;
    }
    Process.show();
    fetch(`/order/inspection.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        order_id: order_id,
        evaluation
      })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          Modal.show({
            child: <div className="fs14 ">{data.info}</div>,
            conf: {
              footer: (
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/inspection/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }
          })
        }
      });
  }
  turnTab = (idx) => {
    this.setState({ selTab: idx })
  }

  listRendHtml = (obj, idx) => {
    return (
      <tr key={idx}>
        <td>{obj.id}</td>
        <td>{obj.apply_name}</td>
        <td>{obj.user_name}</td>
        <td>{obj.add_time}</td>
        <td>{obj.update_time}</td>
        
        <td className="base-color">{obj.status_name}</td>
        <td><ImgUploadGroup readOnly={true} width="120" height="80" value={obj.attachment}></ImgUploadGroup></td>
        <td>{obj.remark}</td>
      </tr>
    )
  }
  goChangItem = (data, type) => {
    let { order_id } = this.props;
    let { itemSelectObj, problemData } = this.state;

    let addSubData = {
      order_id,
      category: itemSelectObj.pid || problemData.id
    }
    if (itemSelectObj.data_id) {

    }
    if (type == "normal") {
      if (!itemSelectObj.data_id) addSubData.items = itemSelectObj.id;
      data.status = data.status.join(',');
    } else {
      itemSelectObj.data_id
    }
    Process.show();

    fetch(itemSelectObj.data_id ? `/order/inspection/data/${itemSelectObj.data_id}.do` : `/order/inspection/data.do`, {
      method: itemSelectObj.data_id ? "put" : "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign(
        data, addSubData
      ))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
       this.toggleModal(0,false);
       this.getInspectionData(() => {  }) 
      });
  }
  delectItem = (ids) => {

    Process.show();
    fetch(`/order/inspection/data.do`, {
      method: "DELETE",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({ ids })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          this.getInspectionData();
        }
      });
  }
  filterItemForm = (itemData, type) => {
    let { changeItemForm } = this.state;

    if (type == 'normal') {
      var newOption = [];
      itemData.result.split(',').map((o, i) => {
        newOption.push({ name: o, value: o })
      })
      changeItemForm[0].value = itemData.status ? [itemData.status] : [];
      changeItemForm[0].options = newOption;
      changeItemForm[0].type = "radio";
    } else {
      changeItemForm[0].value = itemData.status ? itemData.status : "";
      changeItemForm[0].type = "text";
    }
    changeItemForm[1].value = itemData.file;
    changeItemForm[2].value = itemData.remark;
    this.toggleModal(0);
    this.setState({ changeItemForm, itemSelectObj: itemData })
  }
  itemSelect = (itemData, type) => {
    if (!itemData) {
      itemData = {
        status: "",
        file: "",
        remark: ""
      }
    }
    this.filterItemForm(itemData, type);
  }
  fileSingleValChange = (val, upkey,obj) => {

    this.setState({ itemSelectObj: obj }, () => {
      this.goChangItem({ file: upkey, status: [] }, 'normal')
    })
  }
  rendFileSingle = (child) => {
    return child.map((obj, idx) => {
      let isEdit = this.context.orderInfo.permissions.indexOf('0301') >= 0;
      return (
        <div className="inline-block mr15">
          <FileSingle name={"item" + obj.id} title={obj.name} readOnly={!isEdit} width="200" height="150" value={obj.file} onValueChange={(val, upkey)=>{ this.fileSingleValChange(val, upkey,obj); }} ></FileSingle>
        </div>
      )
    })
  }
  childRendHtml = (child, type = "normal") => {
    let isEdit = this.context.orderInfo.permissions.indexOf('0301') >= 0;
    return child.map((obj, idx) => {
      return (

        <div className="file-item comp mr20 " style={{ "position": "relative" }} key={idx} >
          {type == "err" && isEdit ? <i className="iconfont icon-cuowu close-icon pointer fs24" onClick={() => { this.delectItem(obj.data_id); }} style={{ "display": "block !important" }}></i> : ""}
          <div className="item-in" style={{ "width": "200px", "height": "150px", "lineHeight": "150px" }} >

            {obj.data_id ? <div className="img-show" ><img src={obj.file} alt="" /></div> : ""}
            <div className="success-box"  >
              <i style={{ "color": "#eee", "textShadow": obj.data_id ? "0 0 5px rgba(0,0,0,0.5)" : "none" }} onClick={() => { this.itemSelect(obj, type); }} className={"iconfont fs36 " + (obj.data_id ? "icon-xiugai" : "icon-upload")} title={obj.data_id ? "编辑项目" : "请点击上传"}  ></i>
            </div>
          </div>
          <div className="file-name" title={obj.name}  >
            {obj.name + (type == "normal" ? obj.status : "")}
          </div>
        </div>
      )
    })
  }
  goReview = (data) => {
    let { order_id } = this.props;
    Process.show();
    fetch(`/order/inspection.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        order_id: order_id,
        remark: data.remark,
        level: data.level.join(','),
        attachment: JSON.stringify(data.attachment),
        status: data.status.join(',')
      })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        this.toggleModal(1,false);
        if (data.code == "SUCCESS") {
          Modal.show({
            child: <div className="fs14 ">{data.info}</div>,
            conf: {
              footer: (
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/inspection/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }
  render() {
    let { inspectionData, loading, evaluation, problemData, reviewFormData, modalShow, page, len, selTab, itemSelectObj, changeItemForm } = this.state;
    let { order_id } = this.props;
    let { orderInfo } = this.context;
    let isEdit = orderInfo.permissions.indexOf('0301') >= 0;
    let isSub = orderInfo.permissions.indexOf('0302') >= 0;
    let isReview = orderInfo.permissions.indexOf('0303') >= 0;
    if (loading) {
      return (<Loading></Loading>);
    }
    return (
      <div>
        <Modal title={"编辑" + (itemSelectObj && itemSelectObj.name ? itemSelectObj.name : "")} show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
          {modalShow[0] ? <Form formRendData={changeItemForm} formStyle="ver" disabled={!isEdit} onSubForm={(data) => { this.goChangItem(data) }}></Form> : ""}
        </Modal>
        <Modal title={"验车审核"} show={modalShow[1]} onClose={() => { this.toggleModal(1) }}>
          <Form formRendData={reviewFormData} formStyle="ver" onSubForm={(data) => { this.goReview(data) }}></Form>
        </Modal>
        <div className="mb5 tl">

          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>提交验车资料</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>提交记录</a></li>

            </ul>
          </div>
        </div>
        <div className="wrapper">

          <div className="white-bg p15" style={{ display: selTab == 0 ? "block" : "none" }}>
            <div className="uba1 fuzzy-border p15 mb10">
              {(() => {
                if (orderInfo) {
                  let statusNum = parseInt(orderInfo.check_car_status);
                  if (statusNum > 0) {
                    let icon = "";
                    let txt = "";
                    let reviewBtn = isReview ? <a href="javascript:;" onClick={() => { this.toggleModal(1); }} className="btn btn-info">验车审核</a> : "";
                    switch (statusNum) {
                      case 1:
                        icon = "icon-shenhezhong assist-color";
                        txt = "已经提交验车申请," + (isReview ? "请审核吧" : "请等待审核吧");
                        break;
                      case 2:
                        icon = "icon-shenhetongguo base-color";
                        txt = "当前验车已经通过审核,想了解更多可以查看记录";
                        break;
                      case 3:
                        icon = "icon-shenheweitongguo contrary-color";
                        txt = "当前验车没有通过审核,了解更多可以查看记录";
                        break;
                    }
                    return (<div><i className={"iconfont fs80 lh1 vm " + icon}></i><div className="inline-block vm pl15"><div className="fs16 pb5"> {txt}</div>{reviewBtn}</div> </div>)
                  } else {
                    return (<div>您尚未提交申请</div>)
                  }
                }
              })()}
            </div>
            {inspectionData.map((obj, idx) => {
              return (
                <div key={idx} className="">
                  <div className="gray-bg pt5 pb5 pl10 pr10">{obj.name}</div>
                  <div className="p15">
                    {this.rendFileSingle(obj.child)}
                  </div>
                </div>
              )
            })}
            <div className="">
              <div className="gray-bg pt5 pb5 pl10 pr10">问题项(发现其他的问题的地方)</div>
              <div className="p15">
                {this.childRendHtml(problemData.child, "err")}
                {(() => {
                  if (isEdit) {
                    return (
                      <div className="file-item comp mr20" >
                        <div className="item-in" style={{ "width": "200px", "height": "150px", "lineHeight": "150px" }} >
                          <div className="success-box"  >
                            <i style={{ "color": "#eee" }} onClick={() => { this.itemSelect(null, "err") }} className="iconfont fs36 icon-jia" title="请点击添加"  ></i>
                          </div>
                        </div>
                        <div className="file-name" >
                          点击添加
                  </div>
                      </div>)
                  }
                })()}

              </div>
            </div>
            <div className="">
              <div className="gray-bg pt5 pb5 pl10 pr10">综评(填写验车员对验的车的综合评价)</div>
              <div className="p15">
                <Input type="textarea" value={orderInfo.evaluation} disabled={!isSub} onValueChange={(val) => { this.textChange("evaluation", val) }}></Input>
              </div>
            </div>
            <div className="p10">
              {isSub ? <a href="javascript:;" onClick={() => { this.goSubAll() }} className="btn btn-info w200 fs18">提交验车</a> : ""}
            </div>

          </div>

          <div className="wrapper mb15" style={{ display: selTab == 1 ? "block" : "none" }}>
            <div className="p10 white-bg">
              <TableList url="/order/inspection.do" headTitArr={["记录ID","申请人", "审核人", "提交时间", "回复时间", "验车结果", "查看附件", "回复备注"]} fetchData={{ order_id }} rendHtml={this.listRendHtml}></TableList>
            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default DetailInsoection;