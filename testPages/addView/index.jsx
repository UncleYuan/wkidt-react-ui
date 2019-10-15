
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
import reqwest from 'reqwest';

class Wrap extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'Form';
    this.state = {
      catData: [],
      loading: true,
      methodType: 'post',
      modalShow:[false,false]
    }
    this.pointer = {}
  }

  componentWillMount() {
    let arr = location.search.split('?');

    if (arr.length > 1) {
      this.setState({ methodType: 'put' })
      if (tools.getQueryString('edit') == 'true') {
        this.setState({
          id: tools.getQueryString('id')
        })
        this.getDetailData(tools.getQueryString('id'))
      }
    } else {
      this.getCateData();
    }

  }
  filterCatData = (data) => {
    let newData = [];
    data.forEach((obj, idx) => {
      newData.push({ name: obj.name, value: obj.id })
    })
    return newData;
  }

  getDetailData = (id) => {
    // fetch(`/explorer/info/${id}.do`, {
    //   method: 'get'
    // })
    //   .then(response => response.json())
    //   .then((res) => {
    //     if (res.code == 'SUCCESS') {

    //       this.setState({ detailData: res.data[0] });
    //       this.getCateData();
    //     } else if (res.code == 'NO_DATA') {
    //       this.getCateData();
    //     }
    //   })
    reqwest({
      url: `/explorer/info/${id}.do`,
      method: 'get',
      success: (res) => {
        if (res.code == 'SUCCESS') {

          this.setState({ detailData: res.data[0] });
          this.getCateData();
        } else if (res.code == 'NO_DATA') {
          this.getCateData();
        }
      }
    })
  }

  getCateData = () => {
    // fetch('/explorer/category.do', {
    //   method: "get",
    // }).then(response => response.json())
    //   .then((res) => {
    //     if (res.code == "SUCCESS") {
    //       let newData = this.filterCatData(res.data);
    //       this.setState({ loading: false, catData: newData });
    //     } else if (res.code == "NO_DATA") {
    //       this.setState({ loading: false, catData: [] });
    //     }
    //   });

    reqwest({
      url: `/explorer/category.do`,
      method: 'get',
      success: (res) => {
        if (res.code == "SUCCESS") {
          let newData = this.filterCatData(res.data);
          this.setState({ loading: false, catData: newData });
        } else if (res.code == "NO_DATA") {
          this.setState({ loading: false, catData: [] });
        }
      }
    })
  }
  getForm = (data) => {
    
    let newData = tools.deepCopy(data);
    newData['cat_id'] = newData['cat_id'].join(',');
    newData['content'] = JSON.stringify(newData['content']);
    let newArr = []
    newData['tags'].map((obj, idx) => {
      newArr.push(obj.name);
    })
    newData['tags'] = newArr.join(',');
    if (this.pointer.x) {
      newData['lat'] = this.pointer.x;
      newData['lng'] = this.pointer.x;
    }

    if (this.state.methodType == 'put') {
      newData.id = this.state.id
      this.setState({
        newData: newData
      }, () => {
        this.toggleModal(0);
      })

    } else {
      this.setState({
        newData: newData
      }, () => {
        this.handleSubmit();
      })

    }

  }

  handleSubmit = () => {
    // Process.show()
    reqwest({
      url: '/explorer.do?access_token=' + Token,
      method: this.state.methodType,
      type: 'json',
      data: this.state.newData,
      success: (res) => {
        // Process.Close();
        Toast.show({ msg: res.info })
        if (res.code == "SUCCESS") {

          this.toggleModal(1)

        } else if (res.code == "NO_DATA") {

        }

      }
    })
  }


  toggleModal=(i)=>{ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
  }
  getPointer = (p) => {
    this.pointer = p;
  }
  closeView=()=>{
    if (window.android) {
      window.android.redirect('ARTICLE',true)
    }
    if (window.webkit) {
      window.webkit.messageHandlers.ios_pop.postMessage('tanke');
    }
    
  }
  render() {
    let {loading, catData, detailData, modalShow} = this.state;

    if (loading) {
      return (<Loading></Loading>)
    }
    let successFooterHtml=(
      <div>
        <a href="javascript:;" onClick={()=>{ this.closeView(); }} className="btn btn-info mr5">回到列表</a>
        <a href="javascript:;" onClick={()=>{ this.toggleModal(1); }} className="btn btn-warn">继续编辑</a>
      </div>
    );
    return (

      <div className="main container pt30 pb30" >
        <Modal title="提示" show={modalShow[0]} onClose={()=>{ this.toggleModal(0)}}>
          <div className="tc pb20">是否要提交更改？</div>
          <div className="clearfix mAuto w150">
            <div className="fl btn-default btn" onClick={()=>{ this.toggleModal(0)}}>否</div>
            <div className="fr btn-info btn" onClick={this.handleSubmit}>是</div>
          </div>
        </Modal>
        <Modal title="编辑成功"  footer={successFooterHtml} show={modalShow[1]} onClose={()=>{  this.toggleModal(1)}}>
             <div className="pt15">恭喜您编辑成功</div>                 
        </Modal>
        <Form className="m" formStyle="horiz" onSubForm={this.getForm} >

          <FormCtrl name="title" label="文章标题" max={50} required={true} type="text" placeholder="请在这里输入文章标题" value={detailData != undefined ? detailData.title : ''} />
          <FormCtrl name="cat_id" label="文章分类" search={true} type="select-single" options={catData} value={detailData != undefined ? [detailData.cat_id] : []} />
          <FormCtrl name="thumb" label="封面图片" type="file-single" title="立即上传" value={detailData != undefined ? detailData.thumb[0] : ''} />
          <FormCtrl label="标签" name="tags" type="tags" value={detailData != undefined ? [{ name: detailData.tags }] : ''} />
          <FormCtrl label="正文" name="content" type="set-mobile-cont" value={detailData != undefined ? JSON.parse(detailData.content) : ''} />
          <FormCtrl label="" name="address" type="position" latLngChange={this.getPointer} />
        </Form>
      </div>
    )
  }
}




export default Wrap;
