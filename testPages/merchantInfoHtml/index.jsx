
import React, { Component } from 'react';

import Loading from '../../src/Loading';
import Select from '../../src/Select';

import Form from '../../src/Form';
import FormCtrl from '../../src/FormCtrl';
import Input from '../../src/Input';
import CheckRadio from '../../src/CheckRadio';
import Modal from '../../src/Modal';
import FileSingle from '../../src/FileSingle';
import FileGroup from '../../src/FileGroup';
import Cascader from '../../src/Cascader';
import TimeSelector from '../../src/TimeSelector';
import TimeSelectInput from '../../src/TimeSelectInput';
import SetMobileCont from '../../src/SetMobileCont';
import InputPosition from '../../src/InputPosition';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import Tags from '../../src/Tags';
import tools from '../../tools/public_tools';

const FormProps = [
  {
    name: "uid",
    label: "商家id",
    type: "text",
    readOnly:true,
    value: ""
  },
  {
    name: "name",
    label: "名字",
    type: "text",
    readOnly:true,
    value: ""
  },
   {
    name: "phone",
    label: "手机号",
    type: "text",
    value: ""
  },
  {
    name: "avatar",
    label: "头像",
    type: "file-single",
    title:"请上传",
    value: ""
  },

  {
    name: "contact",
    label: "联系人",
    type: "text",
    value: ""
  },
  
  {
    name: "address",
    label: "联系地址",
    type: "text",
    value: ""
  },
  {
    name: "description",
    label: "简介",
    type: "set-mobile-cont",
    options: []
  },
   {
    name: "image",
    label: "大图",
    type: "file-single",
    title:"请上传",
    value: ""
  },
   {
    name: "url",
    label: "官网",
    type: "text",
    value: ""
  }
]
class Wrap extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'Form';
    this.state = {
      catData: [],
      loading: true,
      modalShow:[false,false],
      formRendData: tools.deepCopy(FormProps)
    }
    this.pointer = {};
    this.cityData = [];
    this.options = [];
    this.edit = "add";
    this.editId = null;
  }

  componentWillMount() {
    this.filterEdit();
  }
  toggleModal=(i)=>{ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
  }
  
  filterEdit = () => {
    let edit =true;
    let  id = null;
    try{ id =location.href.match(/[0-9]+.html/)[0].split('.')[0]; }catch(e){}
    if (edit && id) {
      this.edit = "edit";
      this.editId = id;
      this.eidtForm(id, () => {
        
      });
    } else {
      
    }
  }
  eidtForm = (id, callback) => {
  
    fetch('/merchant/' + id + '.do?access_token=' + Token, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        let {formRendData} = this.state;
       for (let x in formRendData) {
          for (let i in res.data) {
            if (formRendData[x].name == i) {
              if ("description".indexOf(i) >= 0) {
                try{
                  formRendData[x].value=JSON.parse(res.data[i]);
                }catch(e){
                  formRendData[x].value=[];
                }
              } else {
                formRendData[x].value = res.data[i]
              }

            }
          }
        }

        this.setState({ formRendData,loading:false }, () => {
          if (callback) callback();
        })
      });
  }
  getForm = (data) => {
    
    Process.show();
    let newData = tools.deepCopy(data);
   /* let newArr = [];
    for (let i in newData.thumb) {
      newArr.push(newData.thumb[i].src)
    }
    let tagsArr = [];
    for (let i in newData.tags) {
      tagsArr.push(newData.tags[i].name)
    }*/
    //delete newData.tags;

    newData.description = JSON.stringify(newData.description);
    if (this.edit == "edit") { newData['id'] = this.editId }
    fetch('/merchant.do?access_token=' + Token, {
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
  closeView=()=>{
    if (window.android) {
      window.android.closeWebView()
    }
    if (window.webkit) {
      window.webkit.messageHandlers.ios_pop.postMessage('editMerchant');
    }

  }
  openNew=()=>{
    location.href="/";
  }
  render() {
    let {loading, catData, formRendData,modalShow} = this.state;
    formRendData[2].options = this.options;
    if (loading) {
      return (<Loading></Loading>)
    }
    let successFooterHtml=(
      <div>
        <a href="javascript:;" onClick={()=>{ this.openNew(); }} className="btn btn-info mr5">立即预览</a>
        <a href="javascript:;" onClick={()=>{ this.closeView(); }} className="btn btn-warn">关闭页面</a>
      </div>
    );
    return (

      <div className="main container pt30 pb30" >
        <Modal title="编辑成功"  footer={successFooterHtml} show={modalShow[0]} onClose={()=>{  this.toggleModal(0)}}>
             <div className="pt15">恭喜您编辑成功</div>                 
        </Modal>
        <Form className="m" formRendData={formRendData} formStyle="horiz" onSubForm={this.getForm} >

        </Form>
      </div>
    )
  }
}




export default Wrap;
