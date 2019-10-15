
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


const FormDataPro =  //审核探客
  [


    {
      "label": "状态选择",
      "value": [],
      "inline": true,
      "type": "radio",
      "options": [
        {
          name: "验车完成",
          value: 1
        },
        {
          name: "未合格",
          value: 0
        }
      ]
    },
    {
      "label": "车辆评价",
      "value": [],
      "inline": true,
      "type": "radio",
      "options": [
        {
          name: "优",
          value: 1
        },
        {
          name: "普通",
          value: 0
        }
      ]
    },
    {
      "name": "remarks",
      "label": "验车综评",
      "value": "",
      "type": "textarea"
    }
  ]

const formData1 =  //审核探客
  [


    {
      "label": "车辆编号",
      "value": [],
      "type": "select-single",
      "options": [
        {
          name: "287341621",
          value: 1
        },
        {
          name: "287341622",
          value: 0
        }
      ]
    },
    {
      "label": "仓库编号",
      "value": [],
      "type": "select-single",
      "options": [
        {
          name: "C1234",
          value: 1
        },
        {
          name: "C1232",
          value: 0
        }
      ]
    },
    {
      "label": "仓库管理员",
      "value": [],
      "type": "select-single",
      "options": [
        {
          name: "B2323",
          value: 1
        },
        {
          name: "B2321",
          value: 0
        }
      ]
    },
    {

      "label": "附件",
      "value": "",
      "type": "file-group"
    },
    {
      "name": "remarks",
      "label": "备注",
      "value": "",
      "type": "textarea"
    }
  ]

const defaultProps = {
};
class DetailMove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      len: 30, //分页长度
      logList: [],
      searchTxt: "",
      deferInfo: [], //资产逾期信息
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
    this.getDeferCont();
  }
  textChange = (name, val) => {
    let setState = {};
    setState[name] = val;
    this.setState(setState);
    if (name == "len") {
      clearTimeout(this.timer);
      let page = this.state.page;
      page.page_index = 1;
      this.setState({
        page: page
      })
      this.timer = setTimeout(() => {
        this.upData();
      }, 500)
    }
  }
  upData = (callback) => { //更新列表数据
    let {page, len, searchTxt} = this.state;
    let {proper_id}=this.props;
    fetch('/property/defer.do?' + tools.parseParam({property_id:proper_id, title: searchTxt, page: page.page_index, len }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            rendData: data.data,
            loading: false
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          this.setState({
            rendData: [],
            loading: false
          })
        }
        if (callback) callback();
      });

  }
  getDeferCont = () => {
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

  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }


  render() {
    let {rendData, loading, formData, modalShow, page, len, deferInfo} = this.state;
    let {proper_id, orderInfo} = this.props;
    let isGoSub=orderInfo.permissions.indexOf('0301') >= 0;
    let ctLoan=orderInfo.permissions.indexOf('0701')>=0;
    return (
      <div>
        <div className="wrapper">
          <section className="pt15 pl15 pr15 white-bg">
            <div className="pb20 ubb1 fuzzy-border mb20">
              <div >
                <div className=" pt15">
                  <h4 className="fs20 desalt-color">收息信息</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive mt20 ">
                  <table className="table table-striped ">
          
                    <tbody>
                       <tr className="table-head-tr">
                        <td>客户</td>
                        <td>电话</td>
                        <td>仓库</td>
                        <td>下次收息日期</td>
                        <td>期数</td>
                        <td>利息金额</td>
                        <td>融资利息</td>
                        <td>付息时间</td>
                      </tr>
                      {(() => {
                        if (deferInfo.length > 0) {
                          return deferInfo.map((obj, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{obj.customer_name}</td>
                                <td>{obj.customer_phone}</td>
                                <td>{obj.warehouse_no}</td>
                                <td>{obj.next_date}</td>
                                <td>{obj.nper}</td>
                                <td>{obj.received}</td>
                                <td>{obj.interest}</td>
                                <td>{obj.pay_time}</td>
                              </tr>
                            )
                          })
                        } else {
                          return (
                            <tr >
                              <td className="tc" colSpan="8">暂无数据</td>
                            </tr>
                          )
                        }
                      })()}

                    
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="pb10 pt15">
              <div >
                <div className="clearfix">
                  <div className="fr ">
                    {(() => {
                      if (isGoSub) {
                        return (<a className=" btn btn-info " href={"#/dzzc.html/" + proper_id + "/deferitem/"+(orderInfo.redemption_count+"-"+123123)}>收息登记</a>)
                      } else {
                        return (<a className=" btn btn-default disabled" href="javascript:;">收息登记</a>)
                      }
                    })()}
                    {ctLoan?<a className=" btn btn-warn ml15" href="javascript:;">申请续贷</a>:null}
                  </div>
                  <h4 className="fs20 desalt-color">收息记录</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive mt20">
                  <table className="table  table-striped ">
       
                    <tbody>
                       <tr className="table-head-tr">
                        <td>期数</td>
                        <td>仓库</td>
                        <td>付息时间</td>
                        <td>利息金额</td>
                        <td>融资利息</td>
                        <td>申请人</td>
                        <td>审核人</td>
                        <td>收息完成时间</td>
                        <td>操作</td>
                      </tr>
                       {(() => {
                        if (rendData.length > 0) {
                          return rendData.map((obj, key) => {
                            return (
                              <tr key={key}>
                                <td>{obj.nper + "/" + obj.redemption_count}</td>
                                <td>{obj.warehouse_no}</td>
                                <td>{obj.pay_time}</td>
                                <td>{obj.received}</td>
                                <td>{obj.interest}</td>
                                <td>{obj.apply_name}</td>
                                <td>{obj.user_name}</td>
                                <td>{obj.update_time}</td>
                                <td>
                                  <div className="btn-group mb15">
                                    <a className=" btn btn-info " href={"#/dzzc.html/" + orderInfo.id + "/deferitem/" + (orderInfo.redemption_count+"-"+123123) + '/' + obj.id}>记录</a>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        } else{
                          return (
                            <tr >
                              <td className="tc" colSpan="9">暂无数据</td>
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
      </div>

    );
  }
}

export default DetailMove;