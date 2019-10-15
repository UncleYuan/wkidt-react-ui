
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
import SelectTagsInput from '../../src/SelectTagsInput';
import InputPosition from '../../src/InputPosition';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import Tags from '../../src/Tags';
import tools from '../../tools/public_tools';

const FormProps = [

  {
    name: "ads_id",
    label: "广告ID",
    type: "select-tags-input",
    title: "关联广告",
    selLen: 1,
    value: []
  }
]
let paremsArr = location.href.match(/bindads\/[aA-zZ]+\/[0-9]+/)[0].split('/');
paremsArr.shift();
let [contentType, thisId] = paremsArr;

class Bindads extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'Form';
    FormProps[0].source= "/merchant/modal-select.do?model=content_ads&field=myads&access_token=" + Token;
    this.state = {
      catData: [],
      loading: true,
      modalShow:[false,false],
      formRendData: tools.deepCopy(FormProps)
    }
    this.pointer = {};

    this.edit = "add";
    this.editId = null;
  }

  componentWillMount() {
   

    this.filterEdit();
  }

  filterEdit = () => {


    if (thisId) {
      this.edit = "edit";
      this.editId = thisId;
      this.eidtForm(thisId, () => {

      });
    } else {
      alert('您的地址错误');
    }
  }
  eidtForm = (id, callback) => {

    fetch(`/merchant/ads/content/${id}.do?access_token=${Token}`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {

        let {formRendData} = this.state;
        if (res.code == "SUCCESS") {
          let contArr = [];
          res.data.length > 0 && res.data.forEach((obj, idx) => {
            contArr.push({ name: obj.title, value: obj.content_id });
          })
          formRendData[0].value = contArr;
        }
        this.setState({ formRendData, loading: false }, () => {
          if (callback) callback();
        })
      }, function (e) {
        alert(e);
      });
  }
  getForm = (data) => {
    Process.show();
    let newData = tools.deepCopy(data);
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

    newData.content_ids = this.editId;
    newData['ads_id'] = newData['ads_id'][0].value;
    newData['content_type'] = contentType;
    newData['oto'] = 1;
    fetch('/merchant/ads/content.do?access_token=' + Token, {
      method: "post",
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
          if (window.android) {
            //window.android.redirect('ARTICLE',true)
          }

        } else if (res.code == "NO_DATA") {

        }
      });

  }
  toggleModal=(i)=>{ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
  }
  closeView=()=>{
    if (window.android) {
      window.android.closeWebView()
    }
    if (window.webkit) {
      window.webkit.messageHandlers.ios_pop.postMessage('gl');
    }
    
  }
  render() {
    let {loading, catData, formRendData,modalShow} = this.state;

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




export default Bindads;
