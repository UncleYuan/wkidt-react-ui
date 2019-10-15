
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
    name: "title",
    label: "标题",
    type: "text",
    value: ""
  },
  {
    name: "sub_title",
    label: "附标题",
    type: "text",
    value: ""
  },
   {
    name: "buy_thumb",
    label: "购买链接缩略图",
    type: "file-single",
    title: "请上传",
    value: ""
  },
  {
    name: "cat_id",
    label: "分类",
    type: "select-single",
    search: true,
    options: []
  },

  {
    name: "thumb",
    label: "缩略图",
    type: "file-group",
    title: "请上传",
    value: ""
  },
  
  {
    name: "buy_url",
    label: "购买 地址",
    type: "text",
    value: ""
  },
  {
    name: "buy_price",
    label: "购买价格",
    type: "num",
    value: ""
  },
  {
    name: "content",
    label: "内容",
    type: "set-mobile-cont",
    options: []
  }, {
    name: "tags",
    label: "标签",
    type: "tags",
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
  upDataCate = () => {

    fetch('/jindian/category.do?access_token=' + Token+'&all=1', {
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
        this.options = newOption;
        this.setState({ loading: false })
      });

  }
  filterEdit = () => {
    let edit = tools.getQueryString('edit');
    let id = tools.getQueryString('id');

    if (edit && id) {
      this.edit = "edit";
      this.editId = id;
      this.eidtForm(id, () => {
        this.upDataCate();
      });
    } else {
      this.upDataCate();
    }
  }
  eidtForm = (id, callback) => {
    fetch('/merchant/jindian/' + id + '.do?access_token=' + Token, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        let {formRendData} = this.state;
        for (let x in formRendData) {
          for (let i in res.data) {
            if (formRendData[x].name == i) {
              if ("cat_id".indexOf(i) >= 0) {
                formRendData[x].value = [res.data[i]]
              } else if ("thumb".indexOf(i) >= 0) {
                let newArr = [];
                for (let h in res.data[i]) {
                  newArr.push({ src: res.data[i][h] });
                }
                formRendData[x].value = newArr
              } else if ("content".indexOf(i) >= 0) {
                try {
                  formRendData[x].value = JSON.parse(res.data[i]);
                } catch (e) {
                  formRendData[x].value = [];
                }

              } else if ("tags".indexOf(i) >= 0) {
                if (res.data[i]) {
                  let newArr = res.data[i].split(',');
                  let toTags = [];
                  newArr.length > 0 && newArr.forEach((obj, idx) => {
                    toTags.push({ name: obj, value: idx });
                  })
                  formRendData[x].value = toTags;
                } else {
                  formRendData[x].value = [];
                }
              } else {
                formRendData[x].value = res.data[i]
              }

            }
          }
        }

        this.setState({ formRendData }, () => {
          if (callback) callback();
        })
      });
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
  closeView=()=>{
    if (window.android) {
      window.android.closeWebView()
    }
    if (window.webkit) {
      window.webkit.messageHandlers.ios_pop.postMessage('jindian');
    }

  }
  render() {
    let {loading, catData, formRendData,modalShow} = this.state;
    formRendData[3].options = this.options;
    if (loading) {
      return (<Loading></Loading>)
    }
    let successFooterHtml=(
      <div>
        <a href="javascript:;" onClick={()=>{ this.closeView(); }} className="btn btn-info mr5">回到列表</a>
        <a href="javascript:;" onClick={()=>{ this.toggleModal(0); }} className="btn btn-warn">继续编辑</a>
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
