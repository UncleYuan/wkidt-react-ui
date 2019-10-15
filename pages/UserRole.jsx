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
/*import RenderForm from '../src/RenderForm';*/
import FormCtrl from '../src/FormCtrl';
import Input from '../src/Input';
import Alert from '../src/Alert';
import {CheckRadio} from '../src/CheckRadio';




const formData=[   //添加所有接口表单数据
  {
    "name": "name",
    "label": "角色名称",
    "defaultValue": "",
    "type": "text"
  },
  {
    "name": "listorder",
    "label": "排序",
    "defaultValue": "",
    "type": "num"
  },
  {
    "name": "remark",
    "label": "备注",
    "defaultValue": "",
    "type": "textarea"
  }
]
const qxData={   //添加所有接口表单数据
  "name":{
    "field": "name",
        "name": "角色名称",
        "defaultValue": "",
        "type": "input"
  }
}


const defaultProps={ 
};

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
          loading:false,  //是否加载中， 保留，暂无作用
          modalShow:[false,false], //是否显示编辑表单弹窗
          rendData:[], //列表数据
          selArr:[],  //选择列表数组,保留,用于全选
          page:{ //分页数据
            page_count:0, //分页页数
            page_index:1,//当前页码
            record_count:0 //共计条数
          },
          len:30, //分页长度
          formData:formData,  //表单数据渲染
          qxData:[],
    };
    this.formType="add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtRoleRoleId=null;
    this.firstOpen=true;
  }
  entWillReceiveProps(nextProps){

     
  }
  componentDidMount() {
    this.upData();
   
  }
  upData(callback){ //更新表单数据
      let _this=this;
      let {page,len}=this.state;
      _this.setState({loading:true})

      fetch('/user/role.do?'+tools.parseParam({page:page.page_index,len}), {
          method:"get",
          credentials:'same-origin'
        }).then(response => response.json())
        .then((data)=>{
          _this.setState({rendData:data.data,page:data.page,loading:false})
         if(callback) callback();
      });
  
  }
  eidtColumn(id){ //编辑数据
      var _this=this;

      fetch('/user/role/'+id+'.do', {
          method:"get",
          credentials:'same-origin'
        }).then(response => response.json())
        .then((data)=>{
          let nowData=tools.deepCopy(formData);
            for(let x in nowData){
              for(let i in data.data){
                if(nowData[x].name==i){
                  nowData[x].value=data.data[i];
                }   
              }
            }
          nowData.push({
            "label": "id",
            "name": "id",
            "value":id,
            "readOnly":true,
            "type": "text"
          })
          _this.formType="eidt";
          _this.setState({formData:nowData})
          _this.toggleModal(0);
      });
     
      
  }
  turnPermi=(val,name)=>{
/*    if(this.firstOpen) return;*/
    fetch('/system/role/permissions/'+name+'.do', {
        method:"put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({
          is_access:val[0],
          role_id:this.eidtRoleRoleId
        })
      }).then(response => response.json())
      .then((data)=>{
    });
 
   }
   eidtPermi=(id)=>{ //编辑数据
      Process.show();
      this.eidtRoleRoleId=id;
      fetch('/system/role/permissions.do?'+tools.parseParam({role_id:id}), {
          method:"get",
          credentials:'same-origin'
        }).then(response => response.json())
        .then((data)=>{
          Process.Close();
          let newArr=[];
          let htmlArr=[];
          let res=data.data;

          for(let i in res){
            newArr= [{
                  "name":"是",
                  "value":1
              }, {
                  "name":"否",
                  "value":0
              }]

              htmlArr.push(<FormCtrl type="radio" key={i} checkradioStyle="btn" inline={true} value={[res[i].is_access]}  options={newArr}  label={res[i].name+".是否开放权限"}   name={res[i].id} itemChange={(val)=>{ this.turnPermi(val,res[i].id) }} />)
            
          }
          
          this.formType="eidt";
          this.setState({qxData:htmlArr})

          if(this.firstOpen){
            setTimeout(function(){
               this.firstOpen=false;
            },500)
          }
          this.toggleModal(1);
      });
    
      
   }
   toggleModal(i){ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
   }
   addColumn=()=>{ //添加数据
      this.formType="add";

      this.setState({formData:formData})
      this.toggleModal(0)
   }
   setEidtForm=(data)=>{  //保存表单
    let url="";
    let {formData,page}=this.state;
    if(this.formType=="add"||!data.id){

      url="/user/role.do";
    }else{
      url="/user/role/"+data.id+".do";
    }
    if(data.type){delete data.type;}
    Process.show()
    fetch(url, {
        method: this.formType=="add"?"post":"put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam(data)
      }).then(response => response.json())
      .then((res)=>{
        Process.Close()
        Toast.show({msg:res.info});
        if(res.code!="SUCCESS"){
          this.setState({formData})
        }else{
          this.toggleModal(0);

          if(this.formType=="add"){
            page.page_index=1;
            this.setState({page:page,formData:[]});
          }
          this.upData(function(){
            
          });
        }
    });
   
   }
 
   onSetSelIdx(idx){ //选择分页回调
    let  {page}=this.state;
    page.page_index=idx;
    this.setState({page:page});
    this.upData();
   }
   validChecked(id){
    return tools.indexOf(this.state.selArr,id)>=0?true:false; 
   }
   validCheckedAll(){
    let  {rendData,selArr}=this.state;
    for(var i in rendData){
      if( tools.indexOf(selArr,rendData[i].id) < 0 ){
        return false;
      }
    }
    return true;
   }
   toggleChecked(id){
    let {selArr}=this.state;
      if(tools.indexOf(selArr,id)>=0){
        selArr=tools.removeArr(selArr,id);
      }else{
        selArr.push(id);
      }
      this.setState({selArr:selArr});
   }
   toggleCheckedAll(){

    let newArr=[];
    let  {rendData,selArr}=this.state;
    if(selArr.length==0){
      for(var i in rendData){
        newArr.push(rendData[i].id);
      }
    }
    this.setState({selArr:newArr});
   }
  sureDelItem=(id)=>{
      let {page}=this.state;
      fetch('/user/role.do', {
          method: "DELETE",
          credentials:'same-origin',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body:tools.parseParam({id:id})
        }).then(response => response.json())
        .then((data)=>{
          if(data.code=="SUCCESS"){
            Modal.close();
            page.page_index=1;
            this.setState({page:page})
            this.upData();
          }
          Toast.show({msg:data.info})
      });
     
  }
  removeItem=(id)=>{ //删除数据
    let {selArr}=this.state;
    id = id != "all" ? id : selArr;
    
    if (id.length == 0) {
      Modal.show({
        child: "请选择删除对象"
      })
      return;
    }

    Modal.show({
            child:<div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof(id)!="string"?id.join(','):id}</span> 的角色？</div>,
            conf:{
              footer:(
                <a href="javascript:;"  onClick={()=>{ 
                  this.sureDelItem(id)
               }} className="btn btn-info">确定删除</a>)
            }
            
        })
  }
   render () {

      let {loading,rendData,modalShow,formData,qxData,page}=this.state;
      let cont= rendData.map(function(obj,idx){
              return(

         
                  <tr key={idx}>
                        <td>
                          <input name="select" checked={this.validChecked.bind(this,obj.id)()} onClick={this.toggleChecked.bind(this,obj.id)}  className="select-box"  type="checkbox" />
                        </td>
                        <td>{obj.id}</td>
                        <td>{obj.name}</td>
                        <td>{obj.listorder}</td>
                        <td>{obj.create_time}</td>
                        <td>{obj.update_time}</td>
                        <td>{obj.remark}</td>
                        <td>
                        <div className="btn-group mb15">
                            <a href="javascript:;" onClick={this.eidtColumn.bind(this,obj.id)} className="btn btn-sm btn-info">更新角色</a>
                            <a href="javascript:;" onClick={()=>{ this.eidtPermi(obj.id);}} className="btn btn-sm btn-default">设置角色权限</a>
                            <button className="btn btn-sm btn-default" onClick={this.removeItem.bind(this,obj.id)} type="button">删除角色</button>
                        </div>
                    </td>
                </tr>  
                 );
            },this)
  let LoadCont=loading?<div className="fixed-loading-bg"><Loading /></div>:"";
    return (
        <div className="">
            
            <div className="wrapper">
                <section className="panel">
                   
                    
                    <div className="panel-body">
                        <div className="btn-group mb15">
                            <a href="javascript:;" onClick={()=>{ this.addColumn() }} className="btn btn-info">添加角色</a>
                            <a  className="btn btn-default" onClick={this.removeItem.bind(this,"all")}  href="javascript:;" >删除所选角色</a>
                        </div>
                        <div id="column-table">
                            <Modal title="编辑角色" maxWidth="1000" show={modalShow[0]} onClose={this.toggleModal.bind(this,0)} name="eidtModal">
                                <Form formStyle="ver" formRendData={formData}  onSubForm={this.setEidtForm}  />
                            </Modal>
                            <Modal title="设置角色权限" maxWidth="1000" show={modalShow[1]} onClose={this.toggleModal.bind(this,1)} name="eidtModal1">
                                {qxData}
                            </Modal>
                            <div className="table-responsive fixed-loading">
                                <table className="table mt20 table-striped ">
                                    <thead>
                               
                                        <tr>
                                            <th>
                                                <input name="select" checked={this.validCheckedAll.bind(this)()} onClick={this.toggleCheckedAll.bind(this)}  className="select-box" value="all" type="checkbox" />
                                            </th>
                                            <th>角色id</th>
                                            <th>角色名</th>
                                         
                                            <th>排序</th>
                                            <th>创建时间</th>
                                            <th>更新时间</th>
                                            <th>备注</th>
                                 

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
                    <div className="pb15">

                                  <Pager all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index}  onSetSelIdx={this.onSetSelIdx} />
                                </div>
                </section>
            </div>
        </div>

    );
  }
}

MainCont.defaultProps = defaultProps;
module.exports =MainCont;