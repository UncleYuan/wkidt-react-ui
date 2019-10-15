
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
import { ImgUploadGroup } from '../../src/ImgUploadGroup';
import { FileGroup } from '../../src/ImgUploadGroup';


const FormDataPro =  //审核探客
  [

    {
      "name": "remarks",
      "label": "备注",
      "value": "",
      "type": "textarea"
    },
    {
      "name": "attachment",
      "label": "附件",
      "title": "附件",
      "value": [],
      "type": "img-upload-group"
    }
  ]



const defaultProps = {
};
class DetailInterrupt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      rendData: [], //记录列表数据

      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      len: 30, //分页长度
      logList: [],
      deferInfo: [], //资产逾期信息
    };
    this.openContId = ""
  }
  componentWillReceiveProps(nextProps) {


  }


  componentWillMount() {

  }

  componentDidMount() {
    this.upData();
    this.getDeferCont();
  }
  textChange = (name, val) => {
    let setState = {};
    setState[name] = val;
    this.setState(setState);
    if (name == "len") {
      clearTimeout(this.timer);
      let page = this.state.page;
      page.page_index = 1;
      this.setState({
        page: page
      })
      this.timer = setTimeout(() => {
        this.upData();
      }, 500)
    }
  }
  upData = (callback) => { //更新表单数据
    let { page, len } = this.state;
    let { proper_id } = this.props;
    fetch('/property/interrupt.do?' + tools.parseParam({ property_id: proper_id, page: page.page_index, len }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            rendData: data.data,
            page: data.page
          })
          if (callback) callback();
        } else if (data.code == "NO_DATA") {
          this.setState({
            rendData: [],
            page: {
              page_count: 0,
              page_index: 1,
              record_count: 0
            }
          })
        }
        if (callback) callback();
      });

  }
  getDeferCont = () => {
    fetch(`/property/defer-info.do?property_id=${this.props.proper_id}`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          this.setState({
            deferInfo: data.data
          })
        } else if (data.code == "NO_DATA") {
          this.setState({
            deferInfo: []
          })
        }

      });
  }
  setInterrupt = (subData) => {
    let { proper_id } = this.props;
    subData.attachment=JSON.stringify(subData.attachment);
    fetch(`/property/interrupt.do`, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(Object.assign({ property_id: proper_id }, subData))
    }).then(response => response.json())
      .then((data) => {
        Toast.show({ msg: data.info });
        if (data.code == "SUCCESS") {
          tools.sendUpdataUser();
          location.hash = "#/dzzc.html/" + proper_id + "/interrupt/" + (new Date()).valueOf();
            
        }
      });
  }
  toggleModal = (i) => { //切换弹窗显示
    let arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }


  onSetSelIdx = (idx) => { //选择分页回调
    let page = this.state.page;
    page.page_index = idx;
    this.setState({
      page: page
    });
    this.upData();
  }


  render() {
    let { rendData, loading, formData, modalShow, page, len, deferInfo } = this.state;
    let { proper_id, orderInfo } = this.props;
    let isGoSub = orderInfo.permissions.indexOf('0401') >= 0;
    return (
      <div>

        <div className="wrapper">
          <section className="pt15 pl15 pr15 white-bg">
            <div className="pb20 ubb1 fuzzy-border mb20">
              <div >
                <div className=" pt15">
                  <h4 className="fs20 desalt-color">资产逾期信息</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive ">
                  <table className="table mt20 table-striped ">

                    <tbody>
                      <tr className="table-head-tr">
                        <td>期数</td>
                        <td>客户利息</td>
                        <td>融资利息</td>
                        <td>状态</td>
                        <td>逾期天数</td>
                        <td>罚息</td>

                      </tr>
                      {(() => {
                        if (deferInfo.length > 0) {
                          return deferInfo.map((obj, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{obj.nper}</td>
                                <td>{obj.received}</td>
                                <td>{obj.interest}</td>
                                <td>{obj.status_name}</td>
                                <td>{obj.overdue_day}</td>
                                <td>{obj.overdue_interest}</td>
                              </tr>
                            )
                          })
                        } else {
                          return (
                            <tr >
                              <td className="tc" colSpan="6">暂无数据</td>
                            </tr>
                          )
                        }
                      })()}


                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Modal title="断档登记" show={modalShow[0]} onClose={() => { this.toggleModal(0) }}>
              {modalShow[0] ? <Form formStyle="ver" formRendData={FormDataPro} onSubForm={this.setInterrupt} /> : ""}
            </Modal>
            <div className="pb10 pt15">
              <div >
                <div className="clearfix">
                  <div className="fr ">
                    {(() => {
                      if (isGoSub) {
                        return (<a className=" btn btn-info " href="javascript:;" onClick={() => { this.toggleModal(0) }} >断档登记</a>)
                      } else {
                        return (<a className=" btn btn-default disabled" href="javascript">断档登记</a>)
                      }
                    })()}

                  </div>

                  <h4 className="fs20 desalt-color">断档操作</h4>
                </div>
              </div>
              <div>
                <div className="table-responsive ">
                  <table className="table mt20 table-striped ">

                    <tbody>
                      <tr className="table-head-tr">
                        <td>时间</td>
                        <td>申请人</td>
                        <td>审核人</td>
                        <td>附件</td>
                        <td>备注</td>
                        <td>状态</td>
                        {/*<td>操作</td>*/}
                      </tr>
                      {(() => {
                        if (rendData.length > 0) {
                          return rendData.map((obj, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{obj.update_time}</td>
                                <td>{obj.apply_name}</td>
                                <td>{obj.user_name}</td>
                              
                                <td>
                                  <ImgUploadGroup width={100} height={60} readOnly={true} value={obj.attachment}></ImgUploadGroup>
                                </td>
                                <td>
                                  {obj.remark}
                                </td>
                                <td>{obj.status_name}</td>
                                {/*<td><a href={"#/dzzc.html/" + proper_id + "/interruptitem/test/" + obj.id} className="btn btn-info">查看记录</a></td>*/}

                              </tr>
                            )
                          })
                        } else {
                          return (
                            <tr >
                              <td className="tc" colSpan="6">暂无数据</td>
                            </tr>
                          )
                        }
                      })()}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    );
  }
}

export default DetailInterrupt;