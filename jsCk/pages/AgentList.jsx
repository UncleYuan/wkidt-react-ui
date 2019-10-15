
import React, {
  Component,
  PropTypes
} from 'react';

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


const typeTree = function (result, parent_id, idname, parentidname) {
  let arr = [];

  for (let i in result) {
    if (result[i][(parentidname ? parentidname : "pid")] == parent_id) {
      result[i].children = typeTree(result, result[i][(idname ? idname : "id")], idname, parentidname);
      arr.push(result[i]);
    }
  }

  return arr;

}

const turnSelect = (data) => {
  let newArr = [];
  newArr.push({ name: '顶级', value: 0 });
  for (let i in data) {
    newArr.push({ name: data[i].nameTurn, value: data[i].id });
  }
  return newArr;
}

const turnList = (data, l,namekey="name",lstr="0") => {

  l = parseInt(l);
  let arr = [];
  let txt = '';
  let addChild = '';
  for (let i = 0; i < l; i++) {
    if (i == 0) {
      txt += '├';
    }
    txt += '─';
  }

  for (let j in data) {
    data[j].nameTurn = txt + data[j][namekey];
    data[j].contShow = parseInt(l)<=2?true:false;
    data[j].openContShow = parseInt(l)<=1?true:false;
    data[j].lstr = lstr+"-"+j;
     data[j].l=l;
    arr.push(data[j]);
    if (data[j].children && data[j].children.length > 0) {
      arr = arr.concat(turnList(data[j].children, l + 1,namekey,data[j].lstr));
    }
  }
  return arr;
}

const defaultProps = {
};
class AgentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      qxData: [],

      searchTxt: ""
    };
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
      this.timer = setTimeout(() => {
        this.upData();
      }, 500)
    }
  }
  upData = (callback) => { //更新表单数据
    var _this = this;
    _this.setState({
      loading: true
    })
    let { searchTxt } = this.state;
    fetch('/agent/details-list.do?' + tools.parseParam({ page: 1, len: 10000, agent_name: searchTxt }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          _this.setState({
            rendData:turnList(typeTree(data.data,'0','id','parent_id'), 1,'agent_name'),
            loading: false
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          _this.setState({
            rendData: [],
            loading: false
          })
        }
        if (callback) callback();
      });

  }


  toggleModal = (i) => { //切换弹窗显示
    let { modalShow } = this.state;
    modalShow[i] = !modalShow[i]
    this.setState({ modalShow: modalShow })
  }


  validChecked = (id) => {
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll = () => {
    let { rendData, selArr } = this.state;
    for (let i in rendData) {
      if (tools.indexOf(selArr, rendData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked = (id) => {
    let { selArr } = this.state;
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
    let { rendData, selArr } = this.state;
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

    fetch('/agent.do', {
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
      child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的代理商？</div>,
      conf: {
        footer: (
          <a href="javascript:;" onClick={() => {
            this.sureDelItem(id)
          }} className="btn btn-info">确定删除</a>)
      }
    })
  }
  turnShow=(obj)=>{
    let {rendData}=this.state;
   
    for(let i in rendData){
      console.log(rendData[i].level-obj.level)
      if(rendData[i].l-obj.l==1&&rendData[i].lstr.length>obj.lstr.length&&rendData[i].lstr.substring(0,obj.lstr.length)==obj.lstr){
        
        rendData[i].contShow=!obj.openContShow;
      }
    }
     for(let i in rendData){
      if(rendData[i].id==obj.id){
        rendData[i].openContShow=!rendData[i].openContShow;
      }
    }
    this.setState({rendData});
  }
  render() {
    let { rendData, loading, searchTxt, qxData, modalShow } = this.state;
    let cont = rendData.map(function (obj, idx) {

      return (<tr key={idx} style={{display:(obj.contShow&&!searchTxt)||(searchTxt&&obj.agent_name.indexOf(searchTxt)>=0)?"table-row":"none",width:"100%"}}>
        <td>
          <input name="select" checked={this.validChecked(obj.id)} onClick={() => { this.toggleChecked(obj.id) }} className="select-box" type="checkbox" />
        </td>
        <td>{obj.nameTurn} {obj.children&&obj.children.length>0&&searchTxt.length==0?<a onClick={()=>{ this.turnShow(obj) }} href="javascript:;" className="base-color">{obj.openContShow?"收起":"展开"}</a>:''}</td>
        <td>{obj.level}</td>
        <td>{obj.parent_name}</td>
        <td>{obj.master_name}</td>
        <td>{obj.phone}</td>
        <td>{obj.company_addr}</td>
        <td>{obj.join_date}</td>
        <td>{obj.deposit}</td>
        <td>
          <div className="btn-group mb15">
            <a href={"#/agent/info/edit/" + obj.id} className="btn btn-sm btn-info">更新代理商</a>
            <a href={"#/user/list.html/" + obj.id+"/"+decodeURIComponent(obj.agent_name)} className="btn btn-sm btn-warn">代理商员工</a>
            <button className="btn btn-sm btn-default" onClick={() => { this.removeItem(obj.id) }} type="button">删除代理商</button>
          </div>
        </td>
      </tr>);
    }, this)
    let LoadCont = loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
    return (
      <div>
        <div className="wrapper">
          <section className="panel p15">
            <div className="panel-body">
              <h4 className="fs20 pb15">代理商管理</h4>
              <div className="row">
                <div className=" col-md-9">
                  <div className="btn-group mb15">
                    <a href="#/agent/info/add" className="btn btn-info">添加代理商</a>

                    <a href="javascript:;" className="btn btn-default" onClick={() => { this.removeItem("all") }} >删除所选代理商</a>
                  </div>
                </div>
                <div className=" col-md-3 pb10">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => {   }} type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) }}></InputGroup>
                </div>
              </div>

              <div id="column-table">

                <Modal title="设置代理商" maxWidth="1000" show={modalShow[1]} onClose={() => { this.toggleModal(1) }} name="eidtModal1">
                  {qxData}
                </Modal>
                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped ">
                    <thead>
                      <tr>
                        <th>
                          <input name="select" checked={this.validCheckedAll()} onClick={() => { this.toggleCheckedAll() }} className="select-box" value="all" type="checkbox" />
                        </th>
                        <th>代理商名称</th>
                        <th>级别</th>
                        <th>父级代理</th>
                        <th>负责人</th>
                        <th>负责人手机</th>
                        <th>公司地址</th>
                        <th>加入时间</th>
                        <th>保证金</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cont}
                    </tbody>
                  </table>
                  {LoadCont}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

AgentList.defaultProps = defaultProps;
module.exports = AgentList;