
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


class WarehouseList extends Component {
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
      searchTxt: ""
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
    this.setState({
      loading: true
    })


    fetch('/property/warehouse.do?' + tools.parseParam({ title: searchTxt, page: page.page_index, len }), {
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
  sureDelItem = (id) => {
    let { page } = this.state;
    fetch('/property/warehouse.do', {
      method: "DELETE",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        ids: id instanceof Array ? id.join(',') : id
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
      child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的仓库？</div>,
      conf: {
        footer: (
          <a href="javascript:;" onClick={() => {
            this.sureDelItem(id)
          }} className="btn btn-info">确定删除</a>)
      }
    })
  }
  render() {
    let { rendData, loading, modalShow, page, len } = this.state;
    let { userInfo } = this.props;
    let isAdd = userInfo.permissions.indexOf('0501') >= 0;
    let isEdit = userInfo.permissions.indexOf('0503') >= 0;
    let isDel = userInfo.permissions.indexOf('0502') >= 0;

    let cont = rendData.map(function (obj, idx) {
      return (<tr key={idx}>

        <td>{obj.id}</td>
        <td><a href={"#/video/" + obj.id} className="">{obj.number}</a></td>
        <td>
          {obj.name}
        </td>
        <td>
          {obj.agent_name}
        </td>
        <td>
          {obj.master}
        </td>
        <td>
          {obj.master_phone}
        </td>
        <td>
          {obj.update_time}
        </td>
        <td>
          <div className=" mb15">
            <div className="btn-group">
              <a href={"#/video/" + obj.id} className="btn btn-sm btn-info">查看监控</a>
              <a href={"#/videolist/" + obj.id} className="btn btn-sm btn-info">监控列表</a>
              {isEdit ? <a href={"#/warehouse/edit/" + obj.id} className="btn btn-sm btn-info">编辑仓库</a> : null}
              <a href={"#/spacelist/" + obj.name + "/" + obj.id} className="btn btn-sm btn-warn">区域列表</a>
              {isDel ? <a className="btn btn-sm btn-default" onClick={() => { this.removeItem(obj.id) }} >删除内容</a> : null}
            </div>
          </div>
        </td>
      </tr>);
    }, this)
    return (
      <div>

        <div className="wrapper">
          <section className="p15 white-bg">
            <div>
              <div className="">
                <div className="pb15 clearfix">
                  {isAdd ? <a href="#/warehouse/add" className="btn btn-info fr">添加仓库</a> : null}
                  <h4 className="fs20">仓库列表</h4>
                </div>
              </div>
              <div>

                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped ">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>仓库编号</th>
                        <th>仓库名称</th>
                        <th>所属代理商</th>
                        <th>负责人</th>
                        <th>负责人电话</th>
                        <th>更新时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cont}
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

export default WarehouseList;