
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
    "name": "nper",
    "label": "收息期数",
    "readOnly": true,
    "value": "",
    "barHtml": <div className='btn gray-bg'>期</div>,
    "type": "input-group"
  },
  {
    "name": "received",
    "label": "应收利息",
    "readOnly": true,
    "value": "",
    "barHtml": <div className='btn gray-bg'>元</div>,
    "type": "input-group"
  },
  {
    "label": "应收罚息",
    "readOnly": true,
    "value": "",
    "name": "overdue_interest",
    "barHtml": <div className='btn gray-bg'>元</div>,
    "type": "input-group"
  },
  {
    "name": "pay_time",
    "label": "付息时间",
    "format": "y-m-d",
    "value": "",
    "type": "time-select-input"
  },
  {
    "name": "attachment",
    "label": "上传付息凭证",
    "title": "付息凭证",
    "upLoadType": "group",
    "value": [],
    "type": "img-upload-group"
  }
]

const FormDataPro =  //审核探客
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
    "label": "实收利息",

    "value": "",
    "name": "received",
    "barHtml": <div className='btn gray-bg'>元</div>,
    "type": "input-group"
  },
  {
    "label": "实收罚息",

    "value": "",
    "name": "overdue_interest",
    "barHtml": <div className='btn gray-bg'>元</div>,
    "type": "input-group"
  },

  {
    "value": [],
    "name": "attachment2",
    "label": "审核附件",
    "type": "img-upload-group"
  },
  {
    "value": [],
    "name": "check_file",
    "label": "查档截图",
    "type": "img-upload-group"
  },
  {
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
  ]

const formData1 =  //审核探客
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
const pagePro = {
  page_count: 0,
  page_index: 1,
  record_count: 0
}
const defaultProps = {
};
class DetailDeferItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      examineData: {},
      selArr: [], //选择列表数组,保留,用于全选
      page: tools.deepCopy(pagePro),
      len: 30, //分页长度
      logList: [],
      selTab: 0,
      itemData: {},
      goFormData: [],
      searchTxt: "",
      goNextFormData: tools.deepCopy(goNextFormData),
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.openContId = ""
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
    if (!this.props.item_id) {
      this.upDataAdd();
    } else {
      this.upDataEdit();
    }

  }
  upDataEdit = () => {
    let { proper_id, item_id } = this.props;
    let { page, len } = this.state;
    fetch(`/property/defer/details.do?property_id=${proper_id}&id=${item_id}`, {
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
      });
  }
  filterTabIndex = (val) => {
    this.setState({ selTab: val });
  }

  addData = () => {
    this.upDataAdd();
  }
  upDataAdd = (callback) => {
    let { item_id, proper_id } = this.props;
    fetch(`/property/next-defer.do?property_id=${proper_id}`, {
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
    data.status = data.status.join(',');
    data.attachment2 = JSON.stringify(data.attachment2);
    data.check_file = JSON.stringify(data.check_file);
    Process.show();
    fetch(`/property2/defer.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({
        property_id: proper_id,
      }, data))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });


        if (data.code == "SUCCESS") {
          this.toggleModal(0);
          Modal.show({
            child: <div className="fs14 ">{data.info}</div>,
            conf: {
              footer: (
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/dzzc.html/" + proper_id + "/defer/" + (new Date()).valueOf() + '/' + item_id; tools.sendUpdataUser(); }} className="btn btn-info">确定</a>)
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
    let { orderInfo, item_id, proper_id } = this.props;

    Process.show();
    data.attachment = JSON.stringify(data.attachment);
    fetch(`/property2/defer.do`, {
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
          location.hash = "#/dzzc.html/" + orderInfo.id + "/deferitem/" + (new Date()).valueOf() + "/" + data.data;
          tools.sendUpdataUser();
        }
      })
  }
  openImgModal = (val) => {

    Modal.show({ child: <img src={val} /> })
  }
  render() {
    let { examineData, loading, formData, modalShow, page, len, selTab, goNextFormData, goFormData, itemData } = this.state;
    let { order_id, orderInfo, item_id } = this.props;
    let isRe = orderInfo.permissions.indexOf('0302') >= 0 && itemData.status == 0;
    let isSub = orderInfo.permissions.indexOf('0301') >= 0 && !item_id;
    if (loading) {
      return (<Loading></Loading>)
    }
    return (
      <div>
        <div className="mb5 tl">
          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>收息登记</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>操作记录</a></li>
            </ul>
          </div>
        </div>
        <div className="wrapper">
          <div className="white-bg pb30" style={{ display: selTab == 0 ? "block" : "none" }}>

            <div className="fs20 ml15 pt20 desalt-color">收息信息</div>
            <div className="p20">
              {/*disabled={parseInt(itemData.status) == 0 ? false : true}*/}
              <Form labelCol="col-md-3" disabled={item_id?true:false} InputCol="col-md-9" onSubForm={(data) => { this.goSubAllSubAll(data) }} >
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
                            let reviewBtn = isRe ? <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-info">收息登记审核</a> : "";
                            switch (statusNum) {
                              case 0:
                                icon = "icon-shenhezhong assist-color";
                                txt = "已经提交收息登记," + (isRe ? "请审核吧" : "请等待审核吧");
                                break;
                              case 1:
                                icon = "icon-shenhetongguo base-color";
                                txt = "当前收息登记已经通过审核";
                                break;
                              case 2:
                                icon = "icon-shenheweitongguo contrary-color";
                                txt = "当前收息登记没有通过审核";
                                break;
                            }

                            returnArr.push(<div><i className={"iconfont fs80 lh1 vm " + icon}></i><div className="pb10 pt10"><div className="fs16 "> {txt}</div>{reviewBtn}</div> </div>)
                            if (statusNum == 1) {
                              returnArr.push(
                                <div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">审核时间：</div>
                                    <div className="col-md-9 pb10">{itemData.update_time}</div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">实收利息：</div>
                                    <div className="col-md-9 pb10">{itemData.received}元</div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">实收罚息：</div>
                                    <div className="col-md-9 pb10">{itemData.overdue_interest}元</div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">审核附件：</div>
                                    <div className="col-md-9 pb10">
                                      <ImgUploadGroup readOnly={true} value={itemData.attachment2}></ImgUploadGroup>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">查档截图：</div>
                                    <div className="col-md-9 pb10">
                                      <ImgUploadGroup readOnly={true} value={itemData.check_file}></ImgUploadGroup>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3 desalt-color pb10">备注：</div>
                                    <div className="col-md-9 pb10">{itemData.remark}</div>
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
                                    <div className="col-md-9 pb10">{itemData.remark}</div>
                                  </div>
                                </div>
                              )
                            }
                          } else {
                            returnArr.push(<div>您尚未提交收息登记</div>)
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
                    {goNextFormData.map((obj, idx) => {
                      if (!item_id && obj.name == "nper") { return null; }
                      return (<FormCtrl key={idx} {...obj} />)
                    })}
                    <div style={{ display: isSub ? "block" : "none" }}>
                      <FormSub></FormSub>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
            <Modal title="收息审核" show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
              {modalShow[0] ? <Form formStyle="ver" formRendData={formData} onSubForm={this.subSh} /> : ""}
            </Modal>
          </div>
          <div style={{ display: selTab == 1 ? "block" : "none" }}>
            <ZcDetailsAuditlog step={"defer"} add_id={item_id} model="property" data_id={typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id}></ZcDetailsAuditlog>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailDeferItem;