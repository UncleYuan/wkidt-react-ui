
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
import { Select } from '../../src/Select';
import Panel from '../../jsCk/comp/Panel';
import { FileGroup } from '../../src/FileGroup';
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
import TableList from './public/TableList';
const BankFormDataPro =
  [
    {
      "name": "customer_name",
      "label": "借款人姓名",
      "value": "",
      "readOnly": true,
      "type": "text"
    },
    {
      "name": "customer_id_card",
      "label": "身份证号码",
      "value": "",
      "readOnly": true,
      "type": "text"
    },
    {
      "name": "account",
      "label": "银行账号",
      "value": "",
      "type": "text"
    },
    {
      "label": "账户名",
      "value": "",
      "name": "account_name",
      "type": "text"
    },
    {
      "name": "bank",
      "label": "开户行",
      "value": "",
      "type": "text"
    }
  ]
const HtFormData = [
  {
    "name": "end_limit",
    "label": "终审额度",
    "value": "",
    "readOnly": true,
    "type": "input-group",
    "barHtml": <div className='btn gray-bg'>万</div>
  },
  {
    "name": "contract_no",
    "label": "合同编号",
    "value": "",
    "type": "text"
  },
  {
    "name": "lending_amount",
    "label": "实际放款金额",
    "value": "",
    "type": "input-group",
    "barHtml": <div className='btn gray-bg'>万</div>
  },
  {
    "name": "interest",
    "label": "实际利息",
    "value": "",
    "type": "input-group",
    "barHtml": <div className='btn gray-bg'>%/月息</div>
  },
  {
    "name": "overdue_interest",
    "label": "逾期罚息",
    "value": "",
    "type": "input-group",
    "barHtml": <div className='btn gray-bg'>%/天</div>
  },
  {
    "name": "poundage",
    "label": "手续费收取",
    "value": "",
    "type": "input-group",
    "barHtml": <div className='btn gray-bg'>元/次</div>
  },
   {
    "name": "poundage_remark",
    "label": "其他相关费用备注",
    "value": "",
    "type": "text"
  },
  {
    "name": "contract_start",
    "label": "合同起始日期",
    "value": "",
    "format": "y-m-d",
    "type": "time-select-input"
  },
   {
    "name": "redemption_count",
    "label": "合同期限(月)",
    "value": ["2"],
    "type": "select-single",
    "options":[{name:"1",value:"1"},{name:"2",value:"2"},{name:"3",value:"3"}]
  },
  {
    "name": "contract_end",
    "label": "合同到期日期",
    "value": "",
    "readOnly": true,
    "type": "text"
  },
 


]
let fileArr = [
  {
    isLabel: false,
    title: "行驶证",
    readOnly: true,
    type: "file-single",
    name: "license_img"
  },
  {
    isLabel: false,
    title: "借款人身份证正面",
    type: "file-single",
    readOnly: true,
    name: "idcard_reverse"
  },
  {
    isLabel: false,
    title: "借款人身份证反面",
    readOnly: true,
    type: "file-single",
    name: "idcard_positive"
  },
   {
    title: "银行卡照片",
    type: "img-upload-group",
    isLabel: false,
    upLoadType:"group",
    width: 160,
    height: 120,
    name: "bank_img"
  }
]
let htFileArr = [

  {
    isLabel: false,
    title: "签约视频",
    type: "file-single",
    imgTypeSrc: { "video": "/admin/img/video.png" },
    fileType: "video",
    width: 100,
    height: 100,
    name: "video"
  },
  {
    isLabel: false,
    title: "人车合照",
    width: 100,
    height: 100,
    type: "file-single",
    name: "group_photo"
  },
  {
    title: "合同扫描件",
    type: "img-upload-group",
    isLabel: false,
    upLoadType:"group",
    width: 160,
    height: 120,
    name: "contract_img"
  },
  {
    isLabel: false,
    width: 160,
    height: 120,
    upLoadType:"group",
    title: "违章记录",
    type: "img-upload-group",
    name: "illegal"
  },
   {
    title: "签约照片",
    type: "img-upload-group",
    isLabel: false,
    upLoadType:"group",
    width: 160,
    height: 120,
    name: "signing_img"
  }
]
const FormDataPro =  //审核
  [{
    "label": "打款时间",
    "value": "",
    "name": "lending_time",
    "inline": true,
    "format": "y-m-d",
    "type": "time-select-input"
  },
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
    "name": "out_account",
    "label": "转出账号",
    "value": "",
    "type": "text"
  },
  {
    "name": "out_amount",
    "label": "转出金额",
    "value": "",
    "barHtml": <div className='btn gray-bg'>万</div>,
    "type": "input-group"
  },
   {
    "name": "out_bank",
    "label": "转出银行",
    "value": "",
    "type": "text"
  },
   {
    "name": "out_account_name",
    "label": "转出账户名称",
    "value": "",
    "type": "text"
  },
  {
    "name": "lending_img",
    "label": "打款凭证",
    "value": "",
    "type": "img-upload-group",
  },
  {
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "text"
  }
  ]


