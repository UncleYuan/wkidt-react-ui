
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
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import Select from '../../src/Select';
import FileSingle from '../../src/FileSingle';
import FileGroup from '../../src/FileGroup';
import Tags from '../../src/Tags';
import SetMobileCont from '../../src/SetMobileCont';

 

const formData = [ //添加所有接口表单数据
  {
    "name": "play_url",
    "label": "流畅播放地址",
    "value": "",
    "type": "text",
  },
  {
    "name": "play_url_hd",
    "label": "高清播放地址",
    "value": "",
    "type": "text",
  },
  {
    "name": "warehouse_id",
    "label": "仓库id",
    "type":"select-single",
    "value":[]
  },
  {
    "name": "location",
    "label": "安装位置",
    "value": "",
    "type": "text",
  },
   {
    "name": "sn",
    "label": "设备串号",
    "value": "",
    "type": "text",
  },
   {
    "name": "remark",
    "label": "备注",
    "value": "",
    "type": "textarea",
  }
]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      warehouseOptions:[],
      formData: tools.deepCopy(formData) //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId = "";
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    this.getWarehouseList()
    this.filterType(this.props.params);
  }
  filterType = (params) => {
    if (params.type == "edit" && params.id) {
      this.eidtColumn(params.id);
    } else {
      this.addColumn();
    }
  }
 getWarehouseList=()=>{
    fetch(`/property/warehouseeasy.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if(data.code=="SUCCESS"){
          this.setState({warehouseOptions:data.data})
        }
    })
  }
  eidtColumn = (id) => { //编辑数据
    fetch(`/property/monitor/${id}.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formData);
        for (let i in data.data) {
          if("warehouse_id".indexOf(i)>=0){
            data.data[i]=[data.data[i]]
          }
          nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
        }

        this.eidtId = id;
        this.formType = "eidt";
        this.setState({
          formData: nowData,
          loading: false
        })

      });

  }
  toggleModal = (i) => { //切换弹窗显示
    let {modalShow} = this.state;
    modalShow[i] = !modalShow[i]
    this.setState({ modalShow })
  }
  addColumn = () => { //添加数据
    this.formType = "add";
    this.eidtId = "";
    let fData= tools.deepCopy(formData);
    fData[2].value=[this.props.params.warehouse_id];
    this.setState({
      formData:fData,
      loading: false
    })
  }
  setEidtForm = (data) => { //保存表单
    let url = "/property/monitor.do";
    if (this.formType == "add") {

    } else {
      url = `/property/monitor/${this.eidtId}.do`;
    }
    Process.show();
    data.warehouse_id=data.warehouse_id.join(',');

    fetch(url, {
      method: this.formType == "add" ? "post" : "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(data)
    }).then(response => response.json())
      .then((res) => {
        Process.Close();
        Toast.show({ msg: res.info });
        if (res.code != "SUCCESS") {
          this.setState({
            formData: this.state.formData
          })
        } else {
          Modal.show({
            child: <div className="fs20">恭喜您{this.formType == "add" ? "添加" : "编辑"}成功</div>,
            conf: {
              footer: (
                <div>
                  <a href="javascript:;" onClick={() => { Modal.close(); } } className="btn btn-warn">{"继续" + (this.formType == "add" ? "添加" : "编辑")}</a>
                  <a href="javascript:;" onClick={() => { location.hash = "/videolist/"+this.props.params.warehouse_id; Modal.close(); } } className="btn btn-info">回到列表</a>
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

    let {formData, loading,warehouseOptions} = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }
     formData[2].options = warehouseOptions;
    return (
      <div>

        <div className="wrapper">
          
          <section className="panel">

            <h4 className="fs20 pl15 pt15 ">{this.props.params.type=="add"?"添加":"编辑"}监控</h4>
            <div className="panel-body pt10 pb15">
              <div className="clearfix p5">
                <div className="col-md-6 ">
                  <Form formStyle="ver" formRendData={formData} onSubForm={this.setEidtForm} >

                  </Form>
                </div>
              </div>


            </div>
          </section>
        </div>
      </div>

    );
  }
}

export default MainCont;