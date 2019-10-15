
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';
import Modal from '../../src/Modal';
import Pager from '../../src/Pager';
import Form from '../../src/Form';
import Loading from '../../src/Loading';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';

import FormCtrl from '../../src/FormCtrl';
import FormSub from '../../src/FormSub';
import FileSingle from '../../src/FileSingle';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import { InputGroup } from '../../src/InputGroup';
import Panel from '../../jsCk/comp/Panel';
import { FileGroup } from '../../src/FileGroup';
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
import ZcdetailsFiles from './zcDetails_files';
import ZcDetailsAuditlog from './zcDetails_auditlog';
const goNextFormData = [

  {
    "name": "amount",
    "label": "处置金额",
    "value": "",
    "barHtml": <div className='btn gray-bg'>万元</div>,
    "type": "input-group"
  },
   {
    "name": "client_name",
    "label": "客户姓名",
    "value": "",
    "type": "text"
  },
   {
    "name": "client_id_card",
    "label": "客户的身份证号",
    "value": "",
    "type": "text"
  },
   {
    "name": "client_phone",
    "label": "电话",
    "value": "",
    "type": "text"
  },
   {
    "name": "dispose_time",
    "label": "处置时间",
    "value": "",
    "format":"y-m-d",
    "type": "time-select-input"
  },
  {
    "name": "attachment",
    "label": "交接资料照片",
    "title": "交接资料照片",
    "value": [],
    "upLoadType":"group",
    "type": "img-upload-group"
  },
  {
    "name": "attachment2",
    "label": "附件",
    "title": "附件",
    "upLoadType":"group",
    "value": [],
    "type": "img-upload-group"
  }
]

const FormDataPro =
  [{
    "label": "状态选择",
    "value": [],
    "inline": true,
    "type": "radio",
    "name": "status",
    "options": [
      {
        name: "通过",
        value: '1'
      },
      {
        name: "不通过",
        value: '2'
      }
    ]
  },
  {
    "name": "collection_amount",
    "label": "收款金额",
    "value": "",
    "barHtml": <div className='btn gray-bg'>万元</div>,
    "type": "input-group"
  },
  {
    "name": "collection_account",
    "label": "收款账号",
    "value": "",
    "type": "text"
  },
  {
    "name": "collection_auth",
    "label": "上传收款凭证",
    "title": "收款凭证",
    "value": [],
    "type": "img-upload-group"
  },
  {
    "name": "remark2",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
  ]


const pagePro = {
  page_count: 0,
  page_index: 1,
  record_count: 0
}
const defaultProps = {
};
class DetailDisposeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      selTab: 0,
      itemData: {},
      goFormData: [],
      goNextFormData: tools.deepCopy(goNextFormData),
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
  }
  
  componentWillReceiveProps(nextProps) {


  }
  componentWillMount() {

  }
  componentDidMount() {
    if (!this.props.item_id) {
      this.addData();
    } else {
      this.upData((data) => {
   
      });
     
    }

  }
 
 
  addData = () => {
  
    this.setState({ loading: false});
  }
  upData = (callback) => {
    let { item_id } = this.props;
    fetch(`/property/dispose/${item_id}.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          let goNextFormData = this.resetGoNextFormData(data, data);
          
          this.setState({
            itemData: data.data,
            goNextFormData: goNextFormData,
            loading: false
          })

        } else if (data.code == "NO_DATA") {
          this.setState({
            itemData: {},
            loading: false
          })
        }
        if (callback) callback(data);
      });

  }
  resetGoNextFormData = (data) => {
    let goNextFormData = tools.deepCopy(this.state.goNextFormData);
    let { orderInfo } = this.props;
    goNextFormData[0].readOnly = true;
    for (let i in data.data) {
      form_tools.setArrObjVal(goNextFormData, i, data.data[i]);
    }
    return goNextFormData;
  }
  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  turnTab = (idx) => {
    this.setState({ selTab: idx })
  }
  goSub = (subData) => {
    let { orderInfo, item_id,proper_id } = this.props;
    subData.attachment=JSON.stringify(subData.attachment);
    subData.attachment2=JSON.stringify(subData.attachment2);
    Process.show();
    fetch(`/property/dispose.do`, {
      method:  "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({property_id:proper_id},subData))
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          location.hash = "#/dzzc.html/" + orderInfo.id +  "/dispose/" + (new Date()).valueOf() + (data.data ? "/" + data.data : "");
        tools.sendUpdataUser();
        }
      })
  }
 
  render() {
    let {loading, formData, modalShow, selTab, goNextFormData, goFormData, itemData } = this.state;
    let { order_id, orderInfo, item_id } = this.props;

    let isSub = orderInfo.permissions.indexOf('0601') >= 0 
    if(loading){
      return(<Loading></Loading>)
    }
    return (
      <div>
        <div className="mb5 tl">
          <div className="crumbs">
            <ul>
              <li><a className={selTab == 0 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(0); }}>处置登记</a></li>
              <li><a className={selTab == 1 ? "active" : ""} href="javascript:;" onClick={() => { this.turnTab(1); }}>操作记录</a></li>
            </ul>
          </div>
        </div>
        <div className="wrapper">
          <div className="white-bg pb30" style={{ display: selTab == 0 ? "block" : "none" }}>

            <div className="fs20 ml15 pt20 desalt-color">处置登记信息</div>
            <div className="p20">
              {/*disabled={parseInt(itemData.status) == 0 ? false : true}*/}
              <Form labelCol="col-md-3" InputCol="col-md-9" disabled={item_id?true:false} onSubForm={(data) => { this.goSub(data) }} >
                <div className="row">
                 
                

                    <div>{goNextFormData.map((obj, idx) => {
                      if (!item_id && obj.name == "nper") { return null; }
                      return (<FormCtrl key={idx} {...obj} />)
                    })}</div>
                    <div style={{ display: itemData.status == 0 || !item_id ? "block" : "none" }}>
                      <FormSub></FormSub>
                    </div>
                  </div>
               
              </Form>
            </div>
        
          </div>
          <div style={{ display: selTab == 1 ? "block" : "none" }}>
            <ZcDetailsAuditlog step={"dispose"} add_id={item_id} model="property" data_id={typeof orderInfo.id == "object" ? orderInfo.id.join('') : orderInfo.id}></ZcDetailsAuditlog>
          </div>
        </div>
      </div>

    );
  }
}

export default DetailDisposeItem;