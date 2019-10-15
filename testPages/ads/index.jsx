
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
    name: "name",
    label: "广告名",
    type: "text",
    value: ""
  },
  {
    name: "area",
    label: "地区选择",
    type: "select-multiple",
    search: true,
    options: []
  },
  {
    name: "image100_100",
    label: "图片100x100",
    type: "file-single",
    title: "按尺寸上传",
    value: ""
  }, {
    name: "image800_400",
    label: "图片800x400",
    type: "file-single",
    title: "按尺寸上传",
    value: ""
  }, {
    name: "image720_1010",
    label: "图片720X1010",
    type: "file-single",
    title: "按尺寸上传",
    value: ""
  }, {
    name: "description",
    label: "描述",
    type: "textarea",
    value: ""
  }
]
class Wrap extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'Form';
    this.state = {
      catData: [],
      modalShow:[false,false],
      loading: true,
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
  upDataCity = () => {
    fetch('/system/area/getAllCity.do?access_token=' + Token, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        this.cityData = res.data;
        let newOption = [];
        this.cityData.forEach((obj, idx) => {
          let item = [{ name: obj.title, value: "pro" + obj.area_id, className: 'fs14', connect: [] }];
          let child = [];
          obj.city_list.forEach((o, i) => {
            item[0].connect.push(o.area_id);
            child.push({ name: o.title, value: o.area_id, parentValue: "pro" + obj.area_id });
          })
          item = item.concat(child)
          newOption = newOption.concat(item);
        })
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
        this.upDataCity();
      });
    } else {
      this.upDataCity();
    }
  }
  eidtForm = (id, callback) => {
    fetch('/merchant/ads/' + id + '.do?access_token=' + Token, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        let {formRendData} = this.state;
        for (let x in formRendData) {
          for (let i in res.data) {
            if (formRendData[x].name == i) {
              formRendData[x].value = res.data[i]
            }
          }
        }
        if (res.data.city_ids) {
          formRendData[1].value = res.data.city_ids.split(',')
        }
        this.setState({ formRendData }, () => {
          if (callback) callback();
        })
      });
  }
  getForm = (data) => {
    if (window.webkit) {
      window.webkit.messageHandlers.ios_askToken.postMessage('token');

      if (Token.length > 10) {

      } else {
        window.webkit.messageHandlers.ios_askLogin.postMessage('token');

      }
    }


    if (window.android) {
      Token = window.android.getToken();

      if (Token != undefined) {

      } else {
        window.android.login();
      }
    }
    Process.show();
    let newData = tools.deepCopy(data);
    let newArr = [];
    newData.area.forEach((obj) => {
      if (obj.indexOf('pro') < 0) {
        newArr.push(obj);
      }
    })
    newData['city_ids'] = newArr.join(',');
    if (this.edit == "edit") { newData['id'] = this.editId }
    delete newData.area;
    fetch('/merchant/ads.do?access_token=' + Token, {
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
  getPointer = (p) => {
    this.pointer = p;
  }
  closeView=()=>{
    if (window.android) {
      window.android.closeWebView()
    }
    if (window.webkit) {
      window.webkit.messageHandlers.ios_pop.postMessage('ads');
    }
    
  }
  toggleModal=(i)=>{ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
  }
  render() {
    let {loading, catData, formRendData,modalShow} = this.state;
    formRendData[1].options = this.options;
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
