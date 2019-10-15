
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';
import Modal from '../src/Modal';
import Pager from '../src/Pager';
import Form from '../src/Form';
import Loading from '../src/Loading';
import Toast from '../src/Toast';
import Process from '../src/Process';
import tools from '../tools/public_tools';
import form_tools from '../tools/form_tools';

import FormCtrl from '../src/FormCtrl';
import FileSingle from '../src/FileSingle';
import Input from '../src/Input';
import Alert from '../src/Alert';
import { CheckRadio } from '../src/CheckRadio';
import { InputGroup } from '../src/InputGroup';




const FormDataPro =  //审核探客
  [
    {
      "name": "id",
      "label": "探客id",
      "value": "",
      "readOnly": true,
      "type": "text"
    },
    {
      "name": "status",
      "label": "审核状态",
      "value": "",
      "type": "radio",
      "checkradioStyle": "btn",
      "inline": true,
      "options": [
        { "name": "通过", "value": "1" },
        { "name": "不通过", "value": "2" }
      ]
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

class AdsCont extends Component {
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
      auditType: 'none',
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.openContId = ""
  }
  componentWillReceiveProps(nextProps) {


  }
  componentDidMount() {
    this.upData();

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
    let {page, len, searchTxt} = this.state;
    this.setState({
      loading: true
    })
    let postData;
    if(this.state.auditType=='none'){
      postData={ name: searchTxt, page: page.page_index, len}
    }else{
      postData ={ name: searchTxt, page: page.page_index, len, status: this.state.auditType }
    }
    fetch('oneyuan/category.do?' + tools.parseParam(postData), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {

          this.setState({
            rendData: data.data,
            // page: data.page,
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

    fetch('oneyuan/category.do', {
      method: "DELETE",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        ids: id instanceof Array?id.join(','):id
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
      child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的商品分类？</div>,
      conf: {
        footer: (
          <a href="javascript:;" onClick={() => {
            this.sureDelItem(id)
          } } className="btn btn-info">确定删除</a>)
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
    let formData = tools.deepCopy(FormDataPro)
    formData[0].value = id;
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
  rendlogs = () => {
    let {logList} = this.state;
    return (
      <div className="table-responsive fixed-loading">
        <table className="table mt20 table-striped ">
          <thead>
            <tr>
              <th>记录表id</th>
              <th>广告id</th>
              <th>管理员</th>
              <th>审核记录的时间</th>
              <th>备注</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (logList.length == 0) {
                return (<tr><td className="tc" >暂无记录</td></tr>)
              }
              return logList.map(function (obj, idx) {
                return (<tr key={idx}>
                  <td>{obj.id}</td>
                  <td>{obj.ads_id}</td>
                  <td>
                    {obj.admin_name}
                  </td>
                  <td>{obj.add_time}</td>
                  <td>{obj.remark}</td>
                  <td>{obj.ads_audit_status}</td>
                </tr>);
              }, this)
            })()}
          </tbody>
        </table>
      </div>

    )
  }
  handleAuditType = (num) => {
    this.setState({
      auditType: num
    }, () => {
      this.upData();
    });
  }
  handleAds = (id, status) => {
    let num = status == 0 ? 1 :3;
    fetch(`/ads/ads_manage_down.do?`+tools.parseParam({ id: id,status:num }), {
      method: "get",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      // body: tools.parseParam({
      //   status: num,
      //   remarks: data.remarks,
      //   id: id
      // })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        // this.toggleModal(1);
      });
  }
  render() {
    let {rendData, loading, formData, modalShow, page, len} = this.state;

    let cont = rendData.map(function (obj, idx) {
      return (<tr key={idx}>
        <td>
          <input name="select" checked={this.validChecked(obj.id)} onClick={() => { this.toggleChecked(obj.id) } } className="select-box" type="checkbox" />
        </td>
        <td>{obj.id}</td>
        <td>{obj.name}</td>
        <td>{obj.pid}</td>
        

        <td>

          <div className="btn-group mb15">
            <a href={"#/oneyuan/category/edit/" + obj.id} className="btn btn-sm btn-info">更新商品分类</a>
            {/*<a href="javascript:;" className="btn btn-sm btn-default" onClick={this.handleAds.bind(this, obj.id, obj.status)}>{obj.status == 1 ? "上线" : "下架"}</a>*/}
            {/* <button className="btn btn-warn" onClick={() => { this.openSh(obj.id) } } type="button">审核</button>*/}
          </div>
        </td>
      </tr>);
    }, this)
    let LoadCont = loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
    return (
      <div>

        <div className="wrapper">
          <section className="panel">

            <div className="panel-body">
              <div className="row">
                <div className=" col-md-9">
                  <div className="btn-group mb15">
                    <a href="#/oneyuan/category/edit" className="btn btn-info">添加商品分类</a>
                    <button className="btn btn-default" onClick={() => { this.removeItem("all") } } type="button">删除所选资源</button>
                    {/*<div className="inline-block  fs12 desalt-color  pb5  ml30  mr30">发布状态:</div>
                    <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "none")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "none" ? "btn-info" : "")}>所有状态</a>

                    <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "1")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "1" ? "btn-info" : "")}>已发布</a>
                    <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "3")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "3" ? "btn-info" : "")}>已下线</a>*/}

                  </div>
                </div>
                <div className=" col-md-3 pb10">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={this.state.searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => { this.upData() } } type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) } }></InputGroup>

                </div>
              </div>

              <div id="column-table">
                <Modal title="查看审核记录" maxWidth="1000" show={modalShow[0]} onClose={() => { this.toggleModal(0) } }>
                  {this.rendlogs()}
                </Modal>
                <Modal title="审核探客" sizeClass="sm" maxWidth="1000" show={modalShow[1]} onClose={() => { this.toggleModal(1) } }>
                  {modalShow[1] ? <Form formStyle="ver" formRendData={formData} onSubForm={this.subSh} /> : ""}
                </Modal>
                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped ">
                    <thead>

                      <tr>
                        <th>
                          <input name="select" checked={this.validCheckedAll()} onClick={() => { this.toggleCheckedAll() } } className="select-box" value="all" type="checkbox" />
                        </th>
                        <th>id</th>
                        <th>标题</th>
                        <th>父级id</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cont}
                    </tbody>
                  </table>

                  {LoadCont}

                </div>
                <div className="pb15">
                  <div className="row">
                    <div className="col-md-9 col-lg-10 pb10">
                      <Pager className=" " all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index} onSetSelIdx={this.onSetSelIdx} />
                    </div>
                    <div className="col-md-3  col-lg-2">
                      <InputGroup value={len} barHtml={<span className="btn gray-bg fs12">每页条数</span>} onValueChange={(val) => { this.textChange('len', val) } }></InputGroup>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    );
  }
}

AdsCont.defaultProps = defaultProps;
module.exports = AdsCont;