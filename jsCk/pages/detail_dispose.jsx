
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
      selArr: [], //选择列表数组,保留,用于全选
      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      len: 30, //分页长度
      logList: [],
      searchTxt: "",
      disposeInfo: [],
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
    this.getDisposeCont();
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
  getDisposeCont = () => {
    fetch(`/property/dispose-info.do?property_id=${this.props.proper_id}`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            disposeInfo: data.data
          })
        } else if (data.code == "NO_DATA") {
          this.setState({
            disposeInfo: []
          })
        }

      });
  }
  upData = (callback) => { //更新表单数据
    let {page, len, searchTxt} = this.state;
    let {proper_id}=this.props;
    fetch('/property/dispose.do?' + tools.parseParam({ property_id:proper_id, title: searchTxt, page: page.page_index, len }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            rendData: data.data,
            page: data.page,
            selArr: [],
            loading: false
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          this.setState({
            rendData: [],
            selArr: [],
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
    let {rendData, loading, formData, modalShow, page, len, disposeInfo} = this.state;
    let {proper_id, orderInfo} = this.props;
    let isGoSub=orderInfo.permissions.indexOf('0601') >= 0;
    return (
      <div>

        <div className="wrapper">
          <section className="pt15 pl15 pr15 white-bg">
            <div className="pb20 ubb1 fuzzy-border mb20">
              <div >
                <div className=" pt15">
                  <h4 className="fs20 desalt-color">资产处置信息</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive ">
                  <table className="table mt20 table-striped ">
             
                    <tbody>
                      <tr className="table-head-tr">
                        <td>资产名称</td>
                        <td>客户姓名</td>
                        <td>仓库</td>
                        <td>收车成本</td>
                        <td>同行处置价（参考）</td>
                        <td>零售处置价（参考）</td>
                        <td>逾期天数(天)</td>
                      </tr>
                      {(() => {
                        if (disposeInfo.length == 0) {
                          return (<tr><td colSpan="7"  className="tc">{loading ? "正在加载中.." : "暂无数据"}</td></tr>);
                        } else {
                          return disposeInfo.map((obj, idx) => {
                            return (
                              <tr key={idx} >
                                <td>{obj.model_name}</td>
                                <td>{obj.client_name}</td>
                                <td>{obj.warehouse_no}</td>
                                <td>{obj.lending_amount}</td>
                                <td>{obj.peer_price}</td>
                                <td>{obj.retail_price}</td>
                                <td>{obj.overdue_day}</td>
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
                        return (<a className=" btn btn-info " href={"#/dzzc.html/" + proper_id + "/disposeitem"}>处置登记</a>)
                      } else {
                        return (<a className=" btn btn-default disabled" href="javascript:;">处置登记</a>)
                      }

                    })()}

                  </div>

                  <h4 className="fs20 desalt-color">处置处理</h4>
                </div>
              </div>
              <div>


                <div className="table-responsive ">
                  <table className="table mt20 table-striped ">
                  
                    <tbody>
                       <tr className="table-head-tr">
                        <td>购买客户</td>
                        <td>购买电话</td>
                        <td>处置日期</td>
                        <td>处置价格</td>
                        <td>登记人</td>
                        <td>处置状态</td>
                        <td>操作</td>
                      </tr>
                      {(() => {
                        if (rendData.length == 0) {
                          return (<tr><td colSpan="7" className="tc">{loading ? "正在加载中.." : "暂无数据"}</td></tr>);
                        } else {
                          return rendData.map((obj, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{obj.client_name}</td>
                                <td>{obj.client_phone}</td>
                                <td>{obj.dispose_time}</td>
                                <td>{obj.amount}万</td>
                                <td>{obj.apply_name}</td>
                                <td>{obj.status_name}</td>
                                <td>
                                  <div className=" mb15">
                                    <a className=" btn btn-info " href={"#/dzzc.html/" + proper_id + "/disposeitem/" + 123123 + "/" + obj.id}>记录</a>
                                  </div>
                                </td>
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
          </section>
        </div>
      </div>

    );
  }
}

export default DetailMove;