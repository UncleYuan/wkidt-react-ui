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
import {CheckRadio} from '../../src/CheckRadio';
import {InputGroup} from '../../src/InputGroup';

const ymData = [  //添加页面接口表单数据
    {
        "name": "rule",
        "label": "接口规则，参考thinkphp路由定义",
        "value": "",
        "type": "text"
    },
    {
        "name": "address",
        "label": "接口指向的控制器，格式：模块/控制器/方法",
        "value": "",
        "type": "text"
    },
    {
        "name": "name",
        "label": "接口名称",
        "value": "",
        "type": "text"
    },
    
    {
        "name": "remark",
        "label": "备注",
        "value": "",
        "type": "textarea"
    },
    {
        "name": "options",
        "label": "路由选项",
        "value": "",
        "type": "textarea"
    },
    {
        "name": "is_public",
        "label": "是否是公开接口",
        "value": [],
        "type": "radio",
        "inline": true,
        "options": [{
            "name": "否",
            "value": '0'
        }, {
            "name": "是",
            "value": '1'
        }]
    }
]

const apiData=tools.deepCopy(ymData);  //添加api接口表单数据

apiData.push({
          "name": "method",
          "label": "接口请求类型",
          "value": "",
          "type": "radio",
          "inline": true,
          "options": [{
              "name": "GET",
              "value": "get"
          }, {
              "name": "POST",
              "value": "post"
          }, {
              "name": "DELETE",
              "value":"delete"
          },{
              "name": "PUT",
              "value":"put"
          },{
              "name": "HEAD",
              "value":"head"
          }]
      });
