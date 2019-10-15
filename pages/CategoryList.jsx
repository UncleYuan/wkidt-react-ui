import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';;
import Modal from '../src/Modal';
import Pager from '../src/Pager';
import Loading from '../src/Loading';
import Toast from '../src/Toast';
import Process from '../src/Process';
import tools from '../tools/public_tools';

var formData={ 
        "catname":{
          "field":"catname",
          "name":"栏目名称",
          "defaultValue":"",
          "type":"input"
        },
        "modelid":{
          "field":"modelid",
          "name":"模型",
          "defaultValue":"",
          "type":"select",
          "defaultValue":1,
          "optionsArr":[{
            tit:"占位模型",
            val:1
            }
          ]
        },
        "image":{
          "field":"image",
          "name":"栏目图片",
          "defaultValue":"",
          "type":"images",
          "count":1,
        },
        "parentid":{
          "field":"parentid",
          "name":"父级栏目",
          "defaultValue":"",
          "type":"select"
        },
        "description":{
          "field":"description",
          "name":"栏目描述",
          "defaultValue":"",
          "type":"textarea"
          
        },
        "listorder":{
          "field":"listorder",
          "name":"排序",
          "defaultValue":"",
          "type":"input"
          
        },
        "ismenu":{
          "field":"ismenu",
          "name":"是否显示",
          "defaultValue":"",
          "options": [
              {
                    "value": "1",
                    "name": "是"
                },
                {
                    "value": "0",
                    "name": "否"
                }
            ],
          "type":"radio"
          
        }
    }
var formData1={ 
        "name":{
          "field":"name",
          "name":"菜单名称",
          "defaultValue":"",
          "type":"input"
        },
        "resource_id":{
          "field":"resource_id",
          "name":"关联的菜单资源",
          "defaultValue":"",
          "type":"select",
          "optionsArr":[]
        },
        "parent_id1":{
          "field":"parent_id1",
          "name":"父级菜单",
          "defaultValue":"",
          "type":"input"
        },
        "remark":{
          "field":"remark",
          "name":"备注",
          "defaultValue":"",
          "type":"textarea"
        },
        "listorder":{
          "field":"listorder",
          "name":"排序",
          "defaultValue":"",
          "type":"input"
          
        }
    }

var turnSelect=function(data){
  var newArr=[];
  newArr.push({tit:"根目录",val:0});
  for(var i in data){
    newArr.push({tit:data[i].catnameTurn,val:data[i].catid});
  }

  return newArr;
}

var turnList=function(data,l){

  l=parseInt(l);
  var arr=[];
  var txt='';
  var addChild="";
  for(var x=0;x< l;x++){
    if(x==0){
      txt+='├';
    } 
    txt+='─';
  }
  for(var i in data){
    data[i].catnameTurn=txt+data[i].catname;
    arr.push(data[i])
    if(data[i].children&&data[i].children.length>0){  

      arr=arr.concat(turnList(data[i].children,l+1));
 
    }
  }

  return arr;
}

