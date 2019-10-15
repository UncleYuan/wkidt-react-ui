
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
const goNextFormData = [

  {
    "name": "amount",
    "label": "打款金额",
    "value": "",
    "barHtml": <div className='btn gray-bg'>万元</div>,
    "type": "input-group"
  },

  {
    "name": "attachment",
    "label": "还款证明",
    "title": "还款证明",
    "value": [],
    "type": "img-upload-group"
  }
]

const FormDataPro =
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
    "name": "collection_amount",
    "label": "收款金额",
    "value": "",
    "barHtml": <div className='btn gray-bg'>万元</div>,
    "type": "input-group"
  },
  {
    "name": "collection_account",
    "label": "收款账号",
    "value": "",
    "type": "text"
  },
  {
    "name": "collection_account_name",
    "label": "收款账户名",
    "value": "",
    "type": "text"
  },
  {
    "name": "collection_account_bank",
    "label": "开户行",
    "value": "",
    "type": "text"
  },
  {
    "name": "collection_auth",
    "label": "上传收款凭证",
    "title": "收款凭证",
    "value": [],
    "type": "img-upload-group"
  },
  {
    "name": "remark2",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
  ]


const pagePro = {
  page_count: 0,
  page_index: 1,
  record_count: 0
}
const defaultProps = {
};
class DetailRedemptionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      selTab: 0,
      itemData: {},
      goFormData: [],
      goNextFormData: tools.deepCopy(goNextFormData),
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
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
      this.upData((data) => {

      });

    }

  }


  addData = () => {

    this.setState({ loading: false });
  }
  upData = (callback) => {
    let { item_id } = this.props;
    fetch(`/property/redemption/${item_id}.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          let goNextFormData = this.resetGoNextFormData(data, data);

          this.setState({
            itemData: data.data,
            goNextFormData: goNextFormData,
            loading: false
          })

        } else if (data.code == "NO_DATA") {
          this.setState({
            itemData: {},
            loading: false
          })
        }
        if (callback) callback(data);
      });

  }
  resetGoNextFormData = (data) => {
    let goNextFormData = tools.deepCopy(this.state.goNextFormData);
    let { orderInfo } = this.props;
    goNextFormData[0].readOnly = true;
    for (let i in data.data) {
      form_tools.setArrObjVal(goNextFormData, i, data.data[i]);
    }
    return goNextFormData;
  }
  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  subSh = (data) => {
    let { proper_id, item_id } = this.props;

    Process.show();
    data.status=data.status.join(',');
    data.collection_auth=JSON.stringify(data.collection_auth);
    fetch(`/property/redemption.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({
        property_id: proper_id
      },data))
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
                <a href="javascript:;" onClick={() => { Modal.close(); if (window.upDataProperFunc) window.upDataProperFunc(); location.href = "#/dzzc.html/" + proper_id + "/redemptionitem/" + (new Date()).valueOf()+"/"+item_id }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }


  turnTab = (idx) => {
    this.setState({ selTab: idx })
  }
  goSub = (subData) => {
    let { orderInfo, item_id, proper_id } = this.props;
    subData.attachment = JSON.stringify(subData.attachment);
    Process.show();
    fetch(`/property/redemption.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({ property_id: proper_id }, subData))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/dzzc.html/" + orderInfo.id + "/redemption/" + (new Date()).valueOf() + (data.data ? "/" + data.data : "");
          tools.sendUpdataUser();
        }
      })
  }

  render() {
    let { loading, formData, modalShow, selTab, goNextFormData, goFormData, itemData } = this.state;
    let { order_id, orderInfo, item_id } = this.props;
    let isRe = orderInfo.permissions.indexOf('0502') >= 0 && typeof (itemData) !== "undefined" && itemData.status == 0;
    let isSub = orderInfo.permissions.indexOf('0501') >= 0 && !item_id;
    return (
      <div>
        <div className="mb5 tl">
          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>赎回申请</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>操作记录</a></li>
            </ul>
          </div>
        </div>
        <div className="wrapper">
          <div className="white-bg pb30" style={{ display: selTab == 0 ? "block" : "none" }}>

            <div className="fs20 ml15 pt20 desalt-color">赎回申请信息</div>
            <div className="p20">
              {/*disabled={parseInt(itemData.status) == 0 ? false : true}*/}
              <Form labelCol="col-md-3" InputCol="col-md-9" onSubForm={(data) => { this.goSub(data) }} >
                <div className="row">
                  <div className="col-md-5 md-fr">
                    <div className="uba1 fuzzy-border p15 mb15 br5">
                      {(() => {
                        if (orderInfo) {
                          let statusNum = itemData.status ? parseInt(itemData.status) : -1;
                          let returnArr = [];
                          if (typeof item_id != "undefined") {
                            let icon = "";
                            let txt = "";
                            let reviewBtn = isRe ? <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-info">赎回申请审核</a> : "";
                            switch (statusNum) {
                              case 0:
                                icon = "icon-shenhezhong assist-color";
                                txt = "已经提交赎回申请," + (isRe ? "请审核吧" : "请等待审核吧");
                                break;
                              case 1:
                                icon = "icon-shenhetongguo base-color";
                                txt = "当前赎回申请已经通过审核";
                                break;
                              case 2:
                                icon = "icon-shenheweitongguo contrary-color";
                                txt = "当前赎回申请没有通过审核";
                                break;
                            }
                            returnArr.push(<div><i className={"iconfont fs80 lh1 vm " + icon}></i><div className="pt10 pb10"><div className="fs16 "> {txt}</div>{reviewBtn}</div> </div>)
                            if (statusNum == 1) {
                              returnArr.push(
                                <div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">审核时间：</div>
                                    <div className="col-md-9 pb10">{itemData.update_time}</div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">收款金额：</div>
                                    <div className="col-md-9 pb10">{itemData.collection_amount}元</div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">收款账号：</div>
                                    <div className="col-md-9 pb10">{itemData.collection_account}</div>
                                  </div>
                                   <div className="row">
                                    <div className="col-md-3 desalt-color pb10">收款账户名：</div>
                                    <div className="col-md-9 pb10">{itemData.collection_account_name}</div>
                                  </div>
                                   <div className="row">
                                    <div className="col-md-3 desalt-color pb10">开户行：</div>
                                    <div className="col-md-9 pb10">{itemData.collection_account_bank}</div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">上传收款凭证：</div>
                                    <div className="col-md-9 pb10">
                                      <ImgUploadGroup readOnly={true} value={itemData.collection_auth}></ImgUploadGroup>
                                    </div>
                                  </div>
                                 
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">备注：</div>
                                    <div className="col-md-9 pb10">{itemData.remark2}</div>
                                  </div>
                                </div>
                              )
                            }
                            if (statusNum == 2) {
                              returnArr.push(
                                <div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">审核时间：</div>
                                    <div className="col-md-9 pb10">{itemData.update_time}</div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">备注：</div>
                                    <div className="col-md-9 pb10">{itemData.remark2}</div>
                                  </div>
                                </div>
                              )
                            }
                          } else {
                            returnArr.push(<div>您尚未提交赎回申请</div>)
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
                  <div className="col-md-7">
                    <div className="form-ctrl clearfix" >
                      <div className="form-ctrl-label col-md-3 ">
                        <span className="desalt-color">客户名称：</span>
                      </div>
                      <div className="form-comp-wrap  pt7 col-md-8">
                        {orderInfo.customer_name}
                      </div>
                    </div>
                    <div className="form-ctrl clearfix" >
                      <div className="form-ctrl-label col-md-3">
                        <span className="desalt-color">仓库编号：</span>
                      </div>
                      <div className="form-comp-wrap pt7 col-md-8">
                        {orderInfo.warehouse_no}
                      </div>
                    </div>
                    <div className="form-ctrl clearfix" >
                      <div className="form-ctrl-label  col-md-3">
                        <span className="desalt-color">资产名称：</span>
                      </div>
                      <div className="form-comp-wrap pt7  col-md-8">
                        {orderInfo.model_name}
                      </div>
                    </div>

                    <div>{goNextFormData.map((obj, idx) => {
                      if (!item_id && obj.name == "nper") { return null; }
                      return (<FormCtrl key={idx} {...obj} />)
                    })}</div>
                    <div style={{ display: isSub ? "block" : "none" }}>
                      <FormSub></FormSub>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
            <Modal title="赎回审核" show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
              {modalShow[0] ? <Form formStyle="ver" formRendData={formData} onSubForm={this.subSh} /> : ""}
            </Modal>
          </div>
          <div style={{ display: selTab == 1 ? "block" : "none" }}>
            <ZcDetailsAuditlog step={"redemption"} add_id={item_id} model="property" data_id={typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id}></ZcDetailsAuditlog>
          </div>
        </div>
      </div>

    );
  }
}

export default DetailRedemptionItem;