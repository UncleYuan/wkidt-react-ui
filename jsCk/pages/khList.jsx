
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


class KhList extends Component {
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
    let { page, len, searchTxt } = this.state;
  

    fetch('/customer.do?' + tools.parseParam({ keyword: searchTxt, page: page.page_index, len }), {
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

  render() {
    let { rendData, loading, formData, modalShow, page, len } = this.state;

    
    return (
      <div>

        <div className="wrapper">
          <section className="p15 white-bg">
            <div>
              <div className="row">
                <div className=" col-md-9">
                  {/*<a className="fr btn btn-info fs13" href="#/cp/add.html" >添加申请</a>*/}
                  <h4 className="fs20">所有客户</h4>

                  {/*<button  className="btn btn-default" onClick={ ()=>{ this.removeItem("all")}} type="button">删除所选资源</button>*/}

                </div>
                <div className=" col-md-3 pb10">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={this.state.searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => { this.upData() }} type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) }}></InputGroup>

                </div>
              </div>
              <div>
                <Modal title="添加处置记录" show={modalShow[1]} onClose={() => { this.toggleModal(1) }}>
                  {modalShow[1] ? <Form formStyle="ver" formRendData={formData1} onSubForm={this.subSh} /> : ""}
                </Modal>
                <div className="table-responsive fixed-loading">
                  <table className="table  table-striped ">

                    <tbody>
                      <tr className="table-head-tr">
                        <td>客户姓名</td>
                        <td>手机号码</td>
                        <td>性别</td>
                        <td>地区</td>
                        <td>类型</td>
                        <td>最后回访</td>
                        <td>业务数量</td>
                        <td>入库操作</td>
                      </tr>
                      {rendData.map(function (obj, idx) {
                        return (
                          <tr key={idx}>
                            <td>{obj.name}</td>
                            <td>{obj.contact}</td>
                            <td>{obj.sex == 1 ? "男" : "女"}</td>

                            <td>{obj.city}</td>

                            <td>{obj.type_name}</td>
                            <td>{obj.last_visit}</td>
                            <td>{obj.business}</td>
                            <td>
                              <div className="btn-group">
                                <a href={"#/kh/" + obj.id} className="btn btn-info">详细信息</a>

                              </div>
                            </td>
                          </tr>)
                      })}
                    </tbody>
                  </table>
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
      </div>

    );
  }
}

export default KhList;