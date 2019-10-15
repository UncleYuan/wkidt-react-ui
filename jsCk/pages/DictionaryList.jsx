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
/*import RenderForm from '../src/RenderForm';*/
import FormCtrl from '../../src/FormCtrl';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import {CheckRadio} from '../../src/CheckRadio';



const formData =[
  {
    "name": "field",
    "label": "字典标识，格式：字母和下划线",
    "value": "",
    "type": "text"
  },
   {
    "name": "field_name",
    "label": "说明文字",
    "value": "",
    "type": "text"
  }]

const formData1 = [
  {
    "name": "value",
    "label": "字段值",
    "value": "",
    "type": "text"
  }, {
    "name": "text",
    "label": "字段文本",
    "value": "",
    "type": "text"
  }
]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow:false, //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      len: 10, //分页长度
      qxData:[],
      formData: formData, //表单数据渲染
      modalShow1:false,
      rendData1: [],
      formData1:formData1,
      showTable:false,
      showTable1:false,
      selArr1: [], //选择列表数组,保留,用于全选
      page1: { //分页数据
        page_count: 0, //分页页数
        page_index:1, //当前页码
        record_count: 0 //共计条数
      },
      len1: 10, //分页长度
      qxData1:[],
      keyValueObj:{}
    };
    this.formType="add";//表单当前类型，添加（add）还是编辑（edit）
    this.formType1="add";
  }
  componentWillReceiveProps (nextProps) {


  }
  componentDidMount() {
    this.upData();

  }
  upData=(callback) =>{ //更新表单数据
    let {page,len}=this.state;
    this.setState({
      loading: true
    })
    fetch('/system/dictionary.do?'+tools.parseParam({page: page.page_index,len: len}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        this.setState({
          rendData: data.data,
          page: data.page,
          loading: false
        })
        if (callback) callback();
    });
  }
  
  eidtColumn=(obj)=>{ //编辑数据
    fetch('/system/dictionary.do?'+tools.parseParam({name:obj.field_name}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        let nowData = tools.deepCopy(formData);
        nowData=form_tools.setArrObjVal(nowData,'field',obj.field,'value');
        nowData=form_tools.setArrObjVal(nowData,'field_name',obj.field_name,'value');
        nowData.push ({
          "name": "id",
          "label": "id",
          "value": obj.id,
          "type": "text",
          "readOnly":true
        })
        this.formType = "eidt";
        this.setState({
          formData: nowData
        })
        this.toggleModal();
    });
 

  }
  toggleModal=()=>{ //切换弹窗显示
    this.setState({
       modalShow:!this.state.modalShow
     })
   }
  toggleTable= () =>{
     this.setState({
       showTable:!this.state.showTable
     })
   }
  addColumn=()=>{ //添加数据
    this.formType = "add";
    this.setState({
      formData: formData,
      modalShow:!this.state.modalShow
    })
  }
  showTable=(obj)=>{
    let {page1,len1,showTable}=this.state;
    fetch('/system/dictionary/'+obj.id+'/table.do?'+tools.parseParam({page:page1.page_index,len:len1}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((result)=>{
        let rendData1 = result.data;
        this.setState({
          keyValueObj:obj,
          rendData1:rendData1,
          showTable:!showTable,
        })
        if (result.code == 'SUCCESS') {
            this.setState({
              page1:result.page
            })
        }else if (result.code == 'NO_DATA') {
          Toast.show({msg:result.info})
        }
    });
    
  }

  setEidtForm=(data)=>{ //保存表单
    let url = "";
    let {formData,page}=this.state;
    if (this.formType == "add") {

      url = "/system/dictionary.do";

    } else {
      url = "/system/dictionary/" + data.id + ".do";
    }
    delete data.type;
    fetch(url, {
        method:this.formType == "add" ? "post" : "put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam(data)
      }).then(response => response.json())
      .then((data)=>{
        Toast.show({msg:data.info});
        if (data.code != "SUCCESS") {
          this.setState({
            formData: formData
          })
        } else {
          this.toggleModal();

          if (this.formType == "add") {

            page.page_index = 1;
            this.setState({
              page: page,
              formData: []
            });
          }
          this.upData(function() {

          });
        }
    });
    
    
  }

  onSetSelIdx=(idx)=>{ //选择分页回调
    let {page} = this.state;
    page.page_index = idx;
    this.setState({
      page: page
    });
    this.upData();
  }
  validChecked=(id)=> {
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll=()=> {
    let  {rendData ,selArr} = this.state;
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
       selArr
    });
  }
  toggleCheckedAll=()=>{

    let newArr = [];
    let {selArr,rendData}=this.state;
    if (selArr.length == 0) {
      for (let i in rendData) {
        newArr.push(rendData[i].id);
      }
    }
    this.setState({
      selArr: newArr
    });
  }
  sureDelItem=(id)=>{
      let {page}=this.state;
      fetch('/system/dictionary.do', {
        method: "DELETE",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({dictionary_id:id})
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
            child:<div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof(id)!="string"?id.join(','):id}</span> 的字典？</div>,
            conf:{
              footer:(
                <a href="javascript:;"  onClick={()=>{ 
                  this.sureDelItem(id)
               }} className="btn btn-info">确定删除</a>)
            }
            
        })
  }
  upData1=(callback,obj)=>{ //更新表单数据
    let {page1,len1}=this.state;
    this.setState({
      loading: true
    })
    
    fetch('/system/dictionary/'+ obj.id+'/table.do?'+tools.parseParam({page: page1.page_index,len: len1}), {
        method: "get",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => response.json())
      .then((data)=>{
         this.setState({
          rendData1: data.data,
          page: data.page,
          loading: false
        })
        if (callback) callback();
    });
  }
  eidtColumn1=(obj)=>{ //编辑数据
      let nowData1 = tools.deepCopy(formData1);

      nowData1=form_tools.setArrObjVal(nowData1,'value',obj.value,'value');
      nowData1=form_tools.setArrObjVal(nowData1,'text',obj.text,'value');

      nowData1.push({
        "name": "id",
        "label": "id",
        "value": obj.id,
        "type": "text",
        "readOnly":true
      })

      this.formType1 = "eidt";
      this.setState({
        formData1: nowData1
      })
      this.toggleModal1();

  }
  toggleModal1=()=>{ //切换弹窗显示
    this.setState({
       modalShow1:!this.state.modalShow1
     })
  }
  toggleTable1=()=>{
     this.setState({
       showTable:!this.state.showTable
     })
  }
  addColumn1=()=>{ //添加数据
    this.formType1 = "add";
    this.setState({
      formData1: formData1,
      modalShow1:!this.state.modalShow1
    })
  }

  setEidtForm1=(data)=>{ //保存表单
    let {keyValueObj,formData1}=this.state;
    let  url = "";
    if (this.formType1 == "add") {

      url = "/system/dictionary/"+keyValueObj.id+"/table.do";

    } else {
      url = "/system/dictionary/table/"+data.id+".do";
    }
    // delete this.state.keyValueObj.type;
    fetch(url, {
        method: this.formType1=="add"?"post":"put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam(data)
      }).then(response => response.json())
      .then((result)=>{
        Toast.show({msg:result.info});
        if (result.code != "SUCCESS") {
          this.setState({
            formData1:formData1
          })
        } else {
          this.toggleModal1();

          if (this.formType1 == "add") {
            let page = this.state.page1;
            page.page_index = 1;
            this.setState({
              page1: page,
              formData1: []
            });
          }
          this.getKeyValuePage(this.state.keyValueObj);
        }
    });
   
  }

  onSetSelIdx1=(idx)=> { //选择分页回调
    let {keyValueObj}=this.state;
    let page = this.state.page1;
    page.page_index = idx;
    this.setState({
      page1: page
    });

    this.getKeyValuePage(keyValueObj);
  }

  getKeyValuePage= (obj)=> {
    let {page1,len1}=this.state;
    this.setState({
      loading: true
    })
    fetch('/system/dictionary/'+obj.id+'/table.do?'+tools.parseParam({page:page1.page_index,len:len1}), {
        method:"get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((result)=>{
        let rendData1 = result.data;
        this.setState({
          rendData1:rendData1,
          loading: false
        })
        if (result.code =="SUCCESS") {
          this.setState({
            page1:result.page
          })
        }
    });
    
  }

  validChecked1=(id)=>{
    return tools.indexOf(this.state.selArr1, id) >= 0 ? true : false;
  }
  validCheckedAll1=() =>{
    let rendData = this.state.rendData1;
    for (let i in rendData) {
      if (tools.indexOf(this.state.selArr1, rendData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked1=(id)=>{
    var selArr = this.state.selArr1;
    if (tools.indexOf(selArr, id) >= 0) {
      selArr = tools.removeArr(selArr, id);
    } else {
      selArr.push(id);
    }
    this.setState({
      selArr1: selArr
    });
  }

  toggleCheckedAll1=() =>{

    let newArr = [];

    if (this.state.selArr1.length == 0) {
      for (let i in this.state.rendData1) {
        newArr.push(this.state.rendData1[i].id);
      }
    }
    this.setState({
      selArr1: newArr
    });
  }
  sureDelItem1=(id)=>{
    fetch('/system/dictionary/table.do', {
        method:'DELETE',
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({ dictionary_value_id: id})
      }).then(response => response.json())
      .then((data)=>{
        if (data.code == "SUCCESS") {
          Modal.close();
          let page = this.state.page1;
          page.page_index = 1;
          this.setState({
            page1: page
          })
          this.getKeyValuePage(this.state.keyValueObj);
        }
        Toast.show({
          msg: data.info
        })
    });
     
  }
  removeItem1=(id)=> { //删除数据
    id = id != "all" ? id : this.state.selArr1;
    if (id.length == 0) {
      Alert.show({
        cont: "请选择删除对象"
      })
      return;
    }
    Modal.show({
      child: <div className="desalt-color">确认是否要删除id为 {typeof(id)!="string"?id.join(','):id} 的键值？</div>,
      conf:{
        footer:(
          <a href="javascript:;"  onClick={()=>{  this.sureDelItem1(id)}} className="btn btn-info">确定删除</a>
        )
      }
    
    })
  }



  render() {
    let {rendData}=this.state;
    let cont = rendData.map(function(obj, idx) {
      return (
        <tr key={idx}>
                <td>
                  <input 
                    name="select" 
                    checked={this.validChecked.bind(this,obj.id)()} 
                    onClick={this.toggleChecked.bind(this,obj.id)}  
                    className="select-box"  
                    type="checkbox" 
                    />
                </td>
                <td>{obj.id}</td>
                <td>{obj.field}</td>
                <td>{obj.field_name}</td>
                <td>
                <div className="btn-group mb15">
                    <a href="javascript:;" onClick={this.eidtColumn.bind(this,obj)} className="btn btn-sm btn-info">更新字典</a>
                    <a href="javascript:;" onClick={this.showTable.bind(this,obj)} className="btn btn-sm btn-default">字段键值列表</a>
                    <button className="btn btn-sm btn-default" onClick={this.removeItem.bind(this,obj.id)} type="button">删除字典</button>
                </div>
            </td>
        </tr>
      );
    }, this)
    var _this = this;
    var tableCont = function () {
        
      if (!!_this.state.rendData1 ==[]) {
        return(
            <div></div>
          )
      }else{
       return _this.state.rendData1.map(function (obj,idx) {
                return (
                  <tr key={idx}>
                          <td>
                            <input 
                              name="select" 
                              checked={_this.validChecked1.bind(this,obj.id)()} 
                              onClick={_this.toggleChecked1.bind(this,obj.id)}  
                              className="select-box"  
                              type="checkbox" 
                              />
                          </td>
                          <td>{obj.id}</td>
                          <td>{obj.value}</td>
                          <td>{obj.text}</td>
                          <td>
                          <div className="btn-group mb15">
                              <a href="javascript:;" onClick={_this.eidtColumn1.bind(this,obj)} className="btn btn-sm btn-info">更新字段</a>
                              <button className="btn btn-sm btn-default" onClick={_this.removeItem1.bind(this,obj.id)} type="button">删除字段</button>
                          </div>
                      </td>
                  </tr>
                );
            },this)
      }
    }
    var LoadCont = this.state.loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
    return (
      <div>
            
            <div className="wrapper">
                <section className="panel p15">
                    
                    <div className="panel-body">
                        <div className="btn-group mb15">
                            <a href="javascript:;" onClick={this.addColumn} className="btn btn-info">添加字典</a>
                            
                             <a href="javascript:;"  className="btn btn-default" onClick={this.removeItem.bind(this,"all")} >删除所选资源</a>
                        </div>
                        <div id="column-table">
                            <Modal 
                              title="编辑资源" 
                              maxWidth="1000" 
                              show={this.state.modalShow} 
                              onClose={this.toggleModal.bind(this)} 
                              name="eidtModal">
                               
                                <Form 
                                formStyle="ver"
                                  formRendData={this.state.formData}  
                                   onSubForm={this.setEidtForm} 
                                />
                                
                            </Modal>

                            <Modal 
                              title="字段列表" 
                              maxWidth="1000" 
                              show={this.state.showTable} 
                              onClose={this.toggleTable.bind(this)} 
                              name="eidtKeyValueModal">
                                
                                <div className="panel-body">
                                    <div className="btn-group mb15">
                                        <a href="javascript:;" onClick={this.addColumn1} className="btn btn-info">添加字段键值</a>
                                         <a href="javascript:;" className="btn btn-default" onClick={this.removeItem1.bind(this,"all")}>删除所选资源</a>
                                    </div>
                                    <div id="column-table">
                                      <Modal 
                                        title="添加资源" 
                                        maxWidth="1000" 
                                        show={this.state.modalShow1} 
                                        onClose={this.toggleModal1.bind(this)} 
                                        name="eidtKeyModal">
                              
                                          <Form 
                                            formStyle="ver"
                                            formRendData={this.state.formData1}  
                                             onSubForm={this.setEidtForm1} 
                                             />
                                      </Modal>
                                    </div>
                                </div>
                                <div className="table-responsive fixed-loading">
                                    <table className="table mt20 table-striped ">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input 
                                                      name="select" 
                                                      checked={this.validCheckedAll1.bind(this)()} 
                                                      onClick={this.toggleCheckedAll1.bind(this)}  
                                                      className="select-box" 
                                                      value="all" 
                                                      type="checkbox" 
                                                      />
                                                </th>
                                                <th>字段键值id</th>
                                                <th>字段值</th>
                                                <th>字段文本</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableCont()}
                                        </tbody>
                                    </table>

                                    {LoadCont}
                                    <div className="pb15">
                                      <Pager
                                        all_num={_this.state.page1.record_count} 
                                        all_page_num={_this.state.page1.page_count} 
                                        sel_index={_this.state.page1.page_index}  
                                        onSetSelIdx={_this.onSetSelIdx1} 
                                        />
                                    </div>
                                </div>
                            </Modal>


                            <div className="table-responsive fixed-loading">
                                <table className="table mt20 table-striped ">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input 
                                                  name="select" 
                                                  checked={this.validCheckedAll.bind(this)()} 
                                                  onClick={this.toggleCheckedAll.bind(this)}  
                                                  className="select-box" 
                                                  value="all" 
                                                  type="checkbox" 
                                                  />
                                            </th>
                                            <th>字典id</th>
                                            <th>字典标识</th>
                                            <th>字典名</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cont}
                                    </tbody>
                                </table>

                                {LoadCont}
                                <div className="pb15">
                                  <Pager 
                                    all_num={this.state.page.record_count} 
                                    all_page_num={this.state.page.page_count} 
                                    sel_index={this.state.page.page_index}  
                                    onSetSelIdx={this.onSetSelIdx} 
                                    />
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