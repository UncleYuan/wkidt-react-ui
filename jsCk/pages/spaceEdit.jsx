
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
    "name": "number",
    "label": "区域编号",
    "value": "",
    "type": "text"
  },
  {
    "name": "monitors",
    "label": "监控",
    "options":[],
    "value": [],
    "type": "select-single"
  }
]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      monitorzOptions:[],
      formData: tools.deepCopy(formData) //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId = "";
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    this.getMonitorzList()
    this.filterType(this.props.params);
  }
  filterType = (params) => {
    if (params.type == "edit" && params.id) {
      this.eidtColumn(params.id);
    } else {
      this.addColumn();
    }
  }
 getMonitorzList=()=>{
    fetch(`/property/monitorz/easy.do?warehouse_id=${this.props.params.warehouse_id}`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if(data.code=="SUCCESS"){
          this.setState({monitorzOptions:data.data})
        }
    })
  }
  eidtColumn = (id) => { //编辑数据

    fetch(`/property/space/${id}.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formData);
        for (let i in data.data) {
         
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
    this.setState({
      formData: tools.deepCopy(formData),
      loading: false
    })
  }
  setEidtForm = (data) => { //保存表单
    let url = "/property/space.do";
    if (this.formType == "add") {

    } else {
      url = `/property/space/${this.eidtId}.do`;
    }
    Process.show();
    data.warehouse_id=this.props.params.warehouse_id;
    data.monitors=data.monitors.join(',');

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
                  <a href="javascript:;" onClick={() => { location.hash = "/warehouselist"; Modal.close(); } } className="btn btn-info">回到列表</a>
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

    let {formData, loading,monitorzOptions} = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }
     formData[1].options = monitorzOptions;
    return (
      <div>

        <div className="wrapper">
          
          <section className="panel">

            <h4 className="fs20 pl15 pt15 ">区域详情</h4>
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