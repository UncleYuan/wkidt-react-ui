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

import { FileGroup } from '../../src/FileGroup';

var deepCopy = tools.deepCopy;




const defaultProps = {
};

class MainCont extends Component {
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
      len: 25, //分页长度
      searchTxt: "",
    };
    this.timer = null;
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
    fetch('/property/inspection/category.do?' + tools.parseParam({ page: page.page_index, len, title: searchTxt }),
      {
        method: "get",
        credentials: 'same-origin',

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
      });


  }
  eidtColumn(id, name) { //编辑数据
    location.hash = "#/property/monitor_edit/edit/" + id + "/" + name;
  }
  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  addColumn() { //添加数据
    location.hash = "#/property/monitor_edit/add"
  }
  onSetSelIdx = (idx) => { //选择分页回调
    let {page} = this.state;
    page.page_index = idx;
    this.setState({
      page: page
    });
    this.upData();
  }
  validChecked(id) {
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll() {
    let {rendData, selArr} = this.state;
    for (let i in rendData) {
      if (tools.indexOf(selArr, rendData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked = (id) => {
    let {selArr} = this.state;
    if (tools.indexOf(selArr, id) >= 0) {
      selArr = tools.removeArr(selArr, id);
    } else {
      selArr.push(id);
    }
    this.setState({
      selArr
    });
  }
  toggleCheckedAll = () => {
    let {selArr, rendData} = this.state;
    let newArr = [];

    if (selArr.length == 0) {
      for (let i in rendData) {
        newArr.push(rendData[i].id);
      }
    }
    this.setState({
      selArr: newArr
    });
  }
  sureDelItem = (id) => {
    let {page} = this.state;
    fetch('/property/inspection/category.do', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({ ids: id })
    }).then(response => response.json())
      .then((data) => {
        Modal.close();
        if (data.code == "SUCCESS") {
          page.page_index = 1;
          this.setState({
            page: page
          })
          this.upData();

        }
        Toast.show({
          msg: data.info
        })
      });

  }
  removeItem = (id) => { //删除数据

    let {selArr, page} = this.state;
    id = id != "all" ? id : selArr;
    if (id.length == 0) {
      Alert.show({
        cont: "请选择删除对象"
      })
      return;
    }
    Modal.show({
      child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的验车分类？</div>,
      conf: {
        footer: (
          <a href="javascript:;" onClick={() => {
            this.sureDelItem(id)
          }} className="btn btn-info">确定删除</a>)
      }

    })

 

  }
  render() {
    let {rendData, loading, page, len, searchTxt} = this.state;

    let cont = rendData.map((obj, idx) => {
      return (


        <tr key={idx}>
          <td>
            <input name="select" checked={this.validChecked.bind(this, obj.id)()} onClick={this.toggleChecked.bind(this, obj.id)} className="select-box" type="checkbox" />
          </td>
          <td>{obj.id}</td>
          <td><a href={"#/property/monitor_edit/edit/" + obj.id + "/" + obj.name}>{obj.name}</a></td>
          <td>{obj.add_time}</td>
          <td>{obj.update_time}</td>
          <td>
            <div className="btn-group fs12 mb15">
              <a href="javascript:;" onClick={() => { this.eidtColumn(obj.id, obj.name); }} className="btn btn-sm btn-info">设置验车分类</a>
              <a href={"#/property/monitor_item_list/" + obj.id + "/" + obj.name} className="btn btn-sm btn-info">查看分类项目</a>
              <a className="btn btn-sm btn-default" onClick={() => { this.removeItem(obj.id) }}  href="javascript:;">删除验车分类</a>
            </div>
          </td>
        </tr>
      );
    })
    let LoadCont = loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
    return (
      <div>

        <div className="wrapper">
          <section className="panel p15">


            <div className="panel-body">
              <div className="row">
                <div className=" col-md-9">
                  <div className="btn-group fs12 mb15">
                    <a href="javascript:;" onClick={this.addColumn} className="btn btn-info">添加验车分类</a>

                    <a className="btn btn-default" onClick={this.removeItem.bind(this, "all")}  href="javascript:;">删除所选验车分类</a>
                  </div>
                </div>
                <div className=" col-md-3">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={searchTxt} barHtml={<a  href="javascript:;" className="btn btn-info fs12" onClick={() => { this.upData() }} >搜索</a>} onValueChange={(val) => { this.textChange("searchTxt", val) }}></InputGroup>
                </div>
              </div>
              <div id="column-table">


                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped fs12">
                    <thead>

                      <tr>
                        <th>
                          <input name="select" checked={this.validCheckedAll.bind(this)()} onClick={this.toggleCheckedAll.bind(this)} className="select-box" value="all" type="checkbox" />
                        </th>
                        <th>验车分类id</th>
                        <th>验车分类名</th>
                        <th>添加时间</th>
                        <th>更新时间</th>

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
                      <InputGroup value={len} barHtml={<span className="btn gray-bg fs12">每页条数</span>} onValueChange={(val) => { this.textChange('len', val) }}></InputGroup>

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

module.exports = MainCont;