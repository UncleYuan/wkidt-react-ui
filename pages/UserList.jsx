
import React, {
  Component,
  PropTypes
} from 'react';

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
import {CheckRadio} from '../src/CheckRadio';
import {InputGroup} from '../src/InputGroup';




const formData =  //添加所有接口表单数据
  [ {
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



const defaultProps={ 
};

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow:[false,false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      len:30, //分页长度
      qxData:[],
      searchTxt:"",
      formData: formData //表单数据渲染
    };
    this.formType="add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtRoleRoleId=null;
    this.firstOpen=true;
  }
  componentWillReceiveProps(nextProps) {


  }
  componentDidMount() {
    this.upData();

  }
  textChange=(name,val)=>{
    let setState={};
    setState[name]=val;
    this.setState(setState);
    if(name=="len"){
      clearTimeout(this.timer);
      let page=this.state.page;
      page.page_index=1;
      this.setState({
        page:page
      })
      this.timer=setTimeout(()=>{
        this.upData();
      },500)
    }
  }
  upData=(callback)=>{ //更新表单数据
    var _this = this;
    _this.setState({
      loading: true
    })
    let {page,len,searchTxt}=this.state;
    fetch('/user.do?'+tools.parseParam({page:page.page_index,len,username:searchTxt}), {
        method:"get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        if(data.code=="SUCCESS"){
          _this.setState({
             rendData: data.data,
             page: data.page,
             loading: false
          })
          if (callback) callback();
        }else if(data.code=="NO_DATA"){
          _this.setState({
             rendData:[],
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

 
  toggleModal=(i)=>{ //切换弹窗显示
    let {modalShow}=this.state;
    modalShow[i]=!modalShow[i]
    this.setState({modalShow:modalShow})
  }
 
  setEidtForm=(data)=>{ //保存表单
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
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam(data)
      }).then(response => response.json())
      .then((data)=>{
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
          _this.upData(function() {

          });
        }
    })
   
  }
  onSetSelIdx=(idx)=>{ //选择分页回调
    let {page} = this.state;
    page.page_index = idx;
    this.setState({
      page
    });
    this.upData();
  }
  validChecked=(id)=>{
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll=()=>{
    let {rendData,selArr} = this.state;
    for (let i in rendData) {
      if (tools.indexOf(selArr, rendData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked=(id)=>{
    let {selArr} = this.state;
    if (tools.indexOf(selArr, id) >= 0) {
      selArr = tools.removeArr(selArr, id);
    } else {
      selArr.push(id);
    }
    this.setState({
      selArr: selArr
    });
  }
  toggleCheckedAll=()=>{

    let newArr = [];
    let {rendData}=this.state;
    if (this.state.selArr.length == 0) {
      for (let i in rendData) {
        newArr.push(rendData[i].id);
      }
    }
    this.setState({
      selArr: newArr
    });
  }
  turnPermi=(val, name)=>{

   /* if (this.firstOpen) return;*/
   fetch('/system/user/permissions/' + name + '.do', {
        method: "put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({
          is_access: val[0],
          user_id:this.eidtRoleRoleId 
        })
      }).then(response => response.json())
      .then((data)=>{
    })
  }
  
  eidtPermi=(id)=>{ //编辑数据
    let _this = this;

    _this.eidtRoleRoleId = id;
    
    fetch('/system/user/permissions.do?'+tools.parseParam({ user_id: id}), {
        method:"get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        let newArr = [];
        let htmlArr = [];
        let allData = data.data;

        for (let i in allData) {

          newArr = [{
            "name": "是",
            "value": 1
          }, {
            "name": "否",
            "value": 0
          }]

          htmlArr.push(<FormCtrl key={i} checkradioStyle="btn" inline="inline" value={[allData[i].is_access]}  options={newArr}  type="radio" label={allData[i].name+".是否开放权限"}   name={allData[i].id} itemChange={(val)=>{ this.turnPermi(val,allData[i].id)}} />)

        }

        _this.formType = "eidt";
        _this.setState({
          qxData: htmlArr
        })
        if (_this.firstOpen) {
          setTimeout(function() {
            _this.firstOpen = false;
          }, 500)
        }
        _this.toggleModal(1);
    });


  }
  
  sureDelItem=(id)=>{
      let {page}=this.state;
      fetch('/user.do', {
        method:'DELETE',
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({ id: id})
      }).then(response => response.json())
      .then((data)=>{
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
  removeItem=(id)=>{ //删除数据
    id = id != "all" ? id : this.state.selArr;
    if (id.length == 0) {
      Alert.show({
        cont: "请选择删除对象"
      })
      return;
    }
    Modal.show({
            child:<div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof(id)!="string"?id.join(','):id}</span> 的管理员？</div>,
            conf:{
              footer:(
                <a href="javascript:;"  onClick={()=>{ 
                  this.sureDelItem(id)
               }} className="btn btn-info">确定删除</a>)
            }
            
        })
    
  
  }
  render() {
    let {rendData,loading,searchTxt,qxData,modalShow,page,len}=this.state;

    let cont = rendData.map(function(obj, idx) {
      return (<tr key={idx}>
                <td>
                  <input name="select" checked={this.validChecked(obj.id)} onClick={()=>{ this.toggleChecked(obj.id)}}  className="select-box"  type="checkbox" />
                </td>
                <td>{obj.id}</td>
                <td><img className="w40 h40 br_100 mr10 vm" src={typeof(obj.avatar)!="string"?obj.avatar[0].image:"/admin/images/head.png"} />{obj.username}</td>
                <td>
                  <span className="vm">{((obj)=>{ 
                    let roles=obj.roles; 
                    let arr=[];
                    for(let i in roles){
                      arr.push(roles[i].name);
                    }
                    return arr.join(',')
                  })(obj)}</span>
                </td>
                <td>{obj.nickname}</td>
                <td>{obj.last_login_time}</td>
                <td>{obj.last_login_ip}</td>
                <td>{obj.email }</td>
                <td>{obj.remark}</td>
                <td>{obj.is_lock_name}</td>
                <td>

                <div className="btn-group mb15">
                    <a href={"#/user/details/edit/"+obj.id} className="btn btn-sm btn-info">更新用户</a>
                    <a href="javascript:;" onClick={ ()=>{ this.eidtPermi(obj.id)}} className="btn btn-sm btn-default">设置角色权限</a>
                    <button className="btn btn-sm btn-default" onClick={()=>{ this.removeItem(obj.id)}} type="button">删除用户</button>
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
                            <a href="#/user/details/add"  className="btn btn-info">添加用户</a>
                            
                            <button  className="btn btn-default" onClick={ ()=>{ this.removeItem("all")}} type="button">删除所选资源</button>
                        </div>
                          </div>
                          <div className=" col-md-3 pb10">
                             <InputGroup placeholder="请在这里输入搜索的内容" value={searchTxt}  barHtml={<button className="btn btn-info fs12" onClick={()=>{ this.upData()}} type="button">搜索</button>} onValueChange={(val)=>{ this.textChange("searchTxt",val)}}></InputGroup>
                            
                          </div>
                        </div>
                        
                        <div id="column-table">
                           
                            <Modal title="设置角色权限" maxWidth="1000" show={modalShow[1]} onClose={()=>{ this.toggleModal(1)}} name="eidtModal1">
                                {qxData}

                            </Modal>
                            <div className="table-responsive fixed-loading">
                                <table className="table mt20 table-striped ">
                                    <thead>
                               
                                        <tr>
                                            <th>
                                                <input name="select" checked={this.validCheckedAll()} onClick={()=>{ this.toggleCheckedAll() } }  className="select-box" value="all" type="checkbox" />
                                            </th>
                                            <th>用户id</th>
                                            <th>用户名</th>
                                            <th>所属角色</th>
                                            <th>用户昵称</th>
                                            <th>最后登录时间</th>
                                            <th>最后登录ip</th>
                                            <th>邮箱</th>
                                            <th>备注</th>
                                            <th>是否锁定</th>

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
                                      <Pager className=" " all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index}  onSetSelIdx={this.onSetSelIdx} />
                                    </div>
                                    <div className="col-md-3  col-lg-2">
                                      <InputGroup value={len} barHtml={<span className="btn gray-bg fs12">每页条数</span>} onValueChange={(val)=>{ this.textChange('len',val) } }></InputGroup>
                                  
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