
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest  from 'reqwest';
import Modal from '../src/Modal';
import Pager from '../src/Pager';
import Form from '../src/Form';
import Loading from '../src/Loading';
import Toast from '../src/Toast';
import Process from '../src/Process';
import tools from '../tools/public_tools';
import form_tools from '../tools/form_tools';

import FormCtrl from '../src/FormCtrl';
import Input from '../src/Input';
import Alert from '../src/Alert';
import {CheckRadio} from '../src/CheckRadio';
import Select from '../src/Select';
import FileSingle from '../src/FileSingle';
import FileGroup from '../src/FileGroup';
import SelectTagsInput from '../src/SelectTagsInput';
import InputPosition from '../src/InputPosition';
import Tags from '../src/Tags';
import SetMobileCont from '../src/SetMobileCont';
const formData = [ //添加所有接口表单数据
   {
    "name": "name",
    "label": "广告名",
    "value": "",
    "type": "text"
  },
 
  {
    "name": "image",
    "label": "图片",
    "value": '',
    "type": "file-single"
  },
     {
    "name": "summary",
    "label": "描述",
    "value": "",
    "type": "textarea"
  },
       {
    "name": "url",
    "label": "链接",
    "value": "",
    "type": "text"
  },

]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow:[false,false], //是否显示编辑表单弹窗
      formData:tools.deepCopy(formData), //表单数据渲染
      auditType:'none'
    };
    this.formType="add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId="";
  }
  componentWillReceiveProps(nextProps) {
        
  }
  componentWillMount() {
    this.filterType(this.props.params);
  }
  filterType=(params)=>{  
    if(params.type=="edit" && params.id){
      this.eidtColumn(params.id);
    }else{
      this.addColumn();
    }
  }
  filterCatData=(data)=>{
      let newData=[];
      data.forEach((obj,idx)=>{
        newData.push({name:obj.name,value:obj.id})
      })
      return newData;
    }

 

 
  eidtColumn=(id)=>{ //编辑数据
    fetch('/mishuo/' + id + '.do', {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        let nowData = tools.deepCopy(formData);
        let newRole=[];
        for(let i in data.data){
          if("content,tags".indexOf(i)>=0){
            try{
              if(data.data[i].length>0) data.data[i]=JSON.parse(data.data[i]);
            }catch(e) {
              data.data[i]=[];
            }
            
          }else if(i=="cat_id"){
            data.data[i]=[data.data[i]]
          }else if(i=="thumb"){
            let newData=data.data[i].split(',');
            let thumbArr=[];
            for(let x in newData){
              thumbArr.push({name:`${x}.jpg`,src:newData[x]})
            }
            data.data[i]=thumbArr;
          }
          nowData=form_tools.setArrObjVal(nowData,i,data.data[i]) 
        }
        this.eidtId=id;
        this.formType = "eidt";
        this.setState({
          formData: nowData
        })
        this.toggleModal(0);
      });

  }
  toggleModal=(i)=>{ //切换弹窗显示
    let {modalShow}=this.state;
    modalShow[i]=!modalShow[i]
    this.setState({modalShow})
  }
  addColumn=()=>{ //添加数据
    this.formType = "add";
    this.eidtId="";
    this.setState({
      formData: tools.deepCopy(formData)
    })
  }
  setEidtForm=(data)=>{ //保存表单

    let url = "";

    if (this.formType == "add") {

      url = "/oneyuan/ads.do";

    } else {
     
      url = ` /oneyuan/ads.do`;
      // url = `/mishuo/${this.props.params.id}.do`;
    }
    data.content=JSON.stringify(data.content);
    let newThumb=[];
    for(let i in data.thumb){
      newThumb.push(data.thumb[i].src);
    }
    data.thumb=newThumb.join(',');
    Process.show();
 
    fetch(url, {
        method:this.formType == "add" ? "post" : "put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam(data)
      }).then(response => response.json())
      .then((data)=>{
        Process.Close();
        Toast.show({msg:data.info});
        if (data.code != "SUCCESS") {
          this.setState({
            formData: this.state.formData
          })
        } else {
          Modal.show({
            child: <div className="fs20">恭喜您{this.formType == "add"?"添加":"编辑"}成功</div>,
            conf:{
              footer:(
                      <div>
                        <a href="javascript:;"  onClick={()=>{  Modal.close();}} className="btn btn-warn">{"继续"+(this.formType == "add"?"添加":"编辑")}</a>
                        <a href="javascript:;"  onClick={()=>{  location.hash="/oneyuan/ads.html"; Modal.close(); }} className="btn btn-info">回到列表</a>
                      </div>
                   )
            }
          })

          if (this.formType == "add") {
            this.addColumn();
          }
        }
      })

  }


  

 
  render() {

    let {formData,catData,loading}=this.state;
    if(loading){
      return(<Loading></Loading>)
    }
    formData[1].options=catData;
    return (
      <div>
            
            <div className="wrapper">
                <section className="panel">
                   
                   
                    <div className="panel-body">
                      <Form formStyle="ver" className="m" formRendData={formData}  onSubForm={this.setEidtForm} />
                    </div>
                </section>
            </div>
        </div>

    );
  }
}


module.exports = MainCont;