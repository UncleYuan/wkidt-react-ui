
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest  from 'reqwest';
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
import {CheckRadio} from '../../src/CheckRadio';
import {InputGroup} from '../../src/InputGroup';

import {FileGroup} from '../../src/FileGroup';





const FormDataPro =  //验车
  [{
    "label": "验车分类",
    "value":[],
    "name": "category",
    "type":"select-single",
    "options":[]
  },
  {
    "label": "验车项目",
    "value":[],
    "name": "items",
    "type":"select-single",
    "options":[]
  },{
    "label": "状态选择",
    "value":[],
    "inline":true,
    "type":"radio",
    "name": "status",
    "options":[]
  }, {
    "label": "照片",
    "name": "file",
    "value": [],
    "type":"file-group"
  },{
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
]
const pagePro={ 
  page_count: 0, 
  page_index: 1, 
  record_count: 0 
}


const defaultProps={ 
};
class DetailInspectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow:[false,false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      page: tools.deepCopy(pagePro),
      len:30, //分页长度
      logList:[],
      searchTxt:"",
      catOptions:[],
      catItemOptions:[],
      statusOptions:[],
      selImgVal:[],
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
     this.edit = "add";
    this.editId = null;
  }
  componentWillReceiveProps(nextProps) {


  }

  
  componentWillMount() {
      
  }
  
  componentDidMount() {
    this.upData();

  }
 
  upData=(callback)=>{ //更新表单数据
    let {page,len,searchTxt}=this.state;
    let {order_id}=this.props;
    fetch('/property/inspection2.do?'+ tools.parseParam({order_id,title:searchTxt,page:page.page_index,len}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        if(data.code=="SUCCESS"){
          this.setState({
             rendData: data.data,
             page: data.page|| tools.deepCopy(pagePro),
             selArr:[],
          
          })
          if (callback) callback();
        }else if(data.code=="NO_DATA"){
          this.setState({
             rendData:[],
             selArr:[],
             page:  tools.deepCopy(pagePro),
          
          })
        }
        if (callback) callback();
      });
  
  }


  toggleModal=(i)=>{ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
  }
  
  
  onSetSelIdx=(idx)=>{ //选择分页回调
    let page = this.state.page;
    page.page_index = idx;
    this.setState({
      page: page
    });
    this.upData();
  }
   getForm = (data) => {
    
    Process.show();
    let newData = tools.deepCopy(data);
    let newArr = [];
    for (let i in newData.thumb) {
      newArr.push(newData.thumb[i].src)
    }
    let tagsArr = [];
    for (let i in newData.tags) {
      tagsArr.push(newData.tags[i].name)
    }
    //delete newData.tags;

    newData.tags = tagsArr.join(',');
    newData.cat_id = newData.cat_id[0]
    newData.thumb = newArr.join(',');
    newData.content = JSON.stringify(newData.content);
    if (this.edit == "edit") { newData['id'] = this.editId }
    fetch('/merchant/jindian.do?access_token=' + Token, {
      method: this.edit == "edit" ? "put" : "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(newData)
    }).then(response => response.json())
      .then((res) => {
        Process.Close();
        Toast.show({ msg: res.info })
        if (res.code == "SUCCESS") {
          this.toggleModal(0)

        } else if (res.code == "NO_DATA") {

        }
      });

  }
  subNext=(data)=>{
    let {order_id}=this.props;
    Process.show();
    fetch(`/property/inspection.do`, {
        method: "post",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam( {
          order_id: order_id
        })
      }).then(response => response.json())
      .then((data)=>{
        Process.Close();
        Toast.show({msg:data.info});
         if(data.code=="SUCCESS"){
          Modal.show({
                child:<div className="fs14 ">{data.info}</div>,
                conf:{
                  footer:(
                    <a href="javascript:;" onClick={()=>{ Modal.close(); locationl.href="#/zc.html/"+order_id+"/whthin/"+(new Date()).valueOf(); }}  className="btn btn-info">确定</a>)
                }
            
          })
        }
    });
  }

  validChecked=(id)=>{
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll=()=>{
    let rendData = this.state.rendData;
    for (let i in rendData) {
      if (tools.indexOf(this.state.selArr, rendData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked=(id)=>{
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
  toggleCheckedAll=()=>{

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
  
  
  
  
  sureDelItem=(id)=>{
      
      let {page}=this.state;

      fetch('/property/inspection2.do', {
        method: "DELETE",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({
          ids:typeof id =="object"?id.join(','):id
        })
      }).then(response => response.json())
      .then((data)=>{
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
  removeItem=(id)=>{ //删除数据
    id = id != "all" ? id : this.state.selArr;
    if (id.length == 0) {
      Alert.show({
        cont: "请选择删除对象"
      })
      return;
    }
    Modal.show({
            child:<div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof(id)!="string"?id.join(','):id}</span> 的验车项目结果？</div>,
            conf:{
              footer:(
                <a href="javascript:;"  onClick={()=>{ 
                  this.sureDelItem(id)
               }} className="btn btn-info">确定删除</a>)
            }
            
        })
    
  
  }
  filterEdit = (type="add",id=null) => {
    this.edit = type;
    this.editId = id;
    if (type=="edit") {
      
      this.eidtForm(id, () => {
        this.upDataCate();
      });
    } else {
      this.upDataCate();
    }
  }
  upDataCate = () => {

    fetch('/property/inspection/category2.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {

        let newOption = [];
        if(res.code=="SUCCESS"){
          res.data.forEach((obj, idx) => {
            newOption.push({ name: obj.name, value: obj.id })
          })
        }
        this.setState({catOptions:newOption });
        this.toggleModal(0)
      });

  }
  eidtForm = (id, callback) => {
    Process.show();
    fetch('/property/inspection2/' + id + '.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        Process.Close();
        let {formData} = this.state;
        for (let x in formData) {
          for (let i in res.data) {
            if (formData[x].name == i) {
              if ("category,items,status".indexOf(i) >= 0) {

                formData[x].value = [res.data[i]];
         
              } else if ("file".indexOf(i) >= 0) {
                let eachArr=res.data[i]?res.data[i].split(','):[]
              
                let newArr = [];
                for (let h in eachArr) {
                  newArr.push({name:'file'+h,src: eachArr[h] });
                }
                formData[x].value = newArr
              } else {
                formData[x].value = res.data[i]
              }

            }
          }
        }

                  this.catValChange(formData[0].value,()=>{
                    this.catItemValChange(formData[1].value)
                  })
           
        this.setState({ formData }, () => {
          if (typeof callback =="function") callback();
        })
      });
  }
  catValChange=(val,callback)=>{
    Process.show();
    fetch('/property/inspection/item2.do?cat_id='+ val , {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
    .then((res) => {
      Process.Close();
        let newOption = [];
        if(res.code=="SUCCESS"){
          res.data.forEach((obj, idx) => {
            newOption.push({ name: obj.name, value: obj.id ,result:obj.result})
          })
        }
        this.setState({catItemOptions:newOption})
        if(typeof callback =="function")callback();
    });
  }
  catItemValChange=(val)=>{
    let {formData}=this.state;
    let selData=tools.filterObjVal(formData[1].options,val,'value'); 
    let newArr=[];
    let options=[];
    try{ 
      if(selData.data.result)newArr=selData.data.result.split(',');
    }catch(e){}
    newArr.forEach((obj,idx)=>{
      options.push({name:obj,value:obj});
    })
    this.setState({statusOptions:options})
  }
  getForm = (data) => {
    
    Process.show();
    let newData = tools.deepCopy(data);
    let newArr = [];
    for (let i in newData.file) {
      newArr.push(newData.file[i].src)
    }

    newData.category = newData.category[0];
    newData.items = newData.items[0];
    newData.status = newData.status[0];
    newData.file = newArr.join(',');
    let url='/property/inspection2.do'
    if (this.edit == "edit") { 
      newData['id'] = this.editId
      url=`/property/inspection2/${this.editId}.do`;
    }else{
      newData['order_id'] = this.props.order_id;
    }
    fetch(url, {
      method: this.edit == "edit" ? "put" : "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(newData)
    }).then(response => response.json())
      .then((res) => {
        Process.Close();
        Toast.show({ msg: res.info })
        if (res.code == "SUCCESS") {
          this.toggleModal(0);
          let {page}=this.state;
          page.page_index=1;
          this.setState({page},()=>{
            this.upData();
          })
        } else if (res.code == "NO_DATA") {

        }
      });

  }
  openSelImgVal=(obj)=>{
    let imgVal=[];
      if(obj.file){
        let newArr=obj.file.split(',');
        for (let i in newArr){
          imgVal.push({name:"wj"+i,src:newArr[i]}) 
        }
      }
    this.setState({selImgVal:imgVal},()=>{
      this.toggleModal(1);
    })
  }
  render() {
    let {rendData,loading,formData,modalShow,page,len,catOptions,catItemOptions,statusOptions,selImgVal}=this.state;
    formData[0].options=catOptions;
    formData[0].itemChange=this.catValChange;
    formData[1].options=catItemOptions;
    formData[1].itemChange=this.catItemValChange;
    formData[2].options=statusOptions;
    let cont=rendData.map(function(obj, idx) {
      
      return (<tr key={idx}>
                 <td>
                  <input name="select" checked={this.validChecked(obj.id)} onClick={()=>{ this.toggleChecked(obj.id)}}  className="select-box"  type="checkbox" />
                </td>
                <td>{obj.id}</td>
                <td>{obj.category_name}</td>
                <td>{obj.items_name}</td>
                <td><a href="javascript:;" onClick={()=>{ this.openSelImgVal(obj); }} className="base-color">查看详细</a></td>
                <td>{obj.status}</td>
                <td>{obj.user_name}</td>
                <td>{obj.remark}</td>
                <td>{obj.update_time}</td>
                <td>
                  <div className="btn-group mb15">
                    <a href="javascript:;" className="btn btn-sm btn-info" onClick={()=>{  this.filterEdit('edit',obj.id); }}>修改</a>
                    <a href="javascript:;" className="btn btn-sm btn-warn" onClick={()=>{ this.removeItem(obj.id); }}>删除</a>
                  </div>
                </td>
        </tr>);
    }, this)
    return (
      <div>
            
            <div className="wrapper">
                
                <section  className="p15 white-bg">
                    
               
                    <div>
                       
                          <div className="clearfix">
                            <div className="pb15">
                             <div className="fr btn-group">
                               
                                <span className=" btn btn-info fs13" onClick={()=>{ this.filterEdit('add'); }}>添加验车项目</span>
                                 <span className="btn btn-warn fs13" onClick={()=>{ this.removeItem("all")}}>删除所选验车项目</span>
                              </div>
                              <h4 className="fs20">验车项目列表</h4>
                            </div>
                            
                         
                          </div>
                         
                       
                        
                        <div id="column-table">
                            <Modal title="文件详细" show={modalShow[1]} onClose={()=>{  this.toggleModal(1)}}>
                              <FileGroup readOnly={true} title="照片" value={selImgVal} />
                            </Modal>
                            <Modal title="验车项目"   show={modalShow[0]} onClose={()=>{  this.toggleModal(0)}}>
                               {modalShow[0]? <Form formStyle="ver" formRendData={formData} onSubForm={this.getForm} />:""}
                            </Modal>
                            <div className="table-responsive fixed-loading">
                                <table className="table mt20 table-striped ">
                                    <thead>
                               
                                        <tr>
                                      <th>
                                                <input name="select"  className="select-box" type="checkbox"   checked={this.validCheckedAll()} onClick={()=>{ this.toggleCheckedAll()}} />
                                            </th>
                                            <th>记录id</th>
                                            <th>分类名称</th>
                                            <th>项目名称</th>
                                            <th>文件</th>
                                            <th>状态</th>
                                            <th>检验人</th>
                                            <th>备注</th>
                                            <th>更新时间</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      
                                        {cont}
                                    </tbody>
                                </table>

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

export default DetailInspectionItem;