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

import { FileGroup } from '../../src/FileGroup';

const formProp = [ //添加所有接口表单数据
  {
    "name": "name",
    "label": "验车分类",
    "value": "",
    "type": "text",
  }
]

var formData = tools.deepCopy(formProp);
var turnSelect = function (data, l) {

  l = parseInt(l);
  var arr = [];
  var txt = '';
  var addChild = "";
  for (var x = 0; x < l; x++) {
    if (x == 0) {
      txt += '├';
    }
    txt += '─';
  }
  for (var i in data) {
    arr.push({ tit: txt + data[i].catname, val: data[i].catid });
    if (data[i].children && data[i].children.length > 0) {
      arr = arr.concat(turnSelect(data[i].children, l + 1));
    }
  }
  return arr;
}

const defaultProps = {
};

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      formData: formData, //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtRoleRoleId = null;
    this.firstOpen = true;
  }
  componentWillReceiveProps(nextProps) {


  }
  componentWillMount() {
    this.filterType(this.props.params);
  }
  filterType = (params) => {

    if (params.type == "add") {
      formData = tools.deepCopy(formProp);
      this.addColumn()
      this.setState({ loading: false })
    } else if (params.type == "edit" && params.id && params.name) {
      this.eidtColumn(params.id, params.name);
    } else {
      formData = tools.deepCopy(formProp);
      this.addColumn();
      this.setState({ loading: false })
    }
  }
  textChange = (name) => {
    let setState = {};
    setState[name] = event.target.value;
    this.setState(setState)
  }
  eidtColumn = (id, name) => { //编辑数据
    var _this = this;
    var nowData = tools.deepCopy(formData);
    for (var i in nowData) {
      if (nowData[i].name == "name") {
        nowData[i].value = name;
      }
    }
    nowData.push({
      "name": "id",
      "label": "id",
      "value": id,
      "type": "text",
      "readOnly": true
    })
    _this.formType = "eidt";
    _this.setState({
      formData: nowData,
      loading: false
    })
    _this.toggleModal(0);


  }
  toggleModal = (i) => { //切换弹窗显示
    var arr = this.state.modalShow;
    arr[i] = !arr[i]
    this.setState({ modalShow: arr })
  }
  addColumn = () => { //添加数据
    this.setState({
      formData: []
    })
    let nowData = tools.deepCopy(formData);

    for (var i in nowData) {
      if (nowData[i].type == "images") {
        nowData[i].defaultValue = []
      } else {
        nowData[i].defaultValue = ""
      }

    }
    this.formType = "add";
    setTimeout(function () {

      this.setState({
        formData: nowData
      })
    }.bind(this), 100)
    this.toggleModal(0);
  }
  setEidtForm = (data) => { //保存表单
    let _this = this;
    let url = "";

    if (_this.formType == "add") {

      url = "/property/inspection/category.do";

    } else {

      url = `/property/inspection/category/${this.props.params.id}.do`;
    }
    delete data.type;
    Process.show();
    fetch(url, {
      method: _this.formType == "add" ? "post" : "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(data)
    }).then(response => response.json())
      .then((data) => {
        Process.Close();

        if (data.code != "SUCCESS") {
          alert(data.info)
        } else {
          Modal.show({
            child: <div className="fs20">恭喜您{_this.formType == "add" ? "添加" : "编辑"}成功</div>,
            conf: {
              footer: (
                <div>
                  <a href="javascript:;" onClick={() => { Modal.close(); }} className="btn btn-info">{"继续" + (_this.formType == "add" ? "添加" : "编辑")}</a>
                  <a href="#/order/inspection.html" onClick={() => { Modal.close(); }} className="btn btn-info">回到列表</a>
                </div>
              )
            }

          })

          if (_this.formType == "add") {
            _this.addColumn();
          }
        }
      });

  }

  render() {
    let {loading, formData} = this.state;
    let {params} = this.props;
    if (loading) {
      return (<Loading></Loading>)
    }
    return (
      <div>

        <div className="wrapper">
          <section className="panel p15">

            <h3 className="fs15 pb15">
              {params.type == "add" ? "添加" : "编辑"}内容
            </h3>
            <div className="panel-body">
              <Form formStyle="ver" formRendData={formData} onSubForm={this.setEidtForm} />
            </div>

          </section>
        </div>
      </div>

    );
  }
}

MainCont.defaultProps = defaultProps;
module.exports = MainCont;