const pagePro = {
  page_count: 0,
  page_index: 1,
  record_count: 0
}
const defaultProps = {
};
class DetailLending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      page: tools.deepCopy(pagePro),
      len: 30, //分页长度
      logList: [],
      selTab: 0,
      goFormData: [],
      searchTxt: "",
      reviewFormData: tools.deepCopy(FormDataPro),
      BankFormData: tools.deepCopy(BankFormDataPro),
      HtFormData: tools.deepCopy(HtFormData),
      fileArr: tools.deepCopy(fileArr),
      htFileArr: tools.deepCopy(htFileArr),

    };
    this.openContId = "";
    this.mCount=2;
    this.startTime="";
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
    this.resetFormData();


  }

  resetFormData = () => {
    let { orderInfo } = this.context;
    let { fileArr, htFileArr, BankFormData, HtFormData } = this.state;
    for (let i in orderInfo) {
      fileArr = form_tools.setArrObjVal(fileArr, i, orderInfo[i]);
      htFileArr = form_tools.setArrObjVal(htFileArr, i, orderInfo[i]);
      BankFormData = form_tools.setArrObjVal(BankFormData, i, orderInfo[i]);
      HtFormData = form_tools.setArrObjVal(HtFormData, i, orderInfo[i]);

    }
    
    HtFormData[7].itemChange = this.startTimeChange;
    HtFormData[8].itemChange = this.mCountChange;
    console.log(HtFormData[8].value)
    if(HtFormData[8].value){ HtFormData[8].value=[HtFormData[8].value]; this.startTime=[HtFormData[8].value]; this.mCount= HtFormData[8].value; }
    if(HtFormData[7].value){  this.startTimeChange(HtFormData[7].value); }
    
    
    this.setState({ fileArr, htFileArr, BankFormData, HtFormData })
  }
  mCountChange=(data)=>{
    let { HtFormData } = this.state;
    this.mCount=data;
    console.log(this.startTime)
    this.startTimeChange(this.startTime,false);
 
  }
  startTimeChange = (data,def=true) => {
    let { HtFormData } = this.state;
    
    let timeArr =data.split('-');
    let m = parseInt(timeArr[1]);
    let y = parseInt(timeArr[0]);
    let d = parseInt(timeArr[2]);
    m=m+parseInt(this.mCount.join(""))-1;

    let nextM = m;
    if (11 - m >= 0) {
      nextM += 1;
    } else if(m==12&&d==1) {
      nextM = 13;
    }else {
      nextM = Math.abs(11 - m);
      y += 1;
    }
    if (y % 4 == 0 && nextM == 2 && d > 29) {
      d = 29
    } else if (y % 4 != 0 && nextM == 2 && d > 28) {
      d = 28
    }
    if (d == 1) {
      nextM--;
      d = tools.getDaysInMonth(y, nextM);

    } else {
      d--;
    }
    HtFormData[9].value = y + "-" + nextM + "-" + d;
    this.setState({ HtFormData });
    this.startTime=data;
  }

  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  goReview = (data) => {
    let { order_id } = this.props;
    Process.show();
    data.status=data.status.join('');
    data.lending_img=JSON.stringify(data.lending_img);
    fetch(`/order/lending.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({ order_id }, data))
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
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/lending/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }
  goSubAllSubAll = (data) => {
    let { order_id } = this.props;
    Process.show();
    data.contract_img=JSON.stringify(data.contract_img);
    data.illegal=JSON.stringify(data.illegal);
    data.bank_img=JSON.stringify(data.bank_img);
    data.signing_img=JSON.stringify(data.signing_img);
    data.redemption_count=data.redemption_count.join('');
    fetch(`/order/lending.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign(data, { order_id }))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/zc.html/" + order_id + "/lending/" + (new Date()).valueOf();
        }
      })
  }
  
  listRendHtml = (obj, idx) => {
    return (
      <tr key={idx}>
        <td>{obj.out_amount}</td>
        <td>{obj.out_account}</td>
        <td>{obj.out_account_name}</td>
        <td>{obj.out_bank}</td>
        <td>{obj.lending_time}</td>
        <td>{obj.apply_name}</td>
        <td>{obj.user_name}</td>
        <td className="base-color">{obj.status_name}</td>
        <td>{obj.remark}</td>
         <td><ImgUploadGroup width={100} height={60} value={obj.lending_img} readOnly={true}></ImgUploadGroup></td>
      </tr>
    )
  }
  render() {
    let { rendData, loading, formData, modalShow, reviewFormData, page, len, selTab, goFormData, HtFormData, BankFormData, fileArr, htFileArr } = this.state;
    let { order_id } = this.props;
    let { orderInfo } = this.context;
  
    let isReview = orderInfo.permissions.indexOf('0603') >= 0;
    let isSub = orderInfo.permissions.indexOf('0602') >= 0;
    let isEdit = orderInfo.permissions.indexOf('0601') >= 0;
    return (
      <div>
        <div className="">
          <div className="fs24 pl10 lh1 ">申请放款</div>
        </div>

        <div className="wrapper">
          <div>
            <div className="p10 desalt-color">
              请按步骤完善以下表单，然后提交审核
                </div>
            <Modal show={modalShow[0]} title="放款审核" onClose={() => { this.toggleModal(0); }}>
              {modalShow[0] ? <Form formRendData={reviewFormData} formStyle="ver" onSubForm={(data) => { this.goReview(data) }}></Form> : ""}
            </Modal>
            <Form formStyle="horiz" disabled={!isEdit} onSubForm={(data) => { this.goSubAllSubAll(data) }} >
              <Panel title={"1 借款人信息"} show={true} type="default" noWrap={true}>
                <div className="pb15 pt15 ml20 mr20">

                  <div className="uba1 fuzzy-border p15 ">
                    {(() => {
                      if (orderInfo) {
                        let statusNum = parseInt(orderInfo.lending_status);
                        if (statusNum > 0) {
                          let icon = "";
                          let txt = "";
                          let reviewBtn = isReview ? <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-info">放款审核</a> : "";
                          switch (statusNum) {
                            case 1:
                              icon = "icon-shenhezhong assist-color";
                              txt = "已经提交放款申请," + (isReview ? "请审核吧" : "请等待审核吧");
                              break;
                            case 2:
                              icon = "icon-shenhetongguo base-color";
                              txt = "当前放款已经通过审核,想了解更多可以查看记录";
                              break;
                            case 3:
                              icon = "icon-shenheweitongguo contrary-color";
                              txt = "当前放款没有通过审核,了解更多可以查看记录";
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
                <div className="p20">
                  <div className="row">
                    <div className="col-md-6">
                      {BankFormData.map((obj, idx) => {
                        return (<FormCtrl key={idx} {...obj} />)
                      })}
                    </div>
                    <div className="col-md-6  pt15 ">
                      {fileArr.map((obj, idx) => {
                        return (
                          <div key={idx} className="col-md-4 col-xs-6  mb15" >
                            <FormCtrl  {...obj} width={100} height={100} />
                            {fileArr.length==idx+1?<div className=" desalt-color pl20">{obj.title}</div>:null}
                          </div>
                          
                        )
                      })}
                    </div>
                  </div>

                </div>
              </Panel>
              <Panel title={"2 借款合同信息"} show={true} type="default" noWrap={true}>
                <div className="p20">
                  <div className="row mt10">
                    <div className=" col-md-6 mb30">
                      {HtFormData.map((obj, idx) => {
                      
                           return (<FormCtrl key={idx} {...obj} />)
                
                       
                      })}
                    </div>
                    <div className="col-md-6 pt15">
                      {htFileArr.map((obj, idx) => {
                          
                         
                        return (
                          <div key={idx} className="col-md-6   mb15" >
                            <FormCtrl  {...obj} />
                            {obj.type=="img-upload-group"?<div className="desalt-dark-color">{obj.title}</div>:null}
                          </div>
                        )
                      })}
                     
                    </div>


                  </div>

                </div>
              </Panel>
              <Panel title={"3 审核记录"} show={true} type="default" noWrap={true}>
                <div className="p10 white-bg">          

                  <TableList url="/order/lending.do" headTitArr={["转出金额", "转出账号", "转出账户", "转出开户行", "转出时间", "经办人", "审核人", "状态", "备注",  "附件"]} fetchData={{ order_id }} rendHtml={this.listRendHtml}></TableList>
                </div>
              </Panel>
              <div className="w300 pb20" style={{ display: isSub ? "block" : "none" }}>

                <FormSub layoutType="ver"></FormSub>

              </div>
            </Form>

          </div>
        </div>
      </div>

    );
  }
}

export default DetailLending;