const qtData = [  //添加其他接口表单数据
     {
        "name": "name",
        "label": "接口名称",
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

const formData={ //添加所有接口表单数据
            "field": "type",
            "name": "资源类型",
            "value": ['1'],
            "type": "radio",
            "options": [
                { 
                    "name": "页面",
                    "value":'1',
                   /* "child":ymData*/
                },
                {
                    "name": "接口",
                    "value": '2',
                 /*   "child": apiData*/
                },
                {
                    "name": "其他",
                    "value": '3',
                   /* "child":qtData*/
                }
            ]
        }
    


class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,  //是否加载中， 保留，暂无作用
        modalShow:false, //是否显示编辑表单弹窗
        rendData:[], //列表数据
        selArr:[],  //选择列表数组,保留,用于全选
        page:{ //分页数据
          page_count:0, //分页页数
          page_index:1,//当前页码
          record_count:0 //共计条数
        },
        len:30, //分页长度
        selectFormIndex:[1],
        formShow:false,
        selectFormData:tools.deepCopy(apiData)  //表单数据渲染
    };
    this.formType="add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtData={};
    this.timer=null;
    this.eidtId="";
  }
  componentWillReceiveProps(nextProps) {


  }
  componentDidMount() {
    this.upData(); 
  }
  upData=(callback)=>{ //更新表单数据
    let {page,len}=this.state;
      this.setState({loading:true})

      fetch('/system/resource.do?'+tools.parseParam({page:page.page_index,len:len}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        this.setState({rendData:data.data,page:data.page,loading:false})
         if(callback) callback();
      });

   }
   resetFormData=(data,nowData,id)=>{
      for(let i in data){
            if("method,is_public".indexOf(i)>=0){
              data[i]=[data[i]]
            }
            nowData=form_tools.setArrObjVal(nowData,i,data[i],"value");
          }
          /*if(nowData[0].name!="id"){
            nowData.unshift({
              "name": "id",
              "label":"当前编辑项id",
              "value":id,
              "type": "text",
              "readOnly":true
            })
          }*/
          
      return nowData;
   }
   eidtColumn=(id)=>{ //编辑数据
    Process.show();
    fetch('/system/resource/'+id+'.do', {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        Process.Close();
        this.eidtData=tools.deepCopy(data.data);
        this.eidtId=id;
        let nowData=[]
        this.formTypeChange([data.data.type],()=>{
          let {selectFormData}=this.state;
          nowData=tools.deepCopy(selectFormData);
          nowData=this.resetFormData(data.data,nowData,id)
          
          this.setState({selectFormData:nowData})
        }) 
        this.formType="eidt";
        this.toggleModal();
    });
    
      
   }
   toggleModal=()=>{ //切换弹窗显示

    this.setState({modalShow:!this.state.modalShow,formShow:!this.state.modalShow})
   }
   addColumn=()=>{ //添加数据
      this.formType="add";
      this.eidtData={};
      this.eidtId="";
      this.setState({selectFormData:tools.deepCopy(apiData),modalShow:!this.state.modalShow})
   }

   setEidtForm=(data)=>{  //保存表单
    let url="";
    Process.show();
    let {selectFormIndex}=this.state;
    if(this.formType=="add"){
      if(selectFormIndex[0]==1){
        url="/system/resource/page.do";
        data['is_public']=data['is_public'][0];
      }else if(selectFormIndex[0]==2){
        url="/system/resource/api.do";
        data['is_public']=data['is_public'][0];
        data['method']=data['method'][0];
      }else if(selectFormIndex[0]==3){
        url="/system/resource/other.do"; 
         
      }
    }else{
      url="/system/resource/"+this.eidtId+".do"
      if(selectFormIndex[0]==1){
        data['is_public']=data['is_public'][0];
      }else if(selectFormIndex[0]==2){
        data['is_public']=data['is_public'][0];
        data['method']=data['method'][0];
      }
    }
    fetch(url, {
        method: this.formType=="add"?"post":"put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam(data)
      }).then(response => response.json())
      .then((data)=>{
        Process.Close();
        Toast.show({msg:data.info});
        if(data.code!="SUCCESS"){
          this.setState({selectFormData:this.state.selectFormData})
        }else{
          this.toggleModal();

          if(this.formType=="add"){
            let {page}=this.state;
            page.page_index=1;
            this.setState({page:page,selectFormData:[]});
          }
          this.upData(function(){
            
          });
        }
    });

   }
   onSetSelIdx=(idx)=>{ //选择分页回调
    let {page}=this.state;
    page.page_index=idx;
    this.setState({page:page});
    this.upData();
   }
   sureDelItem=(id)=>{
      let {page}=this.state;
      fetch('/system/resource.do', {
        method: "DELETE",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({id:id})
      }).then(response => response.json())
      .then((data)=>{
         if(data.code=="SUCCESS"){
            this.upData();
            Modal.close();
          }
          Toast.show({msg:data.info})
        if(callback) callback();
      });     
    }
    removeItem=(id)=>{  //删除数据
      Modal.show({
            child:<div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof(id)!="string"?id.join(','):id}</span> 的资源？</div>,
            conf:{
              footer:(
                <a href="javascript:;"  onClick={()=>{ 
                  this.sureDelItem(id)
               }} className="btn btn-info">确定删除</a>)
            }  
      })
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
  formTypeChange=(val,callback=()=>{})=>{
    let selectData=[];
    this.setState({formShow:false},()=>{


      switch (val[0]){
        case '1':
          selectData=tools.deepCopy(ymData);
          break;
        case '2':
          selectData=tools.deepCopy(apiData);
          break;
        case '3':
          selectData=tools.deepCopy(qtData);
          break;
        }
        if(this.formType=="eidt"){
          selectData=this.resetFormData(this.eidtData,selectData,this.eidtId)
        }
        this.setState({selectFormIndex:val,selectFormData:selectData,formShow:true},callback);
     })
  }
  render() {
    let {selectFormIndex,modalShow,loading,page,len,rendData,selectFormData,formShow}=this.state;
      let cont= rendData.map(function(obj,idx){
      return(
          <tr key={idx}>
                {/*<td>
                    <input name="select"  className="select-box" value="all" type="checkbox" />
                </td> */}
                <td>{obj.id}</td>
                <td>{obj.type_name}</td>
                <td>{obj.rule}</td>
                <td>{obj.address}</td>
                <td>{obj.method}</td>
                <td>{obj.name}</td>
                <td>{obj.remark }</td>
                <td>{obj.is_public_name}</td>
                <td>
                <div className="btn-group mb15">
                    <a href="javascript:;" onClick={()=>{this.eidtColumn(obj.id)}} className="btn btn-sm btn-info">更新资源</a>
                    <button className="btn btn-sm btn-default" onClick={()=>{this.removeItem(obj.id)}} type="button">删除资源</button>
                </div>
            </td>
        </tr>  
         );
    },this)
    let LoadCont=loading?<div className="fixed-loading-bg"><Loading /></div>:"";
    return (
        <div>
            
            <div className="wrapper">
                <section className="panel p15">
                 
                    <div className="panel-body">
                        <div className="btn-group mb15">
                            <a href="javascript:;" onClick={this.addColumn} className="btn btn-info">添加资源</a>
                            {/*<button className="btn btn-default" type="button">删除所选资源</button>*/}
                        </div>
                        <div id="column-table">
                            <Modal title="编辑资源" maxWidth="1000" show={modalShow} onClose={()=>{ this.toggleModal()}} name="eidtModal">
                                <div className="pb10 pt15">
                                  <CheckRadio inline={true} type="radio" checkradioStyle="btn" options={formData.options} label={formData.label} value={selectFormIndex} onValueChange={(val)=>{ this.formTypeChange(val); }} ></CheckRadio>
                                </div>
                                {formShow?<Form formStyle="ver" formRendData={selectFormData} onSubForm={this.setEidtForm}/>:""}
                            </Modal>
                            <div className="table-responsive fixed-loading">
                                <table className="table mt20 table-striped ">
                                    <thead>
                                        <tr>
                                            {/*<th>
                                                <input name="select" className="select-box" value="all" type="checkbox" />
                                            </th>*/}
                                            <th>资源id</th>
                                            <th>类型</th>
                                            <th>地址/规则</th>
                                            <th>指向的控制器</th>
                                            <th>请求类型</th>
                                            <th>名称</th>
                                            <th>备注</th>
                                            <th>是否公开资源</th>
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
                                    <div className="col-md-9 col-lg-10">
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


module.exports =MainCont;