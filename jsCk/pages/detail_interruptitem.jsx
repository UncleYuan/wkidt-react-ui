
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
    "value": [],
    "label": "审核附件",
    "type": "file-group",
    "name": "attachment"
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
class DetailInterruptItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      deferInfo: [], //详情数据
      examineData: {}, //审核数据
      page: tools.deepCopy(pagePro),
      len: 30, //分页长度
      selTab: 0,
      goFormData: [],
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
  }
  componentWillReceiveProps(nextProps) {
  }
  componentWillMount() {

  }
  componentDidMount() {
    this.upData();
    this.getExamineData();
  }
  upData = (callback) => { //获取断档详情
    fetch(`/property/defer-info.do?property_id=${this.props.proper_id}`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            deferInfo: data.data
          })
        } else if (data.code == "NO_DATA") {
          this.setState({
            deferInfo: []
          })
        }

      });
  }
  getExamineData = () => {
    let {item_id} = this.props;
    if (item_id) {
      fetch(`/property/interrupt/${item_id}.do`, {
        method: "get",
        credentials: 'same-origin'
      }).then(response => response.json())
        .then((data) => {
          if (data.code == "SUCCESS") {
            this.setState({
              examineData: data.data
            })
          } else if (data.code == "NO_DATA") {
            this.setState({
              examineData: {}
            })
          }
        });
    }
  }

  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
   subSh = (data) => {
    let {proper_id,item_id} = this.props;
    Process.show();
    fetch(`/property/interrupt.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        property_id: proper_id,
        remark: data.remark,
        status: data.status.join(','),
        attachment: data.amount,
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
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/dzzc.html/" + proper_id + "/interrupt/" + (new Date()).valueOf()+'/'+item_id; tools.sendUpdataUser();}} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }
 
  setEidtForm = (i, data) => {
    let {goFormData} = this.state;
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
  goSubAllSubAll = () => {
    let {goFormData} = this.state;
    let {orderInfo,proper_id,item_id}=this.props;
    if (goFormData.length < 1) {
      Toast.show({ msg: "请填写完整资料" });
      return;
    }
    let subData = {
      order_id: typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id
    }
    for (let i in goFormData[0].data) {
      subData[i] = goFormData[0].data[i];
    }
    
    Process.show();
    fetch(`/property/interrupt.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(subData)
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/dzzc.html/" + proper_id + "/interrupt/" + (new Date()).valueOf()+'/'+item_id; 
          tools.sendUpdataUser();
        }
      })
  }
  openImgModal = (val) => {
    Modal.show({ child: <img src={val} /> })
  }
  render() {
    let {deferInfo, loading, formData, examineData, modalShow, page, len, selTab, goFormData} = this.state;
    let {order_id, orderInfo, item_id} = this.props;
  
    return (
      <div>
        <div className="mb5 tl">
          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>断档申请</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>登记审核</a></li>
              <li><a className={selTab == 2 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(2); }}>操作记录</a></li>
            </ul>
          </div>
        </div>
        <div className="wrapper">
          <div style={{ display: selTab == 0 ? "block" : "none" }}>

            <Panel title={"1 资产逾期信息"} show={true} type="default" noWrap={true}>
              <div className="p20">
                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped ">
                   <thead>
                      <tr>
                        <th>期数</th>
                        <th>客户利息</th>
                        <th>融资利息</th>
                        <th>状态</th>
                        <th>逾期天数</th>
                        <th>罚息</th>

                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        if (deferInfo.length > 0) {
                          return deferInfo.map((obj, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{obj.nper}</td>
                                <td>{obj.received}</td>
                                <td>{obj.interest}</td>
                                <td>{obj.status_name}</td>
                                <td>{obj.overdue_day}</td>
                                <td>{obj.overdue_interest}</td>
                              </tr>
                            )
                          })
                        } else {
                          return (
                            <tr >
                              <td className="tc" colSpan="6">暂无数据</td>
                            </tr>
                          )
                        }
                      })()}


                    </tbody>
                  </table>


                </div>
              </div>
            </Panel>

            <Panel title={"2  交接资料"} show={true} type="default" noWrap={true}>
              <ZcdetailsFiles step={"interrupt"} model="property"  add_id={item_id} data_id={typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id}></ZcdetailsFiles>
            </Panel>

            <div className="row" style={{ display: (examineData.status == 0 || !item_id ? "block" : "none") }} >
              <div className="form-sub  col-md-6 ">
                <a href="javascript:;" onClick={() => { this.goSubAllSubAll(); }} className="btn  btn-warn block fs16">提交申请</a>
              </div>
            </div>
          </div>
          <div style={{ display: selTab == 1 ? "block" : "none" }}>
            <section className="p15 white-bg mb15">


              <div>
                <div >

                  <div className="pb15">
                    <div className="fr ">
                      <div className={" btn fs13 "+(examineData.status == 0?"btn-info":"btn-default disabled")} onClick={() => { if(examineData.status == 0) this.toggleModal(0); }}>审核</div>
                    </div>

                    <h4 className="fs20">登记记录</h4>
                  </div>
                </div>

                <div >

                  <Modal title="审核" show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
                    {modalShow[0] ? <Form formStyle="ver" formRendData={formData} onSubForm={this.subSh} /> : ""}
                  </Modal>
                  <div className="table-responsive fixed-loading">
                    <table className="table mt20 table-striped ">
                      <thead>



                        <tr>

                           <th>审核结果</th>
                          <th>申请人</th>
                          <th>审核备注</th>
                          <th>附件</th>
                          <th>审核人</th>
                          <th>时间</th>



                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          if (examineData.id) {
                            return (
                              <tr >
                                <td><span className="base-color">{examineData.status == 1 ? "通过" : "不通过"}</span></td>
                                <td>{examineData.apply_name}</td>
                                <td>{examineData.remark}</td>
                                <td>{(() => {
                                  let fileArr = examineData.attachment.split(',');
                                  if (fileArr.length == 0) {
                                    return "无附件";
                                  } else {
                                    return (<div className="btn-group">{fileArr.map((o, i) => {
                                      return (<span key={i} onClick={() => { this.openImgModal(o); }} className="btn btn-info">{"附件" + i}</span>);
                                    })}</div>)
                                  }
                                })()}</td>
                                <td>{examineData.user_name}</td>
                                <td>{examineData.add_time}</td>
                              </tr>
                            )
                          }
                        })()}
                      </tbody>
                    </table>


                  </div>
                  
                </div>
              </div>
            </section>
          </div>
          <div style={{ display: selTab == 2 ? "block" : "none" }}>
            <ZcDetailsAuditlog step={"interrupt"} model="property" add_id={item_id} data_id={typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id}></ZcDetailsAuditlog>
          </div>
        </div>
      </div>

    );
  }
}

export default DetailInterruptItem;