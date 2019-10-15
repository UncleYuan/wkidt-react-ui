
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

const typeOptions = [
  {
    name: "初审",
    value: "first"
  },
  {
    name: "查档",
    value: "whthin"
  },
  {
    name: "验车",
    value: "inspection"
  },
  {
    name: "终审",
    value: "final"
  },
  {
    name: "核验",
    value: "check"
  },
  {
    name: "放款",
    value: "lending"
  }
]
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
const stepArr = ["first", "whthin", "inspection", "final", "check", "lending"];
const defaultProps = {
};
class DetailChuPing extends Component {
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
      typeSel: props.params.listType ? props.params.listType.split(',') : [],
      typeSelOrder:"",
      logList: [],
      searchTxt: "",
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.openContId = ""
    this.timer = (new Date()).valueOf();
  }
  componentWillReceiveProps(nextProps) {


  }


  componentWillMount() {
    this.upData();
  }

  componentDidMount() {


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
  upData = (callback) => { //更新表单数据
    let { page, len, searchTxt, typeSel,typeSelOrder } = this.state;
    this.setState({
      loading: true
    })


    fetch('/property/order.do?' + tools.parseParam({ steps: typeSel.join(','), title: searchTxt, page: page.page_index, len,order:typeSelOrder }), {
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
        } else {
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

    let { page } = this.state;

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

  filterStep = (status, obj, idx) => {
    let resText = "-";
    if (status == 0) {

      resText = stepArr[idx] == obj.steps ? (stepArr[idx] == "inspection" ? "立即验车" : "立即申请") : "-";
    } else if (status == 1) {
      resText = "进行中";
    } else if (status == 2) {
      resText = "通过";
    } else if (status == 3) {
      resText = "未通过";
    }
    if (stepArr[idx] == obj.steps) {
      return (<a className="base-color" href={"#/zc.html/" + obj.id + '/' + obj.steps}>{resText}</a>);
    }
    return resText;
  }
  listTypeChange = (val) => {
    let now = (new Date()).valueOf();
    let { page, typeSel } = this.state;
    page.page_index = 1;
    typeSel = val;
    this.setState({ page, typeSel }, () => {

      this.upData()

    })

  }
  sureCloseOrder = (id, name,del=false) => {
    Modal.show({
      title: "关闭确定",
      child: <div className="fs14 ">确认是否要{del?"删除":"关闭"}车型为 <span className="base-color">{name}</span> 的订单？</div>,
      conf: {
        footer: (
          <a href="javascript:;" onClick={() => {
            this.closeOrder(id,del)
          }} className="btn btn-info">确定{del?"删除":"关闭"}</a>)
      }

    })
  }
  closeOrder = (id,del=false) => {
    let subData=del?{ ids: id}:{ order_id: id};
    fetch(del?"/order.do":'/property/close.do', {
      method: del?"DELETE":"PUT",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(subData)
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          Modal.close();
          this.upData();
        }
        Toast.show({
          msg: data.info
        })
      });
  }
  orderSelTurn=(type)=>{
    let {typeSelOrder,page}=this.state;
    typeSelOrder=type==typeSelOrder?"":type;
    page.page_index = 1;
    this.setState({typeSelOrder,page},()=>{
      this.upData();
    });
   
  }
  render() {
    let { rendData, typeSelOrder,loading, formData, modalShow, page, len, typeSel } = this.state;
    let LoadCont = loading ? <div className="fixed-loading-bg"><Loading /></div> : "";

    let cont = rendData.map(function (obj, idx) {
      let isClose = obj.permissions.indexOf('0701') >= 0;
      let isDel = obj.permissions.indexOf('0801') >= 0;
      return (<tr key={idx}>
        <td>
          <input name="select" checked={this.validChecked(obj.id)} onClick={() => { this.toggleChecked(obj.id) }} className="select-box" type="checkbox" />
        </td>
        <td><a href={"#/zc.html/" + obj.id + '/' + obj.steps}>{obj.order_number}</a></td>
        <td>{obj.shop_name}</td>
        <td>{obj.model_name}</td>
        <td>{obj.plate_number}</td>
        <td>{obj.customer_name}</td>
        <td>{obj.first_limit}</td>
        <td>{(obj.end_limit&&Number(obj.end_limit)==0)||!obj.end_limit?"-":obj.end_limit}</td>
        
        <td>{this.filterStep(obj.query_archives_status, obj, 1)}</td>
        <td>{this.filterStep(obj.check_car_status, obj, 2)}</td>
        <td>{this.filterStep(obj.end_audit_status, obj, 3)}</td>
        <td>{this.filterStep(obj.real_name_check_status, obj, 4)}</td>
        <td>{obj.lending_amount == '0.00' || obj.lending_amount =='0' || obj.lending_amount ==false ? '-' : obj.lending_amount}</td>
        <td>{obj.add_time}</td>
        <td className="base-color">{obj.status_name}</td>
        <td>
          <div className=" mb15 btn-group">
            <a href={"#/zc.html/" + obj.id + '/' + obj.steps} className="btn btn-sm btn-info">订单详情</a>
            {isClose ? <a href="javascript:;" onClick={() => { this.sureCloseOrder(obj.id, obj.model_name) }} className="btn btn-sm btn-default">关闭订单</a> : null}
            {isDel ? <a href="javascript:;" onClick={() => { this.sureCloseOrder(obj.id, obj.model_name,true) }} className="btn btn-sm btn-warn">删除订单</a> : null}
          </div>
        </td>
      </tr>);
    }, this)
    return (
      <div>

        <div className="wrapper">
          <section className="p15 white-bg">
            <div>
              <div className="row">
                <div className=" col-md-9 clearfix mb15">
                  <a className="fr btn btn-info fs13" href="#/first" >添加订单</a>
                  <h4 className="fs20">订单列表</h4>

                  {/*<button  className="btn btn-default" onClick={ ()=>{ this.removeItem("all")}} type="button">删除所选资源</button>*/}

                </div>
                <div className=" col-md-3 pb10">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={this.state.searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => { this.upData() }} type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) }}></InputGroup>
                </div>
              </div>
              <div className="pb10">

                <CheckRadio type="radio" checkradioStyle="btn" options={typeOptions} inline={true} value={typeSel} onValueChange={this.listTypeChange} ></CheckRadio>
              </div>
              <div>
                <Modal title="添加处置记录" show={modalShow[1]} onClose={() => { this.toggleModal(1) }}>
                  {modalShow[1] ? <Form formStyle="ver" formRendData={formData1} onSubForm={this.subSh} /> : ""}
                </Modal>
                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped ">

                    <tbody>
                      <tr className="table-head-tr">
                        <td>id</td>
                        <td>订单流水号</td>
                        <td>门店</td>
                        <td>车型</td>
                        <td>车牌号</td>
                        <td>车主姓名</td>
                        <td>初审额度(万元)</td>
                        <td>终审额度(万元)</td>
                        <td className={"pointer "+(typeSelOrder=="whthin"?"base-color":"")} onClick={()=>{ this.orderSelTurn("whthin") }} >查档</td>
                        <td className={"pointer "+(typeSelOrder=="inspection"?"base-color":"")} onClick={()=>{ this.orderSelTurn("inspection") }}  >验车</td>
                        <td className={"pointer "+(typeSelOrder=="final"?"base-color":"")} onClick={()=>{ this.orderSelTurn("final") }}  >终审</td>
                        <td className={"pointer "+(typeSelOrder=="check"?"base-color":"")} onClick={()=>{ this.orderSelTurn("check") }}  >核验</td>
                        <td className={"pointer "+(typeSelOrder=="lending"?"base-color":"")} onClick={()=>{ this.orderSelTurn("lending") }} >放款</td>
                        <td>添加时间</td>
                        <td>订单状态</td>
                        <td>订单操作</td>
                      </tr>
                      {cont}
                    </tbody>
                  </table>
                  {LoadCont}
                </div>
                <div className="row">
                  <div className="col-md-9 col-lg-10 pb10">
                    <Pager className=" " all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index} onSetSelIdx={this.onSetSelIdx} />
                  </div>
                  <div className="col-md-3  col-lg-2">
                    <InputGroup value={len} barHtml={<span className="btn gray-bg fs12">每页条数</span>} onValueChange={(val) => { this.textChange('len', val) }}></InputGroup>


                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div >

    );
  }
}

export default DetailChuPing;