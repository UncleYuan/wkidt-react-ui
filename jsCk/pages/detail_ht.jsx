
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
import FileSingle from '../../src/FileSingle';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import { InputGroup } from '../../src/InputGroup';

import { FileGroup } from '../../src/FileGroup';



const formData1 =
  [
    {
      "label": "姓名",
      "value": "",
      "name": "name",
      "type": "text",
    },
    {
      "label": "性别",
      "value": "",
      "name": "sex_name",
      "type": "text",
    },
    {
      "label": "身份证",
      "value": "",
      "type": "text",
      "name": "id_card"
    },
    {
      "label": "年龄",
      "value": "",
      "type": "text",
      "name": "age"
    },
    {
      "label": "联系方式",
      "value": "",
      "type": "text",
      "name": "contact"
    },
    {
      "label": "紧急联系电话",
      "value": "",
      "type": "text",
      "name": "emergency_tel"
    },
    {
      "label": "地址",
      "value": "",
      "type": "text",
      "name": "address"
    }
  ]

const formData2 =
  [
    {
      "label": "合同编号",
      "value": "",
      "type": "text",
      "name": "contract_no"
    },
    {
      "label": "资产编号",
      "value": "",
      "type": "text",
      "name": "property_number"
    },
    {
      "label": "质押资产名称",
      "value": "",
      "type": "text",
      "name": "property_name"
    },
    {
      "label": "车型名称",
      "value": "",
      "type": "text",
      "name": "model_name"
    },
    {
      "label": "车架号",
      "value": "",
      "type": "text",
      "name": "vin"
    },
    {
      "label": "发动机号",
      "value": "",
      "type": "text",
      "name": "engine_number"
    },
    {
      "label": "实际借款金额(万)",
      "value": "",
      "type": "text",
      "name": "amount"
    },
    {
      "label": "借款利率(%)",
      "value": "",
      "type": "text",
      "name": "interest"
    },
    {
      "label": "手续费(元)",
      "value": "",
      "type": "text",
      "name": "poundage"
    },
    {
      "label": "手续费备注",
      "value": "",
      "type": "text",
      "name": "poundage_remark"
    },
    {
      "label": "逾期罚息(%)",
      "value": "",
      "type": "text",
      "name": "overdue_interest"
    },
    {
      "label": "借款周期（天）",
      "value": "",
      "type": "text",
      "name": "borrow_limit"
    },
    {
      "label": "放款时间",
      "value": "",
      "type": "text",
      "name": "lending_time"
    },
    {
      "label": "付息时间",
      "value": "",
      "type": "text",
      "name": "interest_time"
    }
  ]

const defaultProps = {
};
class DetailHt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      customerForm: [],
      files: [],
      contractForm: [],
      logList: [],
    };
  }
  componentWillReceiveProps(nextProps) {


  }


  componentWillMount() {
  

  }

  componentDidMount() {
  
       this.upData();
    
     
  }

  upData = (callback) => { //更新表单数据
    let {orderInfo} = this.props;
 
    for (let i in orderInfo.contract) {
      
      form_tools.setArrObjVal(formData2, i, orderInfo.contract[i]);
    }

    for (let i in orderInfo.customer) {
      form_tools.setArrObjVal(formData1, i, orderInfo.customer[i]);
    }
    this.setState({ contractForm: formData2, customerForm: formData1  })
  }


  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  rendText=(obj)=>{
    return obj.map((o,i)=>{
      return (
        <div key={i} className="col-md-4 pb10">
          <span className="mr10 desalt-color">{o.label}</span>
          <span>{o.value||"-"}</span>
        </div>
      )
    })
  }
  render() {
    let {rendData, contractForm, customerForm, files, formData, modalShow, page, len} = this.state;
    let {orderInfo} = this.props;
    let cont = rendData.map(function (obj, idx) {
      return (<tr key={idx}>
        <td>
          <input name="select" checked={this.validChecked(obj.id)} onClick={() => { this.toggleChecked(obj.id) }} className="select-box" type="checkbox" />
        </td>
        <td>{obj.id}</td>
        <td><a href={"#/ads/details/edit/" + obj.id} className="">{obj.name}</a></td>
        <td>
          {obj.description}
        </td>
        <td>
          <div className="btn-group mb15">
            <a href={"#/ads/details/edit/" + obj.id} className="btn btn-sm btn-info">修改资料</a>
            <a href="javascript:;" onClick={() => { this.openLogs(obj.id) }} className="btn btn-sm btn-default">关闭订单</a>
            <button className="btn btn-warn" onClick={() => { this.openSh(obj.id) }} type="button">审核</button>
          </div>
        </td>
      </tr>);
    }, this)
    return (
      <div>
        <div className="wrapper">
          <section className="pt15 pl15 pr15 white-bg">
            <div className="pt15 pb15 ubb1 fuzzy-border">
              <div className="pb15">
                <h4 className="fs20 desalt-color">借款人信息</h4>
              </div>
              <div className="row">
                {this.rendText(customerForm)}
              </div>
            </div>
            <div className="pt15 pb15 ubb1 fuzzy-border">
              <div className="pb15">
                <h4 className="fs20 desalt-color">合同信息</h4>
              </div>
              <div className="row">
                {this.rendText(contractForm)}
              </div>
            
            </div>
            <div className="pt15 pb15 ubb1 fuzzy-border">
              <div className="">
                <h4 className="fs20 desalt-color">合同资料原件</h4>
              </div>
              <div className="table-responsive mt20 fixed-loading">
                <table className="table  table-striped ">
                  <tbody>
                    <tr className="table-head-tr">
                      <td>序号</td>
                      <td>名称</td>
                      <td>操作</td>
                    </tr>
                    {orderInfo.files && orderInfo.files.length > 0 && orderInfo.files.map((obj, idx) => {
                      return (
                        <tr key={idx} >
                          <td>{idx + 1}</td>
                          <td>{obj.name}</td>
                          <td><a href={obj.url||"javascript:;"} className="base-color">下载</a></td>
                        </tr>
                      );
                    })}


                  </tbody>
                </table>
              </div>

            </div>
          </section>
        </div>
      </div>

    );
  }
}

export default DetailHt;