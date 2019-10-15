
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
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
import Panel from '../../jsCk/comp/Panel';
import { FileGroup } from '../../src/FileGroup';
import TableList from './public/TableList';

const CustomerFormDataPro = [

  {
    "name": "name",
    "label": "姓名",
    "value": "",
    "readOnly": true,
    "type": "text"
  },
  {
    "name": "contact",
    "label": "电话",
    "readOnly": true,
    "value": "",
    "type": "text"
  },
  {
    "name": "type_name",
    "label": "客户类型",
    "readOnly": true,
    "value": "",
    "type": "text"
  },
]
const VisitFormData = [
  {
    "name": "result",
    "label": "回访结果属性",
    "value": [],
    "options": [
      {
        name: "无人接听",
        value: '1'
      },
      {
        name: "对方忙",
        value: '2'
      },
      {
        name: "联系人错误（错号/空号/欠费）",
        value: '3'
      },
      {
        name: "其他（秘书台、关机、异地）",
        value: '4'
      },
      {
        name: "回访成功",
        value: '5'
      }
    ],
    "type": "select-single"
  },
  {
    "name": "attachment",
    "label": "附件",
    "title": "附件",
    "value": [],
    "type": "img-upload-group"
  },
  {
    label: "回访录音",
    type: "file-single",
    fileType:"video",
    name: "recording"
  },
  {
    "name": "remark",
    "label": "回访备注",
    "value": "",
    "type": "textarea"
  }
]
let fileArr = [
  {
    isLabel: false,
    title: "借款合同原件扫描件",
    type: "file-single",
    name: "contract_img"
  },
  {
    isLabel: false,
    title: "借款人身份证正面",
    type: "file-single",
    name: "idcard_reverse"
  },
  {
    isLabel: false,
    title: "借款人身份证反面",
    type: "file-single",
    name: "idcard_positive"
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
class DetailKh extends Component {
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
      upDataTime: (new Date()).valueOf(),
      CustomerFormData: tools.deepCopy(CustomerFormDataPro),
      VisitFormData: tools.deepCopy(VisitFormData),
      fileArr: tools.deepCopy(fileArr),
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.openContId = ""
  }

  componentWillReceiveProps(nextProps) {


  }


  componentWillMount() {

  }

  componentDidMount() {

    this.upData();

  }

  resetFormData = (orderInfo, bankForm, htForm, fileArr) => {

    for (let i in orderInfo) {

      if ("is_full".indexOf(i) >= 0) {

      }
      form_tools.setArrObjVal(bankForm, i, orderInfo[i]);
      form_tools.setArrObjVal(htForm, i, orderInfo[i]);
      form_tools.setArrObjVal(fileArr, i, orderInfo[i]);


    }
    return { bankForm, htForm, fileArr };
  }

  upData = (callback) => { //更新表单数据
    let { page, len, searchTxt, CustomerFormData } = this.state;
    let { params } = this.props;
    fetch(`/customer/${params.id}.do?`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {

          for (let i in data.data) {

            CustomerFormData = form_tools.setArrObjVal(CustomerFormData, i, data.data[i]);


          }
          this.setState({
            CustomerFormData,
            rendData: data.data,
            loading: false
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          this.setState({
            rendData: {},
            loading: false
          })
        }
        if (callback) callback();
      });

  }


  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  subSh = (data) => {
    let { order_id } = this.props;
    Process.show();
    fetch(`/property/lending.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        order_id: order_id,
        remark: data.remark,
        status: data.status.join(','),
        amount: data.amount,
        contract_no: data.contract_no,
        account: data.account,
        account_name: data.account_name
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
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/lending/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }
  subNext = (data) => {
    let { order_id } = this.props;
    Process.show();
    fetch(`/property/check.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        order_id: order_id
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
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/final/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }

  goSubAllSubAll = (data) => {
    let { params } = this.props;
    Process.show();
    data.attachment = JSON.stringify(data.attachment);
    fetch(`/customer/visit.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({ customer_id: params.id, remark: data.remark, result: data.result.join(''), attachment: data.attachment })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          this.toggleModal(0);
          this.setState({ upDataTime: (new Date).valueOf() })
        }
      })
  }
  listRendHtml = (obj, idx) => {
    return (
      <tr key={idx}>
        <td>{obj.user_name}</td>
        <td>{obj.result_name}</td>
        <td>{obj.remark}</td>
        <td>{obj.add_time}</td>
        <td><ImgUploadGroup width={100} height={80} value={obj.attachment} readOnly={true}></ImgUploadGroup></td>
        <td >{obj.update_time}</td>
      </tr>
    )
  }
  render() {
    let { rendData, loading, formData, upDataTime, modalShow, page, len, selTab, goFormData, VisitFormData, CustomerFormData, fileArr } = this.state;
    let { params } = this.props;

    if (loading) {
      return (<Loading></Loading>)
    }

    return (
      <div>

        <div className="wrapper">


          <Panel title={"1、客户基本资料"} show={true} type="default" noWrap={true}>
            <div className="p20">
              <Form formStyle="ver" disabled={true} >
                <div className="row">
                  <div className="col-md-6">
                    {CustomerFormData.map((obj, idx) => {
                      return (<FormCtrl key={idx} {...obj} />)
                    })}
                    <div style={{ display: "none" }}>
                      <FormSub></FormSub>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </Panel>
          {/*<Panel title={"2、客户交易记录"} show={true} type="default" noWrap={true}>
                  <div className="p20">
                 <table className="table  table-striped ">
                                    <thead>
                                        <tr>
                                           
                                            <th>资产名称</th>
                                            <th>交易类型</th>
                                            <th>交易时间</th>
                                            <th>交易金额</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                          <td>宝马2016款520 2.0T豪华版</td>
                                          <td>质押借款</td>
                                          <td>2017-1-1</td>
                                          <td>20万</td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                </Panel>*/}
          <Modal show={modalShow[0]} title="添加回访" onClose={() => { this.toggleModal(0); }}>
            {modalShow[0] ? <Form formStyle="ver" onSubForm={(data) => { this.goSubAllSubAll(data) }} formRendData={VisitFormData} ></Form> : null}
          </Modal>
          <Panel title={"2、客户回访记录"} show={true} type="default" noWrap={true}>
            <div className=" tr pr10 pt10 ">
              <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-warn">添加回访</a>
            </div>
            <div className="pl10 pr10 white-bg">
              <TableList url="/customer/visit.do" headTitArr={["回访员名称", "回访结果属性", "回访备注", "添加时间", "附件查看", "更新时间"]} upDataTime={upDataTime} fetchData={{ customer_id: params.id }} rendHtml={this.listRendHtml}></TableList>
            </div>
          </Panel>

        </div>
      </div>

    );
  }
}

export default DetailKh;