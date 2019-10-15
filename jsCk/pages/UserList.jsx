
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
import Select from '../../src/Select';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import { InputGroup } from '../../src/InputGroup';




const formData =  //添加所有接口表单数据
  [{
    "name": "avatar",
    "label": "头像",
    "value": "",
    "type": "file-single"
  },
  {
    "name": "username",
    "label": "用户名",
    "value": "",
    "type": "text"
  },
  {
    "name": "password",
    "label": "初始密码",
    "value": "",
    "type": "password"
  },
  {
    "name": "email",
    "label": "邮箱",
    "value": "",
    "type": "text"
  },

  {
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
  ]



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
      len: 30, //分页长度
      qxData: [],
      searchTxt: "",
      qxSearchText:"",
      typeSelOrder:"",
      agentList:[],
      agent_id: props.params.agent_id ? [] : [props.params.agent_id],
      selAgent:"",
      agent_name: props.params.name ? props.params.name : "",
      formData: formData //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtRoleRoleId = null;
    this.firstOpen = true;
  }
  componentWillReceiveProps(nextProps) {


  }
  componentDidMount() {
    this.upData();
    this.getAgentList();
  }
  textChange = (name, val) => {
    let setState = {};
    setState[name] = val;
    this.setState(setState);
    if (name == "len"||name == "selAgent") {
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
    var _this = this;
    _this.setState({
      loading: true
    })
    let {params}=this.props;
    let { page, len, searchTxt, agent_id,selAgent,typeSelOrder } = this.state;

    fetch('/user.do?' + tools.parseParam({ page: page.page_index, len, username: searchTxt, agent_id:params.agent_id ? params.agent_id :selAgent ,order:typeSelOrder}), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          _this.setState({
            rendData: data.data,
            page: data.page,
            loading: false
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          _this.setState({
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
   orderSelTurn=(type)=>{
    let {typeSelOrder,page}=this.state;
    typeSelOrder=type==typeSelOrder?"":type;
    page.page_index = 1;
    this.setState({typeSelOrder,page},()=>{
      this.upData();
    });
   
  }
getAgentList = () => { //更新表单数据

    fetch('/agent/agenteasy.do' , {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            agentList: data.data,
          })

        } 
      });

  }

  toggleModal = (i) => { //切换弹窗显示
    let { modalShow } = this.state;
    modalShow[i] = !modalShow[i]
    this.setState({ modalShow: modalShow })
  }

  setEidtForm = (data) => { //保存表单
    let _this = this;
    let url = "";

    if (_this.formType == "add") {

      url = "user.do";

    } else {
      url = "/user/" + data.id + ".do";
    }
    delete data.type;
    fetch(url, {
      method: _this.formType == "add" ? "post" : "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(data)
    }).then(response => response.json())
      .then((data) => {
        alert(data.info);
        if (data.code != "SUCCESS") {
          _this.setState({
            formData: _this.state.formData
          })
        } else {
          _this.toggleModal();

          if (_this.formType == "add") {
            var page = _this.state.page;
            page.page_index = 1;
            _this.setState({
              page: page,
              formData: []
            });
          }
          _this.upData(function () {

          });
        }
      })

  }
  onSetSelIdx = (idx) => { //选择分页回调
    let { page } = this.state;
    page.page_index = idx;
    this.setState({
      page
    });
    this.upData();
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
    let { rendData } = this.state;
    if (this.state.selArr.length == 0) {
      for (let i in rendData) {
        newArr.push(rendData[i].id);
      }
    }
    this.setState({
      selArr: newArr
    });
  }
  turnPermi =(val,sel,have)  => {

    /* if (this.firstOpen) return;*/
    fetch('/system/user/permissions/' + sel + '.do', {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        is_access:have >= 0?0:1,
        user_id: this.eidtRoleRoleId
      })
    }).then(response => response.json())
      .then((data) => {
      })
  }

  eidtPermi = (id,toggle=true) => { //编辑数据
    this.eidtRoleRoleId = id;
    let {qxSearchText}=this.state;
    fetch('/system/user/permissions.do?' + tools.parseParam({ user_id: id }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let newArr = [];
        let htmlArr = [];
        let valArr=[];
        let allData = data.data;
    
        for (let i in allData) {
          if(!qxSearchText||allData[i].name.indexOf(qxSearchText)>=0){
            newArr.push({
              "name": allData[i].name,
              "value": allData[i].id
            })
          }
          
          if(allData[i].is_access==1){
            valArr.push(allData[i].id);
          }
        }
        htmlArr.push(<CheckRadio  inline="inline" value={valArr} options={newArr} type="checkbox" label={"权限管理"} onValueChange={(val,sel,have) => { this.turnPermi(val,sel,have) }} />)
        this.formType = "eidt";
        this.setState({
          qxData: htmlArr
        })
        if (this.firstOpen) {
          setTimeout(()=>{
            this.firstOpen = false;
          }, 500)
        }
        if(toggle)this.toggleModal(1);
      });
  }
  sureDelItem = (id) => {
    let { page } = this.state;
    fetch('/user.do', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({ id: id })
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
    id = id != "all" ? id : this.state.selArr;
    if (id.length == 0) {
      Alert.show({
        cont: "请选择删除对象"
      })
      return;
    }
    Modal.show({
      child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的管理员？</div>,
      conf: {
        footer: (
          <a href="javascript:;" onClick={() => {
            this.sureDelItem(id)
          }} className="btn btn-info">确定删除</a>)
      }
    })
  }
  render() {
    let { rendData, loading,typeSelOrder, searchTxt, qxData, modalShow, page, len, agent_name, agent_id,qxSearchText,agentList } = this.state;
    let { userInfo,params } = this.props;
    let isAdd = userInfo.permissions.indexOf('0401') >= 0;
    let isEdit = userInfo.permissions.indexOf('0403') >= 0;
    let isEditCan = userInfo.permissions.indexOf('0404') >= 0;
    let isDel = userInfo.permissions.indexOf('0402') >= 0;

    let cont = rendData.map(function (obj, idx) {
      return (<tr key={idx}>
        <td>
          <input name="select" checked={this.validChecked(obj.id)} onClick={() => { this.toggleChecked(obj.id) }} className="select-box" type="checkbox" />
        </td>
        <td>{obj.id}</td>
        <td><img width="40" height="40" className="br100 mr10 vm" src={obj.avatar ? obj.avatar : "/admin/img/noimg.png"} />{obj.username}</td>
        <td>{obj.phone}</td>
        <td>{obj.agent_name}</td>
        <td>
          <span className="vm">{((obj) => {
            let roles = obj.roles;
            let arr = [];
            for (let i in roles) {
              arr.push(roles[i].name);
            }
            return arr.join(',')
          })(obj)}</span>
        </td>
        <td>{obj.last_login_time}</td>
        <td>{obj.last_login_ip}</td>
        <td>{obj.is_lock_name}</td>
        <td>
          <div className="btn-group mb15">
            {isEdit ? <a href={"#/user/details/edit/" + obj.id} className="btn btn-sm btn-info">更新用户</a> : null}
            {isEditCan ? <a href="javascript:;" onClick={() => { this.eidtPermi(obj.id) }} className="btn btn-sm btn-default">设置用户权限</a> : null}
            {isDel ? <button className="btn btn-sm btn-default" onClick={() => { this.removeItem(obj.id) }} type="button">删除用户</button> : null}
          </div>
        </td>
      </tr>);
    }, this)
    let LoadCont = loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
    return (
      <div>
        <div className="wrapper">
          <section className="panel p15">
            <h4 className="fs20 pb10">{(agent_name ? agent_name : "所有") + "用户列表"}</h4>
            <div className="panel-body">
              <div className="row">
                <div className=" col-md-6">
                  <div className="btn-group mb15">
                    {isAdd ? <a href={"#/user/details/add"+(params.agent_id?`/${params.agent_id}`:"")} className="btn btn-info">添加用户</a> : null}

                    {isDel ? <a href="javascript:;" className="btn btn-default" onClick={() => { this.removeItem("all") }} >删除所选用户</a> : null}
                  </div>
                </div>
                 <div className=" col-md-3">
                  {params.agent_id?null:<Select options={agentList} search={true} onValueChange={(val)=>{ this.textChange("selAgent",val.join(""))  }}></Select>}  
                 </div>
                <div className=" col-md-3 pb10">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => { this.upData() }} type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) }}></InputGroup>

                </div>
              </div>

              <div id="column-table">

                <Modal title="设置用户权限" maxWidth="1000" show={modalShow[1]} onClose={() => { this.toggleModal(1) }} name="eidtModal1">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={qxSearchText} barHtml={<button className="btn btn-info fs12" onClick={() => { this.eidtPermi(this.eidtRoleRoleId,false)  }} type="button">搜索</button>} onValueChange={(val) => { this.textChange("qxSearchText", val) }}></InputGroup>

                  <div className="row-col-4">
                    {qxData}
                  </div>
                  

                </Modal>
                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped ">
                    <thead>

                      <tr>
                        <th>
                          <input name="select" checked={this.validCheckedAll()} onClick={() => { this.toggleCheckedAll() }} className="select-box" value="all" type="checkbox" />
                        </th>
                        <th className={"pointer "+(typeSelOrder=="id"?"base-color":"")} onClick={()=>{ this.orderSelTurn("id") }}>用户id</th>
                        <th className={"pointer "+(typeSelOrder=="username"?"base-color":"")} onClick={()=>{ this.orderSelTurn("username") }}>用户名</th>
                        <th className={"pointer "+(typeSelOrder=="phone"?"base-color":"")} onClick={()=>{ this.orderSelTurn("phone") }}>手机号码</th>
                        <th className={"pointer "+(typeSelOrder=="agent_name"?"base-color":"")} onClick={()=>{ this.orderSelTurn("agent_name") }}>所属代理商</th>
                        <th >所属角色</th>

                        <th className={"pointer "+(typeSelOrder=="last_login_time"?"base-color":"")} onClick={()=>{ this.orderSelTurn("last_login_time") }}>最后登录时间</th>
                        <th >最后登录ip</th>

                        <th className={"pointer "+(typeSelOrder=="is_lock_name"?"base-color":"")} onClick={()=>{ this.orderSelTurn("is_lock_name") }}>是否锁定</th>

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

MainCont.defaultProps = defaultProps;
module.exports = MainCont;