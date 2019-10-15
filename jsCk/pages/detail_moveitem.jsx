
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
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
import ZcdetailsFiles from './zcDetails_files';
import ZcDetailsAuditlog from './zcDetails_auditlog';


const transferFormPro = [

  {
    isLabel: false,
    title: "交接视频",
    type: "file-single",
    imgTypeSrc: { "video": "/admin/img/video.png" },
    fileType: "video",
    width: 200,
    height: 150,
    name: "video"
  },
  {
    isLabel: false,
    title: "交接单",
    type: "img-upload-group",
    width: 200,
    height: 150,
    value: [],
    name: "handover_auth"
  },
  {
    isLabel: false,
    title: "交接图片",
    type: "img-upload-group",
    width: 200,
    height: 150,
    value: [],
    name: "handover_img"
  },
  {
    isLabel: false,
    title: "首期款凭证",
    type: "img-upload-group",
    width: 200,
    height: 150,
    value:[],
    name: "first_auth"
  },
  {
    "name": "remark2",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
]
const MoveInfoFormDataPro =
  [
    {
      "name": "handover_name",
      "label": "交车人",
      "value": "",
      "type": "text"
    },
    {
      "name": "handover_phone",
      "label": "交车人联系方式",
      "value": "",
      "type": "text"
    }
  ];
const LoanRegFormDataPro =
  [{
    "name": "amount",
    "label": "放款额",
    "value": "",
    "type": "input-group",
    "barHtml": <div className="btn gray-bg">万元</div>
  },
  {
    "label": "放款开户行",
    "value": "",
    "name": "bank",
    "type": "text"
  },
   {
    "label": "放款账户",
    "value": "",
    "name": "account_name",
    "type": "text"
  },
   {
    "label": "放款账号",
    "value": "",
    "name": "bank_card",
    "type": "text"
  },
  {
    "name": "time",
    "label": "放款时间",
    "value": "",
    "format": "y-m-d",
    "type": "time-select-input"
  },
  {
    "name": "lending_auth",
    "label": "放款凭证",
    "value": [],
    "type": "img-upload-group"
  },
  {
    "name": "remark4",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
  ];
const ReViewMoveApply = [
  {
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
    "name": "receive_name",
    "label": "接收人",
    "value": "",
    "type": "text"
  },
  {
    "name": "receive_phone",
    "label": "接收人电话",
    "value": "",
    "type": "text"
  },
  {
    "name": "time",
    "label": "时间",
    "value": "",
    "format": "y-m-d",
    "type": "time-select-input"
  },
  {
    "name": "address",
    "label": "地点",
    "value": "",
    "type": "text"
  },
  {
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "textarea"
  },
  {
    "label": "是否移库",
    "value": ['1'],
    "inline": true,
    "type": "radio",
    "name": "is_move",
    "options": [
      {
        name: "移库",
        value: '1'
      },
      {
        name: "不移库",
        value: '2'
      }
    ]
  }
]

const ReViewMoveTrans = [
  {
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
    "name": "remark3",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
];

const pagePro = {
  page_count: 0,
  page_index: 1,
  record_count: 0
}
const defaultProps = {
};

/**
 * 移库交接页面
 * 申请移库，填写交付人信息->审核申请确定接收人->填写交付信息->审核交付信息->放宽登记
 * @class DetailMoveItem
 * @extends {Component}
 */
class DetailMoveItem extends Component {

  constructor(props) {

    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      itemData: {},
      selTab: 0,
      transferForm: tools.deepCopy(transferFormPro),
      LoanRegForm: tools.deepCopy(LoanRegFormDataPro),
      MoveInfoFormData: tools.deepCopy(MoveInfoFormDataPro)
    };
  }
  componentWillReceiveProps(nextProps) {
  }
  componentWillMount() {
  }
  componentDidMount() {
    if (!this.props.item_id) {
      this.addData();
    } else {
      this.upData();
    }
  }
  resetFormData = (orderInfo, form) => {
    for (let i in orderInfo) {
      form_tools.setArrObjVal(form, i, orderInfo[i]);
    }
    return { form };
  }
  addData = () => {
    let { orderInfo } = this.props;
    let { transferForm } = this.state;

    this.setState({
      transferForm,
      loading: false
    })
  }

  upData = (callback) => {
    let { transferForm, LoanRegForm } = this.state;
    let { item_id, orderInfo } = this.props;
    fetch(`/property/move/${item_id}.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          transferForm[0].value = data.data.video;
          transferForm[1].value = data.data.handover_auth;
          transferForm[2].value = data.data.handover_img;
          transferForm[3].value = data.data.first_auth;
          transferForm[4].value = data.data.remark2;
          if (true || data.data.status >= 4) {
            for (let i in data.data) {
              form_tools.setArrObjVal(LoanRegForm, i, data.data[i])
            }
          }
          this.setState({
            itemData: data.data,
            transferForm,
            loading: false
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          this.setState({
            itemData: {},
            loading: false
          })
        }
        if (callback) callback();
      });

  }
  toggleModal = (i) => {
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  subSh = (data, type) => {
    let { proper_id, item_id } = this.props;
    Process.show();
    data.status = data.status.join(',');
    if(type=="first"){ data.is_move= data.is_move.join(',');}
    fetch(type == "first" ? `/property2/move.do` : `/property2/move2.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(
        Object.assign({
          property_id: proper_id,
        }, data)
      )
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        this.toggleModal(type == "first" ? 0 : 1);
        if (data.code == "SUCCESS") {
          Modal.show({
            child: <div className="fs14 ">{data.info}</div>,
            conf: {
              footer: (
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/dzzc.html/" + proper_id + "/moveitem/" + (new Date()).valueOf() + "/" + item_id; tools.sendUpdataUser(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }

  turnTab = (idx) => {
    this.setState({ selTab: idx })
  }
  goApplyTransfer = (data) => {
    let { proper_id, item_id } = this.props;
    Process.show();
    fetch(`/property2/move.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({ property_id: proper_id }, data))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/dzzc.html/" + proper_id + "/moveitem/" + (new Date()).valueOf() + '/' + data.data;
          tools.sendUpdataUser();
        }
      })
  }
  openImgModal = (val) => {
    Modal.show({ child: <img src={val} /> })
  }
  rendText = (obj) => {
    return obj.map((o, i) => {

      return (
        <div key={i} className="col-md-4 pb10">
          <span className="mr10 desalt-color">{o.label}</span>
          {(()=>{

            if(o.name=="is_move"){
              return ( <span>{o.value==1 ? "移库":"不移库"}</span>)
            }else{
              return ( <span>{o.value || "-"}{o.name == "bank_card" ? " 万元" : null}</span>)
            }
          })()}
         

        </div>
      )
    })
  }
  goSubTrans = (subData) => {
    let { orderInfo, item_id, proper_id } = this.props;
    subData.handover_auth=JSON.stringify(subData.handover_auth);
    subData.handover_img=JSON.stringify(subData.handover_img);
    subData.first_auth=JSON.stringify(subData.first_auth);
    Process.show();
    fetch(`/property/move2.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({ id: item_id }, subData))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/dzzc.html/" + proper_id + "/moveitem/" + (new Date()).valueOf() + "/" + item_id;
          tools.sendUpdataUser();
        }
      })
  }
  getTransferInfo = (type = "jiao") => {
    let { itemData } = this.state;
    let { orderInfo } = this.props;
    let newFormData = tools.deepCopy(type == "jiao" ? MoveInfoFormDataPro : ReViewMoveApply);
    let arr = type == "jiao" ? [
      {
        label: "终审额度",
        value: orderInfo.lending_amount + " 万元",
      }
    ] : [];
    for (let i in newFormData) {
      if (newFormData[i].name !== "status") {
        arr.push({
          label: newFormData[i].label,
          name:newFormData[i].name,
          value: itemData[newFormData[i].name]
        })
      }
    }
    return arr;
  }
  goLoanReg = (data) => {

    let { orderInfo, item_id, proper_id } = this.props;
    data.lending_auth = JSON.stringify(data.lending_auth);
    Process.show();
    fetch(`/property/move/lending.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({ property_id: proper_id }, data))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/dzzc.html/" + proper_id + "/moveitem/" + (new Date()).valueOf() + "/" + item_id;
          tools.sendUpdataUser();
        }
      })
  }
  render() {
    let { itemData, loading, formData, modalShow, selTab, MoveInfoFormData, fileArr, transferForm, LoanRegForm } = this.state;
    let { order_id, orderInfo, item_id } = this.props;
    let isRe = orderInfo.permissions.indexOf('0202') >= 0;
    let isReTrans = orderInfo.permissions.indexOf('0204') >= 0;
    let isEditTrans = orderInfo.permissions.indexOf('0203') >= 0;
    let statusNum = typeof itemData.status != "undefined" ? parseInt(itemData.status) : -1;
    let isSub = orderInfo.permissions.indexOf('0201') >= 0 && statusNum == -1;
    let isLend = orderInfo.permissions.indexOf('0205') >= 0;
    if (loading) {
      return (
        <Loading></Loading>
      )
    }
    return (
      <div>
        <div className="mb5 tl">
          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>资产交接</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>放款登记</a></li>
            </ul>
          </div>
        </div>
        <div className="wrapper">
          <div className="white-bg" style={{ display: selTab == 0 ? "block" : "none" }}>
            {(() => {
              if (typeof item_id == "undefined" && isSub) {

                return (
                  <div className="pt15 pb30">
                    <h3 className="fs18 ml10 mb20">申请资产交接</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <Form formStyle="horiz" formRendData={MoveInfoFormData} onSubForm={(data) => { this.goApplyTransfer(data); }} >
                          <div className="form-ctrl clearfix">
                            <div className="form-ctrl-label col-md-4">终审额度：</div>
                            <div className="form-comp-wrap  col-md-8" >
                              <div className="pt7 contrary-color">
                                {orderInfo.lending_amount}万元
                                </div>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                )
              }
            })()}
            {(() => {
              if (statusNum >= 0) {
                let setData = this.getTransferInfo();
                return (
                  <div className="oh">
                    <div className="m15 ubb1 fuzzy-border">
                      <div className="pb15">
                        <h4 className="fs18 desalt-color">交付信息</h4>
                      </div>
                      <div className="row">
                        {this.rendText(setData)}
                        {isRe && statusNum != 2 ? <div className="col-md-4 pb10"><a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-warn">审核申请</a></div> : ""}
                      </div>
                      {statusNum == 2 ? <div className="warn-color">资产交接申请被驳回</div> : null}
                    </div>
                  </div>
                )
              }
            })()}
            {(() => {
              if (statusNum >= 1 && statusNum != 2) {
                let setData = this.getTransferInfo("jie");
                return (
                  <div className="oh">
                    <div className="m15 ubb1 fuzzy-border">
                      <div className="pb15">
                        <h4 className="fs18 desalt-color">接收信息</h4>
                      </div>
                      <div className="row">
                        {this.rendText(setData)}
                      </div>
                      {statusNum == 5 ? <div className="warn-color">交接信息被未通过</div> : null}
                    </div>
                    {(() => {
                      let eidt = false;
                      let rebtn = false;
                      if (itemData.status == 0 || itemData.status == 2||itemData.is_move==2) {
                        return null;
                      }
                      if ((isEditTrans && itemData.status == 1)||(isEditTrans &&itemData.status == 5) ) {
                        eidt = true;
                        rebtn = false;
                      }
                      console.log(isEditTrans)
                      if (!isEditTrans && itemData.status == 1) {
                        eidt = false;
                        rebtn = false;
                      }
                      if (isReTrans && itemData.status == 3) {
                        eidt = false;
                        rebtn = true;
                      }
                      if (!isReTrans && !isEditTrans && itemData.status == 3) {
                        eidt = false;
                        rebtn = false;
                      }
                      return (
                        <Form formStyle="ver" disabled={!eidt} onSubForm={(data) => { this.goSubTrans(data) }} >
                          <div className="p15">
                            <div className="row">
                              {transferForm.map((obj, idx) => {
                                if (idx < 4) {
                                  if(obj.type=="file-single"){
                                     return (<div className="col-md-3 "><FormCtrl  {...obj} /></div>);
                                  }
                                 else {
                                    return (<div className="col-md-3 "><FormCtrl  {...obj} /><div className="desalt-color">{obj.title}</div></div>);
                                 }
                                }
                              })}
                            </div>
                            
                            <FormCtrl  {...transferForm[4]} />
                            <div className="row">
                              <div className="col-md-3">
                                <FormSub />
                              </div>
                              {rebtn ? <div className="col-md-3"><a href="javascript:;" onClick={() => { this.toggleModal(1); }} className="btn btn-warn">审核交接信息</a></div> : null}
                            </div>
                          </div>
                        </Form>
                      )
                    })()}
                  </div>
                )
              }
            })()}
            <Modal title="资产交付申请审核" show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
              {modalShow[0] ? <Form formStyle="ver" formRendData={ReViewMoveApply} onSubForm={(data) => { this.subSh(data, "first") }} /> : null}
            </Modal>
            <Modal title="资产接受申请审核" show={modalShow[1]} onClose={() => { this.toggleModal(1) }}>
              {modalShow[1] ? <Form formStyle="ver" formRendData={ReViewMoveTrans} onSubForm={(data) => { this.subSh(data) }} /> : null}
            </Modal>
            {(() => {
              if (statusNum >= 0) {
                return (
                  <ZcDetailsAuditlog step={"move"} model="property" add_id={item_id} data_id={typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id}></ZcDetailsAuditlog>
                )
              }
            })()}
          </div>
          <div className="white-bg" style={{ display: selTab == 1 ? "block" : "none" }}>
            {(() => {
              if (!(itemData.status == 6 && isLend)&&!(itemData.status == 4)) {
                return (<div className="p30">暂无权限</div>);
              }
            })()}
            {(() => {
              if (itemData.status == 6 && isLend) {
                return (
                  <div className="pt15 pb30">
                    <h3 className="fs18 ml15 mb15 desalt-color">放款登记</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <Form formStyle="horiz" formRendData={LoanRegForm} onSubForm={(data) => { this.goLoanReg(data); }} >
                        </Form>
                      </div>
                    </div>
                  </div>
                )
              }
            })()}
            {(() => {
              if (itemData.status == 4) {
                let setData = tools.deepCopy(LoanRegForm);
                let formPic = LoanRegForm[3];
                setData.splice(3, 1);
                return (
                  <div className="m15 pt15 pb15">
                    <div className="ubb1 fuzzy-border pb15 mb15">
                      <h3 className="fs18 mb15 desalt-color">放款登记</h3>
                      <div className="row">
                        {this.rendText(setData)}
                      </div>
                    </div>
                    <h3 className="fs18 mt15 mb15 desalt-color">放款截图</h3>
                    <div className="">
                      <ImgUploadGroup value={formPic.value} readOnly={true}></ImgUploadGroup>
                    </div>
                  </div>
                )
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}

export default DetailMoveItem;