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
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      len: 30, //分页长度
      logList: [],
      searchTxt: "",
      redemptionInfo: [],
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
    this.getRedemptionCont();
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
  getRedemptionCont = () => {
    fetch(`/property/redemption-info.do?property_id=${this.props.proper_id}`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            redemptionInfo: data.data
          })
        } else if (data.code == "NO_DATA") {
          this.setState({
            redemptionInfo: []
          })
        }

      });
  }
  upData = (callback) => { //更新表单数据
    let {page, len, searchTxt} = this.state;
    let {proper_id} = this.props;
    fetch('/property/redemption.do?' + tools.parseParam({ property_id: proper_id, page: page.page_index, len }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            rendData: data.data,
            page: data.page,
            loading: false
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          this.setState({
            rendData: [],
            page: {
              page_count: 0,
              page_index: 1,
              record_count: 0
            },
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


  onSetSelIdx = (idx) => { //选择分页回调
    let page = this.state.page;
    page.page_index = idx;
    this.setState({
      page: page
    });
    this.upData();
  }




  render() {
    let {rendData, loading, formData, modalShow, page, len, redemptionInfo} = this.state;
    let {proper_id,orderInfo} = this.props;
    let isGoSub=orderInfo.permissions.indexOf('0501') >= 0;
    return (
      <div>

        <div className="wrapper">
          <section className="pt15 pl15 pr15 white-bg">
            <div className="pb20 ubb1 fuzzy-border mb20">
              <div >
                <div className=" pt15">
                  <h4 className="fs20">资产赎回信息</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive ">
                  <table className="table mt20 table-striped ">
                  
                    <tbody>
                       <tr className="table-head-tr">
                        <td>资产名称</td>
                        <td>客户姓名</td>
                        <td>应付本金</td>
                        <td>应付融资本金</td>
                        <td>逾期罚息</td>
                        <td>仓库</td>
                      </tr>
                      {(() => {
                        if (redemptionInfo.length == 0) {
                          return (<tr><td colSpan="7" className="tc">{loading ? "正在加载中.." : "暂无数据"}</td></tr>);
                        } else {
                          return redemptionInfo.map((obj, idx) => {
                            return (
                              <tr key={idx} >
                                <td>{obj.model_name}</td>
                                <td>{obj.customer_name}</td>
                                <td>{obj.lending_amount}</td>
                                <td>{obj.financing}</td>
                                <td>{obj.overdue_interest}</td>
                                <td>{obj.warehouse_no}</td>
                              </tr>
                            )
                          })
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
                        return (<a className=" btn btn-info " href={"#/dzzc.html/" + proper_id + "/redemptionitem"}>赎回登记</a>)
                      } else {
                        return (<a className=" btn btn-default disabled" href="javascript">赎回登记</a>)
                      }

                    })()}
                  </div>

                  <h4 className="fs20">赎回处理</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive ">
                  <table className="table mt20 table-striped ">
              
                    <tbody>
                      <tr className="table-head-tr">
                        <td>资产名称</td>
                        <td>客户姓名</td>
                        <td>应付本金</td>
                        <td>应付融资本金</td>
                        <td>逾期罚息</td>
                        <td>申请人</td>
                        <td>审核人</td>
                        <td>赎回状态</td>
                        <td>操作</td>
                      </tr>
                      {(() => {
                        if (rendData.length > 0) {
                          return rendData.map((obj, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{redemptionInfo[0] ? redemptionInfo[0].model_name : "-"}</td>
                                <td>{redemptionInfo[0] ? redemptionInfo[0].customer_name : "-"}</td>
                                <td>{redemptionInfo[0] ? redemptionInfo[0].lending_amount : "-"}</td>
                                <td>{redemptionInfo[0] ? redemptionInfo[0].financing : "-"}</td>
                                <td>{redemptionInfo[0] ? redemptionInfo[0].overdue_interest : "-"}</td>
                                <td>{obj.apply_name}</td>
                                <td>{obj.user_name}</td>
                                <td>{obj.status_name}</td>
                                <td><a href={"#/dzzc.html/" + proper_id + "/redemptionitem/test/"+obj.id} className="btn btn-info">查看记录</a></td>
                              </tr>
                            );
                          })

                        } else {
                          return (
                              <tr>
                                <td className="tc" colSpan="7">暂无数据</td>
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