const defaultProps={ 
};

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
          loading:false,  //是否加载中， 保留，暂无作用
          modalShow:false, //是否显示编辑表单弹窗
          rendData:[], //列表数据
          selArr:[0],  //选择列表数组,保留,用于全选
          exArr:[],
          formData:formData,  //表单数据渲染
          optionsArr:[],
          parentId:[],
          orderList:[],
          resourceData:[]
    };

    this.formType="add"; //表单当前类型，添加（add）还是编辑（edit）
    this.selId=null;
    this.firstOpen=true;
  }
  componentWillMount(){

    this.upData();
  }
  upData=(callback)=>{
      var _this=this;
       _this.setState({loading:true})

      reqwest({
          url: '/category/get-list.do',
          method: 'get',
          type:'json',
          success:(data)=> {
            let rendData=turnList(tools.typeTree(data.data,0,"catid","parentid"),1);
            let orderList=[];
            for(let i in rendData){
              orderList.push(rendData[i].listorder);
            }
            formData['parentid'].optionsArr=turnSelect(rendData);
            _this.setState({loading:false,rendData:rendData,orderList:orderList})
            if(callback) callback();
          }
      }) 
 
   }
   toggleModal=()=>{ //切换弹窗显示
    this.setState({
      modalShow:!this.state.modalShow
    })
   }
   eidtColumn=(id,idx)=>{ //编辑数据
    this.setState({
        formData: {}
    })
    let item=this.state.rendData[idx];
    let _this=this;
    let nowData = tools.deepCopy(formData);
      nowData["id"]={
        "field": "id",
        "name": "",
        "defaultValue":item.catid,
        "type": "hidden"
      }   
      for(let i in item){
        if(nowData[i]){
          nowData[i].defaultValue=item[i];
        }
      }
      // 获取所有菜单
      
      _this.formType="eidt";
      setTimeout(function(){
        _this.setState({
          formData:nowData
        })
      }.bind(this),100)
      _this.toggleModal();
   }
   addColumn=()=>{ //添加数据
      this.setState({
        formData: {}
      })
      this.formType="add";
      var nowData = tools.deepCopy(formData);
      setTimeout(function(){
        this.setState({
          formData:nowData,
          modalShow:!this.state.modalShow
        })
      }.bind(this),100)
   }
   addChild= (item)=>{
     this.formType="add";
     let parentId = [];
     let parentObj = {};
     parentObj.tit = item.name;
     parentObj.val = item.id;
     parentId.push(parentObj)

     formData1.resource_id.optionsArr=this.state.resourceList;
     formData1.parent_id1.defaultValue = item.name;
    
     let nowData = deepCopy(formData1);

     nowData["parent_id"]={
        "field": "parent_id",
        "name": "",
        "defaultValue":item.id,
        "type": "hidden"
      }
     this.setState({
       formData:nowData,
       modalShow:!this.state.modalShow
     })
   }
   setEidtForm=(data)=>{  //保存表单
    let _this=this;
    let url="";
    if(_this.formType=="add"){
      url = '/category/create.do';
    }
    if (_this.formType=='eidt') {
      url = '/category/update/'+ data.id +'.do';    
    }

      delete data.type;
      Process.show();
      reqwest({
        url:url,
        type:_this.formType=="add"?"post":"put",
        data:data,
        success:function(data){
          Process.Close();
          Toast.show({msg:data.info});
          if(data.code!="SUCCESS"){
            _this.setState({formData:_this.state.formData})
          }else{
            _this.toggleModal();

            if(_this.formType=="add"){
              _this.setState({formData:[]});
            }
            _this.upData(function(){
              
            });
          }
        }
      }) 
   
   }
   validChecked=(id)=>{
    return tools.indexOf(this.state.selArr,id)>=0?true:false; 
   }
   validCheckedAll=()=>{
    var rendData=this.state.rendData;
    for(var i in rendData){
      if( tools.indexOf(this.state.selArr,rendData[i].id) < 0 ){
        return false;
      }
    }
    return true;
   }
   toggleChecked=(id)=>{
    var selArr=this.state.selArr;
      if(tools.indexOf(selArr,id)>=0){
        selArr=removeArr(selArr,id);
      }else{
        selArr.push(id);
      }
      this.setState({selArr:selArr});
   }
   toggleCheckedAll=()=>{
    var newArr=[];
    if(this.state.selArr.length==0){
      for(var i in this.state.rendData){
        newArr.push(this.state.rendData[i].id);
      }
    }
    this.setState({selArr:newArr});
   }
   removeItem=(id)=>{  //删除数据
      var _this=this;
      var id=id!="all"?id:this.state.selArr;
      if(id.length==0){
        Alert.show({
            cont:"请选择删除对象"
        })
        return;
      }
     
      Alert.show({
            cont:<div className="fs20">确认是否要删除id为 {typeof(id)!="string"?id.join(','):id} 的菜单？</div>,
            btnOptions:[
                {
                    txt:"确认删除",
                    type:'warning',
                    onCli:function(closeFn){
                      
                       Process.show();
                        reqwest({
                            url:'/category/category_del.do',
                            data:{
                              catid:id
                            },
                            type: 'DELETE',
                            success:function(data){
                              Process.Close();
                              if(data.code=="SUCCESS"){
                                closeFn();
                                _this.upData();
                              }
                              Toast.show({msg:data.info})
                            }
                        })
                    }
                },
                {
                }
            ]
        })
        
   }
   listorderOnBlur=(event)=>{
    let _this=this;
      if(isNaN(event.target.value)){
        event.target.value=0;
      }else{
        console.log(event.target.value)
        Process.show();
        reqwest({
          url:"/category/update-listorder/"+$(event.target).attr('data-catid')+".do",
          type:"PUT",
          data:{listorder:event.target.value},
          dataType:"json",
          success:function(data){
            Process.Close();
            Toast.show({msg:data.info});
            _this.setState({rendData:[]});
            setTimeout(function(){
              _this.upData();
            },100)
            
          }
        })
      }
   }
   render() {

     let cont = this.state.rendData.map(function(obj, idx) {
   
      return (
        <tr key={idx}>
                <td>
                  <input name="select" checked={this.validChecked.bind(this,obj.catid)()} onClick={this.toggleChecked.bind(this,obj.catid)}  className="select-box"  type="checkbox" />
                </td>
                <td>{obj.catid}</td>
                <td>{obj.catnameTurn}</td>
                <td>{obj.modelname}</td>
                <td>{obj.description}</td>
                <td><input type="text" className="w40 p2 tc" onBlur={this.listorderOnBlur} data-catid={obj.catid} defaultValue={obj.listorder} /></td>
                <td>{obj.ismenu }</td>
                <td>
                <div className="btn-group mb15">
                    <a href="javascript:;" onClick={this.eidtColumn.bind(this,obj.catid,idx)} className="btn btn-sm btn-info">更新栏目</a>
                    <a href={"#/content/article/add/"+obj.catid}  className="btn btn-sm btn-default">添加内容</a>
                    <button className="btn btn-sm btn-default" onClick={this.removeItem.bind(this,obj.catid)} type="button">删除栏目</button>
                </div>
            </td>
        </tr>
      );
    }, this)
    let LoadCont=this.state.loading?<div className="fixed-loading-bg"><Loading /></div>:"";
    return (
        <div>
            
            <div className="wrapper">
                <section className="panel">
            
                    <div className="panel-body">
                        <div className="btn-group mb15">
                            <a href="javascript:;" 
                                onClick={this.addColumn} 
                                className="btn btn-info fs12 mr5">添加栏目</a>
                            
                           <button  className="btn btn-default fs12" onClick={this.removeItem.bind(this,"all")} type="button">删除所选栏目</button>
                          
                        </div>
                        
                        <div id="column-table">
                            <Modal title="编辑栏目" 
                                    maxWidth="1000" 
                                    show={this.state.modalShow}
                                    onClose={this.toggleModal} 
                                    name="eidtModal">
                               {/* <RenderForm rendData={this.state.formData}
                                            getSubVal={this.setEidtForm} 
                                            name="eidtForm" />*/}
                            </Modal>
                            <div className="table-responsive fixed-loading">
                                <table className="table mt20 table-striped ">
                                    <thead>
                                        <tr>
                                            <th>
                                              <input name="select" 
                                                    checked={this.validCheckedAll.bind(this)()} 
                                                    onClick={this.toggleCheckedAll.bind(this)}  
                                                    className="select-box" 
                                                    value="all" 
                                                    type="checkbox" />
                                            </th>
                                            <th>栏目id</th>
                                            <th>栏目名称</th>
                                            <th>模型</th>
                                            <th>描述</th>
                                            <th>排序</th>
                                            <th>是否显示</th>
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

MainCont.defaultProps = defaultProps;
module.exports =MainCont;

