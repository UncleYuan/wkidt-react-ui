
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
class DetailOutIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      WarehouseLoading: true,
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
      WarehouseInfo: {},
      searchTxt: "",
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
    this.upData();
    this.getWarehouseInfo();
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
  getWarehouseInfo = () => {
    let {orderInfo} = this.props;
    if ('1,2,7,8,9,16,20,'.indexOf(orderInfo.status + ",") >= 0 || !orderInfo.warehouse_no) {
      this.setState({
        WarehouseLoading: false
      })
      return
    }
    fetch(`/property/warehouse/${orderInfo.warehouse_no}.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            WarehouseInfo: data.data,
            WarehouseLoading: false
          })
        } else if (data.code == "NO_DATA") {
          this.setState({
            WarehouseLoading: false
          })
        }
      });
  }
  upData = (callback) => { //更新表单数据
    let {page, len, searchTxt} = this.state;
    let {proper_id}=this.props;
    fetch('/property2/inout.do?' + tools.parseParam({ title: searchTxt, property_id:proper_id,page: page.page_index, len }), {
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
  validChecked = (id) => {
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll = () => {
    let rendData = this.state.rendData;
    for (let i in rendData) {
      if (tools.indexOf(this.state.selArr, rendData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked = (id) => {
    let selArr = this.state.selArr;
    if (tools.indexOf(selArr, id) >= 0) {
      selArr = tools.removeArr(selArr, id);
    } else {
      selArr.push(id);
    }
    this.setState({
      selArr: selArr
    });
  }
  toggleCheckedAll = () => {

    let newArr = [];

    if (this.state.selArr.length == 0) {
      for (let i in this.state.rendData) {
        newArr.push(this.state.rendData[i].id);
      }
    }
    this.setState({
      selArr: newArr
    });
  }




  sureDelItem = (id) => {

    let {page} = this.state;

    fetch('/explorer.do', {
      method: "DELETE",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        ids: id.join(',')
      })
    }).then(response => response.json())
      .then((data) => {
        Modal.close();
        if (data.code == "SUCCESS") {
          page.page_index = 1;
          this.setState({
            page
          })
          this.upData();
        }
        Toast.show({
          msg: data.info
        })
      });
  }
  removeItem = (id) => { //删除数据
    id = id != "all" ? id : this.state.selArr;
    if (id.length == 0) {
      Alert.show({
        cont: "请选择删除对象"
      })
      return;
    }
    Modal.show({
      child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的探客文章？</div>,
      conf: {
        footer: (
          <a href="javascript:;" onClick={() => {
            this.sureDelItem(id)
          }} className="btn btn-info">确定删除</a>)
      }

    })


  }
  openLogs = (id) => {
    this.openContId = id;
    this.toggleModal(0)
    fetch('/ads/ads_audit_record.do?' + tools.parseParam({ ads_id: id }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({ logList: data.data })
        } else {
          this.setState({ logList: [] })
        }
      });
  }
  openSh = (id) => {
    this.toggleModal(1);
    let formData = tools.deepCopy(FormDataPro);

    this.setState({ formData: formData || [] })
  }
  subSh = (data) => {
    Process.show();
    fetch(`/ads/ads_audit/${data.id}.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        status: data.status[0],
        remarks: data.remarks,
        id: data.id
      })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        this.toggleModal(1);
      });
  }



  checkPermissions = (status) => {
    let {orderInfo} = this.props;
    return orderInfo.inout_operation && orderInfo.inout_operation.indexOf(status) >= 0;
  }
  render() {
    let {rendData, loading, formData, modalShow, page, len, WarehouseLoading, WarehouseInfo} = this.state;
    let {order_id, orderInfo} = this.props;
    let isGoOut=orderInfo.permissions.indexOf('0801') >= 0;
    let isGoIn=orderInfo.permissions.indexOf('0101') >= 0;
    return (
      <div>

        <div className="wrapper">
          <section className="pt15 pl15 pr15 white-bg">
            <div className="pb20 ubb1 fuzzy-border mb20">
              <div >
                <div className=" pt15">

                  <h4 className="fs20 desalt-color">当前仓库信息</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive mt20">
                  <table className="table  table-striped ">
                 
                    <tbody>
                       <tr className="table-head-tr">
                        <td>仓库id</td>
          
                        <td>仓库编号</td>
                        <td>仓库联系人</td>
                        <td>电话</td>
                        <td>监控状态</td>
                      </tr>
                      {(() => {
                        
                        if (WarehouseLoading) {
                          return (
                            <tr>
                              <td colSpan='7' className="tc">
                                正在加载中...
                                      </td>
                            </tr>
                          )
                        } else if (typeof WarehouseInfo.id != "undefined") {
                          return (
                            <tr >
                              <td>{WarehouseInfo.id}</td>
             
                              <td>{WarehouseInfo.number}</td>
                              <td>{WarehouseInfo.master}</td>
                              <td>{WarehouseInfo.master_phone}</td>
                              <td>{WarehouseInfo.warehouse_no}</td>
                            </tr>
                          )
                        } else {
                          return (
                            <tr >
                              <td colSpan='7' className="tc">
                                无法查询到仓库信息
                                      </td>
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

                    <a className={" btn mr15  " + (isGoIn? "btn-info" : "disabled btn-default")} href={"#/dzzc.html/" + orderInfo.id + "/in"}>申请入库</a>
                    <a className={" btn  " + (isGoOut? "btn-info" : "disabled btn-default")} href={"#/dzzc.html/" + orderInfo.id + "/out"}>申请出库</a>
                  </div>

                  <h4 className="fs20 desalt-color">出入库记录</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive mt20">
                  <table className="table  table-striped ">
               
                    <tbody>
                      <tr className="table-head-tr">
                        <td>业务</td>
                        <td>时间</td>
                        <td>仓库编号</td>
                        <td>业务经办人</td>
                        <td>仓库交接人</td>
                        <td>审核人</td>
                        <td>状态</td>
                        <td>操作</td>
                      </tr>
                      {rendData.map((obj, key) => {
                        return (
                          <tr key={key}>
                            <td>{obj.type == 1 ? "入库" : "出库"}</td>
                            <td>{obj.update_time}</td>
                            <td>{obj.warehouse_no}</td>
                            <td>{obj.apply_name}</td>
                            <td>{obj.connect_name}</td>
                            <td>{obj.user_name}</td>
                            <td className="base-color">{obj.status_name}</td>
                            <td>
                              <div className="btn-group mb15">

                                <a className=" btn btn-info " href={"#/dzzc.html/" + orderInfo.id + "/" + (obj.type == 1 ? "in" : "out") + "/" + 123123 + '/' + obj.id}>记录</a>

                              </div>
                            </td>
                          </tr>
                        )
                      })}

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

export default DetailOutIn;