
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
import TableList from './public/TableList';
import { ImgUploadGroup } from '../../src/ImgUploadGroup';

const FormDataPro =
  [{
    "label": "查档结果",
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
    "name": "attachment",
    "label": "查档截图",
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

const UserFormDataPro =
  [
    {
      "name": "license",
      "label": "行驶证号码",
      "value": "",

      "type": "text"
    },
    {
      "name": "vin",
      "label": "车架号",
      "value": "",
      "type": "text"
    },
    {
      "name": "plate_number",
      "label": "车牌号",
      "value": "",
      "type": "text"
    },
    {
      "label": "行驶证照片",
      "value": "",
      "width": 200,
      "height": 150,
      "name": "license_img",
      "type": "file-single",
    },
    {
      "name": "id_card",
      "label": "身份证号",
      "value": "",
      "type": "text"
    },
     {
      "label": "身份证正面",
      "value": "",
      "width": 200,
      "height": 150,
      "name": "idcard_positive",
      "type": "file-single",
    },
     {
      "label": "身份证反面",
      "value": "",
      "width": 200,
      "height": 150,
      "name": "idcard_reverse",
      "type": "file-single",
    }
  ]


/**
 * 订单查档页面
 * 
 * @class DetailWhthin
 * @extends {Component}
 */
class DetailWhthin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalShow: [false, false],
      selTab: 0,
      UserFormData: tools.deepCopy(UserFormDataPro),
      reviewFormData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.listHeadArr = ["记录ID", "行驶证号","申请人", "审核人",  "提交时间", "回复时间", "查档附件", "查档结果", "回复备注"];
  }
  static contextTypes = {
    orderInfo: React.PropTypes.object,
    getOrderState: React.PropTypes.func
  }
  componentWillReceiveProps(nextProps) {
  }
  componentWillMount() {
  }
  componentDidMount() {
    this.resetData();
  }
  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  resetData = () => {
    let { orderInfo } = this.context;
    let { UserFormData } = this.state;
    if (orderInfo.license) {
      UserFormData[0].value = orderInfo.license;
      UserFormData[1].value = orderInfo.plate_number;
      UserFormData[2].value = orderInfo.vin;
      UserFormData[3].value = orderInfo.license_img;
      UserFormData[4].value = orderInfo.customer_id_card;
      UserFormData[5].value = orderInfo.idcard_positive;
      UserFormData[6].value = orderInfo.idcard_reverse;
      this.setState({ UserFormData });
    }
  }
  turnTab = (idx) => {
    this.setState({ selTab: idx })
  }
  goSub = (data) => {
    let { order_id } = this.props;
    Process.show();
    fetch(`/property/whthin.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({ order_id: order_id }, data))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          Modal.show({
            child: <div className="fs14 ">{data.info}</div>,
            conf: {
              footer: (
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/whthin/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }
          })
        }
      });
  }
  listRendHtml = (obj, idx) => {
    return (
      <tr key={idx}>
        <td>{obj.id}</td>
        <td>{obj.license}</td>
        <td>{obj.apply_name}</td>
        <td>{obj.user_name}</td>
        
        <td>{obj.add_time}</td>
        <td>{obj.update_time}</td>
        <td><ImgUploadGroup readOnly={true} width="120" height="80" value={obj.attachment}></ImgUploadGroup></td>
        <td className="base-color">{obj.status_name}</td>
        <td>{obj.remark}</td>
      </tr>
    )
  }
  goReview = (data) => {
    let { order_id } = this.props;
    Process.show();
    fetch(`/property/whthin.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        order_id: order_id,
        remark: data.remark,
        attachment: JSON.stringify(data.attachment),
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
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/whthin/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }
  render() {
    let { loading, reviewFormData, modalShow, selTab, UserFormData} = this.state;
    let { orderInfo } = this.context;
    let { order_id } = this.props;
    let isEdit = orderInfo.permissions.indexOf('0201') >= 0;
    let isSub = orderInfo.permissions.indexOf('0202') >= 0;
    let isRe = orderInfo.permissions.indexOf('0203') >= 0;

    return (
      <div>
        <div className="mb5 tl">
          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>提交查档资料</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>操作记录</a></li>
            </ul>
          </div>
        </div>
        {(() => {
          if (!loading) {
            return (
              <div style={{ display: selTab == 0 ? "block" : "none" }}>
                <Modal show={modalShow[0]} title="查档审核" onClose={() => { this.toggleModal(0); }}>
                  {modalShow[0] ? <Form formRendData={reviewFormData} formStyle="ver" onSubForm={(data) => { this.goReview(data) }}></Form> : ""}
                </Modal>
                <Panel title={"请按步骤完善以下表单，然后提交审核"} show={true} type="default" noWrap={true}>
                  <div className="clearfix p5">
                    <div className="col-md-6 pb10 pt15">


                      <Form formStyle="ver" disabled={isEdit ? false : true} onSubForm={(data) => { this.goSub(data) }} >

                        {UserFormData.map((obj, idx) => {
                          return (<FormCtrl key={idx} {...obj} />)
                        })}
                        <div className="gray-bg p10 mb15">
                          温馨提示：<br />
                          在拍摄行驶证时，请务必保证行驶证是以展开形式，并且字迹清晰。
                           </div>
                        <div style={{ display: isSub ? "block" : "none" }}>
                          <FormSub></FormSub>
                        </div>

                      </Form>
                    </div>
                    <div className="col-md-6 ">
                      <div className="pb15 pt15">

                        <div className="uba1 fuzzy-border p15 mb10">
                          {(() => {
                            if (orderInfo) {
                              let statusNum = parseInt(orderInfo.query_archives_status);
                              if (statusNum > 0) {
                                let icon = "";
                                let txt = "";
                                let reviewBtn = isRe ? <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-info">查档审核</a> : "";
                                switch (statusNum) {
                                  case 1:
                                    icon = "icon-shenhezhong assist-color";
                                    txt = "已经提交查档申请," + (isEdit ? "请审核吧" : "请等待审核吧");
                                    break;
                                  case 2:
                                    icon = "icon-shenhetongguo base-color";
                                    txt = "当前查档已经通过审核,想了解更多可以查看记录";
                                    break;
                                  case 3:
                                    icon = "icon-shenheweitongguo contrary-color";
                                    txt = "当前查档没有通过审核,了解更多可以查看记录";
                                    break;
                                }
                                return (<div><i className={"iconfont fs80 lh1 vm " + icon}></i><div className="inline-block vm pl15"><div className="fs16 pb5"> {txt}</div>{reviewBtn}</div> </div>)
                              } else {
                                return (<div>您尚未提交申请</div>)
                              }
                            }
                          })()}
                        </div>

                      </div>

                    </div>
                  </div>

                </Panel>


              </div>
            )
          }
        })()}

        <div className="wrapper mb15" style={{ display: selTab == 1 ? "block" : "none" }}>
          <div className="p10 white-bg">
            <TableList url="/property/whthin.do" headTitArr={this.listHeadArr} fetchData={{ order_id }} rendHtml={this.listRendHtml}></TableList>
          </div>
        </div>
      </div>

    );
  }
}

export default DetailWhthin;