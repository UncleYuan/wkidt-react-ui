
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

const FormDataPro =  //审核
  [{
    "label": "审核结果",
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
    "label": "图片附件",
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

const UserFormDataPro = [
  {
    "name": "name",
    "label": "借款人真实姓名",
    "value": "",
    "type": "text"
  },
  {
    "label": "借款人身份证号",

    "name": "id_card",
    "value": "",
    "type": "text"
  },
  {
    "name": "idcard_positive",
    "label": "身份证正面照片",
    "value": "",
    "type": "file-single"
  },
  {
    "name": "idcard_reverse",
    "label": "身份证反面照片",
    "value": "",
    "type": "file-single"
  }
]


const defaultProps = {
};

const readOnlyFormCtrl = function (label, val) {
  return (
    <div className="form-ctrl " >
      <div className="form-ctrl-label dis" >{label}</div>
      <div className="form-comp-wrap " >
        <div className="ui-input-wrap" >
          <div className="ui-input disabled">
            {val}
          </div>
        </div>
      </div>
    </div>
  )
}
class DetailCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗

      selTab: 0,
      goFormData: [],
      reviewData: null,
      UserFormData: tools.deepCopy(UserFormDataPro),
      reviewFormData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
   

    this.listHeadArr = ["记录ID","申请人", "审核人",  "提交时间", "回复时间", "查档结果","附件", "回复备注"];
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
    let {orderInfo} = this.context;
    let {UserFormData} = this.state;
    if (orderInfo.license) {
      UserFormData[0].value = orderInfo.customer_name;
      UserFormData[1].value = orderInfo.customer_id_card;
      UserFormData[2].value = orderInfo.idcard_positive;
      UserFormData[3].value = orderInfo.idcard_reverse;
      this.setState({ UserFormData });
    }
  }

  turnTab = (idx) => {
    this.setState({ selTab: idx })
  }
  goSub = (data) => {
    let {order_id} = this.props;
    Process.show();
    fetch(`/order/check.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        order_id: order_id,
        name: data.name,
        id_card: data.id_card,
        idcard_positive: data.idcard_positive,
        idcard_reverse: data.idcard_reverse,
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
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/check/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
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
  goReview = (data) => {
    let {order_id}=this.props;
    Process.show();
    fetch(`/order/check.do`, {
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
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/check/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }
  render() {
    let { loading, reviewFormData, modalShow, selTab, UserFormData, reviewData, goFormData} = this.state;
    let {orderInfo} = this.context;
    let {order_id} = this.props;
    let isReview = orderInfo.permissions.indexOf('0503') >= 0;
    let isSub = orderInfo.permissions.indexOf('0502') >= 0;
    let isEdit = orderInfo.permissions.indexOf('0501') >= 0;
    return (
      <div>
        <div className="mb5 tl">


          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>提交身份核验资料</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>操作记录</a></li>
            </ul>
          </div>

        </div>
        {(() => {

          if (!loading) {
            return (
              <div style={{ display: selTab == 0 ? "block" : "none" }}>
                <Modal show={modalShow[0]} title="身份核验审核" onClose={() => { this.toggleModal(0); }}>
                  {modalShow[0] ? <Form formRendData={reviewFormData} formStyle="ver" onSubForm={(data) => { this.goReview(data) }}></Form> : ""}
                </Modal>
                <Panel title={"请按步骤完善以下表单，然后提交审核"} show={true} type="default" noWrap={true}>
                  <div className="clearfix p5">
                    <div className="col-md-6 pb10">
                      <div className="pb15 pt15">

                        <div className="uba1 fuzzy-border p15 mb10">
                          {(() => {
                            if (orderInfo) {
                              let statusNum = parseInt(orderInfo.real_name_check_status);
                              if (statusNum > 0) {
                                let icon = "";
                                let txt = "";
                                let reviewBtn = isReview ? <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-info">身份核验审核</a> : "";
                                switch (statusNum) {
                                  case 1:
                                    icon = "icon-shenhezhong assist-color";
                                    txt = "已经提交身份核验申请," + (isReview ? "请审核吧" : "请等待审核吧");
                                    break;
                                  case 2:
                                    icon = "icon-shenhetongguo base-color";
                                    txt = "当前身份核验已经通过审核,想了解更多可以查看记录";
                                    break;
                                  case 3:
                                    icon = "icon-shenheweitongguo contrary-color";
                                    txt = "当前身份核验没有通过审核,了解更多可以查看记录";
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


                      <Form formStyle="ver" disabled={!isEdit} onSubForm={(data) => { this.goSub(data) }} >

                        {UserFormData.map((obj, idx) => {
                          return (<FormCtrl key={idx} {...obj} />)
                        })}
                        <div className="gray-bg p10 mb15">
                          温馨提示：<br />
                          在拍摄身份证时，请务必保证字迹清晰，可上透明水印。
                           </div>
                        <div style={{ display: isSub ? "block" : "none" }}>
                          <FormSub></FormSub>
                        </div>

                      </Form>
                    </div>

                  </div>

                </Panel>


              </div>
            )
          }
        })()}

        <div className="wrapper mb15" style={{ display: selTab == 1 ? "block" : "none" }}>
          <div className="p10 white-bg">
            <TableList url="/order/check.do" headTitArr={this.listHeadArr} fetchData={{ order_id }} rendHtml={this.listRendHtml}></TableList>
          </div>
        </div>
      </div>

    );
  }
}

export default DetailCheck;