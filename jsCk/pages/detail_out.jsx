
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';
import Modal from '../../src/Modal';
import Pager from '../../src/Pager';
import Form from '../../src/Form';
import Loading from '../../src/Loading';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';

import FormCtrl from '../../src/FormCtrl';
import FormSub from '../../src/FormSub';
import FileSingle from '../../src/FileSingle';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import { InputGroup } from '../../src/InputGroup';
import Panel from '../../jsCk/comp/Panel';
import { FileGroup } from '../../src/FileGroup';
import ZcdetailsFiles from './zcDetails_files';
import ZcDetailsAuditlog from './zcDetails_auditlog';
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
function sendUpdataUser() {
  if (window.upDataProperFunc) {
    window.upDataProperFunc();
  } else {
    location.reload();
  }
}
const FormDataPro =  //审核
  [{
    "label": "状态选择",
    "value": [],
    "inline": true,
    "type": "radio",
    "name": "status",
    "options": [
      {
        name: "通过",
        value: '1'
      },
      {
        name: "不通过",
        value: '2'
      }
    ]
  },
  {
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
  ]

const applyForm = [
  {
    "label": "表显公里数",
    "value": "",
    "name": "mileage",
    "type": "input-group",
    "barHtml": <span className="btn">万公里</span>
  },
  {
    "label": "上传附件(多图)",
    "value": [],
    "name": "attachment",
    "type": "img-upload-group"
  }
]
const pagePro = {
  page_count: 0,
  page_index: 1,
  record_count: 0
}
const defaultProps = {
};
class DetailOutItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      examineData: {}, //审核数据
      page: tools.deepCopy(pagePro),
      applyForm: tools.deepCopy(applyForm),
      len: 30, //分页长度
      selTab: 0,
      goFormData: [],
      warehouse_noList: [],
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
  }
  componentWillReceiveProps(nextProps) {
  }
  componentWillMount() {

  }
  componentDidMount() {

    this.getExamineData();
    this.getWarehouse_noList();
  }
  getWarehouse_noList = () => {
    fetch(`/property/warehouseeasy.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            warehouse_noList: data.data,

          })
        } else if (data.code == "NO_DATA") {
          this.setState({
            warehouse_noList: []
          })
        }
      });
  }
  getExamineData = () => {
    let { item_id } = this.props;
    let { applyForm } = this.state;
    if (item_id) {
      fetch(`/property/inout/${item_id}.do`, {
        method: "get",
        credentials: 'same-origin'
      }).then(response => response.json())
        .then((data) => {
          if (data.code == "SUCCESS") {
            applyForm[0].value = data.data.mileage;
            applyForm[1].value = data.data.attachment.length <= 0 ? [] : data.data.attachment;
            this.setState({
              applyForm,
              examineData: data.data,
              loading: false
            })
          } else if (data.code == "NO_DATA") {
            this.setState({
              examineData: {}
            })
          }
        });
    } else {
      this.setState({
        loading: false
      })
    }
  }

  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  subSh = (data) => {
    let { proper_id, item_id } = this.props;

    Process.show();
    fetch(`/property2/out.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        property_id: proper_id,
        remark: data.remark,
        status: data.status.join(',')
      })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        this.toggleModal(0);
        if (data.code == "SUCCESS") {
          Modal.show({
            child: <div className="fs14 ">{data.info}</div>,
            conf: {
              footer: (
                <a href="javascript:;" onClick={() => {
                  Modal.close(); location.href = "#/dzzc.html/" + proper_id + "/out/" + (new Date()).valueOf() + '/' + item_id;
                  sendUpdataUser();
                }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }

  setEidtForm = (i, data) => {
    let { goFormData } = this.state;
    if (typeof goFormData[i] == "undefined") {
      goFormData[i] = {};
    }
    goFormData[i].data = data;
    goFormData[i].time = tools.turnDate(new Date(), 'Y-m-d H:i:s');
    this.setState({ goFormData })
  }
  turnTab = (idx) => {
    this.setState({ selTab: idx })
  }
  goSubAllSubAll = (data) => {
    let { goFormData } = this.state;
    let { orderInfo, proper_id, item_id } = this.props;
    Process.show();
    fetch(`/property2/out.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        property_id: proper_id,
        mileage: data.mileage,
        attachment: JSON.stringify(data.attachment)
      })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/dzzc.html/" + proper_id + "/out/" + (new Date()).valueOf() + '/' + (item_id ? item_id : data.data);
          sendUpdataUser();
        }
      })
  }
  openImgModal = (val) => {
    Modal.show({ child: <img src={val} /> })
  }
  render() {
    let { loading, formData, examineData, modalShow, page, len, selTab, goFormData, warehouse_noList, applyForm } = this.state;
    let { order_id, orderInfo, item_id } = this.props;
    formData[1].options = warehouse_noList;
    let isRe = orderInfo.permissions.indexOf('0802') >= 0 && typeof (examineData) !== "undefined" && examineData.status == 0;
    let isSub = orderInfo.permissions.indexOf('0801') >= 0 && !item_id;
    if (loading) {
      return (<Loading></Loading>)
    }
    return (
      <div>
        <div className="mb5 tl">
          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>出库申请</a></li>

              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>操作记录</a></li>
            </ul>
          </div>
        </div>
        <div className="wrapper">

          <div className="white-bg" style={{ display: selTab == 0 ? "block" : "none" }}>
            <h4 className="fs20 desalt-color pl30 pt20 pb15">出库申请</h4>
            <div className="clearfix">
              <div className="col-md-6 md-fr">
                <div className="uba1 fuzzy-border p15 m10">
                  {(() => {
                    if (orderInfo) {
                      let statusNum = examineData.status ? parseInt(examineData.status) : -1;
                      let returnArr = [];
                      if (typeof item_id != "undefined") {
                        let icon = "";
                        let txt = "";
                        let reviewBtn = isRe ? <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-info">出库审核</a> : "";
                        switch (statusNum) {
                          case 0:
                            icon = "icon-shenhezhong assist-color";
                            txt = "已经提交出库申请," + (isRe ? "请审核吧" : "请等待审核吧");
                            break;
                          case 1:
                            icon = "icon-shenhetongguo base-color";
                            txt = "当前出库已经通过审核";
                            break;
                          case 2:
                            icon = "icon-shenheweitongguo contrary-color";
                            txt = "当前出库没有通过审核";
                            break;
                        }
                        returnArr.push(<div><i className={"iconfont fs80 lh1 vm " + icon}></i><div className="pb10 pt10"><div className="fs16 "> {txt}</div>{reviewBtn}</div> </div>)
                        if (statusNum == 1) {
                          returnArr.push(
                            <div>
                              <div className="row">
                                <div className="col-md-3 desalt-color pb10">审核时间：</div>
                                <div className="col-md-9 pb10">{examineData.update_time}</div>
                              </div>
                              <div className="row">
                                <div className="col-md-3 desalt-color pb10">备注：</div>
                                <div className="col-md-9 pb10">{examineData.remark}</div>
                              </div>
                            </div>
                          )
                        }
                        if (statusNum == 2) {
                          returnArr.push(
                            <div>
                              <div className="row">
                                <div className="col-md-3 desalt-color pb10">审核时间：</div>
                                <div className="col-md-9 pb10">{examineData.update_time}</div>
                              </div>
                              <div className="row">
                                <div className="col-md-3 desalt-color pb10">备注：</div>
                                <div className="col-md-9 pb10">{examineData.remark}</div>
                              </div>
                            </div>
                          )
                        }
                      } else {
                        returnArr.push(<div>您尚未提交申请</div>)
                      }
                      if (returnArr.length > 0) {
                        return returnArr;
                      } else {
                        return null;
                      }
                    }
                  })()}
                </div>
              </div>
              <div className="col-md-6 pb30" >
                <Form formRendData={applyForm} onSubForm={this.goSubAllSubAll} disabled={!isSub} >
                  <div className="form-ctrl clearfix" >
                    <div className="form-ctrl-label col-md-4 desalt-color" >车牌号：</div>
                    <div className="form-comp-wrap col-md-8" >
                      <div className="pt7">
                        {orderInfo.product.plate_number}
                      </div>
                    </div>
                  </div>
                  <div className="form-ctrl clearfix" >
                    <div className="form-ctrl-label col-md-4 desalt-color" >车主姓名：</div>
                    <div className="form-comp-wrap col-md-8" >
                      <div className="pt7">
                        {orderInfo.customer.name}
                      </div>
                    </div>
                  </div>
                  <div className="form-ctrl clearfix" >
                    <div className="form-ctrl-label col-md-4 desalt-color" >车型：</div>
                    <div className="form-comp-wrap col-md-8" >
                      <div className="pt7">
                        {orderInfo.model_name}
                      </div>
                    </div>
                  </div>

                  <div className="form-ctrl clearfix" >
                    <div className="form-ctrl-label col-md-4 desalt-color" >车辆品牌：</div>
                    <div className="form-comp-wrap col-md-8" >
                      <div className="pt7">
                        {orderInfo.product.brand_name}
                      </div>
                    </div>
                  </div>
                  <div className="form-ctrl clearfix" >
                    <div className="form-ctrl-label col-md-4 desalt-color" >车身颜色：</div>
                    <div className="form-comp-wrap col-md-8" >
                      <div className="pt7">
                        {orderInfo.product.color}
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>


            {/*<div className="row" style={{ display: (examineData.status == 0 || !item_id ? "block" : "none") }} >
              <div className="form-sub  col-md-6 ">
                <a href="javascript:;" onClick={() => { this.goSubAllSubAll(); }} className="btn  btn-warn block fs16">提交申请</a>
              </div>
            </div>*/}
            <Modal title="审核" show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
              {modalShow[0] ? <Form formStyle="ver" formRendData={formData} onSubForm={this.subSh} /> : ""}
            </Modal>
          </div>

          <div style={{ display: selTab == 1 ? "block" : "none" }}>
            <ZcDetailsAuditlog step={"out"} model="property" add_id={item_id} data_id={typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id}></ZcDetailsAuditlog>
          </div>
        </div>
      </div>

    );
  }
}

export default DetailOutItem;