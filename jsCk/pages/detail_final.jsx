
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
import FileSingle from '../../src/FileSingle';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import { InputGroup } from '../../src/InputGroup';
import Panel from '../../jsCk/comp/Panel';
import { FileGroup } from '../../src/FileGroup';
import TableList from './public/TableList';
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
const FormDataPro =  //审核
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
    "name": "attachment",
    "label": "附件",
    "value": "",
    "type": "img-upload-group"
  },
  {
    "label": "终审额度",
    "value": "",
    "type": "input-group",
    "barHtml": <div className='btn gray-bg'>万元</div>,
    "name": "amount"
  },
  {
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
  ]


const defaultProps = {
};
class DetailFinal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      reviewFormData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.openContId = ""
  }
  static contextTypes = {
    orderInfo: React.PropTypes.object,
    getOrderState: React.PropTypes.func
  }
  componentWillReceiveProps(nextProps) {


  }


  componentWillMount() {

  }

  componentDidMount() {


  }

  textChange = (name, val) => {
    let setState = {};
    setState[name] = val;
    this.setState(setState);

  }

  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }

  goReview = (data) => {
    let {order_id} = this.props;
    Process.show();
    fetch(`/order/finals.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        order_id: order_id,
        remark: data.remark,
        amount: data.amount,
        attachment: JSON.stringify(data.attachment),
        status: data.status.join(',')
      })
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        this.toggleModal(1);
        if (data.code == "SUCCESS") {
          Modal.show({
            child: <div className="fs14 ">{data.info}</div>,
            conf: {
              footer: (
                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + order_id + "/final/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>)
            }

          })
        }
      });
  }
  listRendHtml = (obj, idx) => {
    return (
      <tr key={idx}>
        <td>{obj.id}</td>
        <td>{obj.apply_name}</td>
        <td>{obj.user_name}</td>
        <td>{obj.add_time}</td>
        <td>{obj.update_time}</td>
        <td className="base-color">{obj.status_name}</td>
        <td><ImgUploadGroup readOnly={true} width="120" height="80" value={obj.attachment}></ImgUploadGroup></td>
        <td>{obj.remark}</td>
         <td className="base-color">{(obj.amount&&Number(obj.amount)==0)||!obj.amount?"-":obj.amount}</td>
      </tr>
    )
  }
  render() {
    let { loading, reviewFormData, modalShow} = this.state;
    let {order_id} = this.props;
    let {orderInfo} = this.context;
    let isReview = orderInfo.permissions.indexOf('0401') >= 0;
    if (loading) {
      return (<Loading></Loading>);
    }

    return (

      <div className="mb5 ">
        <Modal sizeClass="sm" title={"终审审核"} show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
          <Form formRendData={reviewFormData} formStyle="ver" onSubForm={(data) => { this.goReview(data) }}></Form>
        </Modal>
        <div className="pb15 pl10">
          <h4 className="fs24">终审记录</h4>
        </div>

        <div className="wrapper mb15" >
          <div className="p20 white-bg">
            <div className="uba1 fuzzy-border p15 mb10">
              {(() => {
                if (orderInfo) {
                  let statusNum = parseInt(orderInfo.end_audit_status);
                  if (statusNum > 0) {
                    let icon = "";
                    let txt = "";
                    let reviewBtn = isReview ? <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-info">终审审核</a> : "";
                    switch (statusNum) {
                      case 1:
                        icon = "icon-shenhezhong assist-color";
                        txt = "已经提交终审申请," + (isReview ? "请审核吧" : "请等待审核吧");
                        break;
                      case 2:
                        icon = "icon-shenhetongguo base-color";
                        txt = "当前终审已经通过审核,想了解更多可以查看记录";
                        break;
                      case 3:
                        icon = "icon-shenheweitongguo contrary-color";
                        txt = "当前终审没有通过审核,了解更多可以查看记录";
                        break;
                    }
                    return (<div><i className={"iconfont fs80 lh1 vm " + icon}></i><div className="inline-block vm pl15"><div className="fs16 pb5"> {txt}</div>{reviewBtn}</div> </div>)
                  } else {
                    return (<div>您尚未提交申请</div>)
                  }
                }
              })()}
            </div>
            <TableList url="/order/finals.do" headTitArr={["记录ID","申请人", "审核人", "提交时间", "回复时间", "终审结果", "查看附件", "回复备注","终审金额(万元)"]} fetchData={{ order_id }} rendHtml={this.listRendHtml}></TableList>
          </div>
        </div>
      </div >


    );
  }
}

export default DetailFinal;