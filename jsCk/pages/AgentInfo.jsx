
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
import SelectTagsInput from '../../src/SelectTagsInput';
import TimeSelectInput from '../../src/TimeSelectInput';
import InputGroup from '../../src/InputGroup';
const formData = [
  {
    "name": "agent_name",
    "label": "代理商名称",
    "value": "",
    "type": "text"
  },
  {
    "name": "level",
    "label": "代理商级别",
    "value": "",
    "search": false,
    "options": [
     // { name: "总代", value: "0" },
      { name: "省公司", value: "1" },
    //  { name: "市代", value: "2" },
      { name: "门店", value: "3" },
    ],
    "type": "select-single"
  },
  {
    "name": "master_name",
    "label": "负责人",
    "value": "",
    "type": "text"
  },
  {
    "name": "phone",
    "label": "负责人手机号",
    "value": "",
    "type": "text"
  },
  {
    "name": "company_addr",
    "label": "地址",
    "value": "",
    "type": "text"
  },
  
  {
    "name": "parent_id",
    "label": "所属代理商",
    "search": true,
    "options": [],
    "source":"/agent/agenteasy.do",
    "type": "select-single",
    "value": []
  },
  {
    "name": "join_date",
    "label": "加入时间",
    "value": "",
    "format": "y-m-d",
    "type": "time-select-input"
  },
  {
    "name": "deposit",
    "label": "保证金",
    "value": "",

    "barHtml": <span className="btn gary-bg">万元</span>,
    "type": "input-group"
  }
]

class AgentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      formData: tools.deepCopy(formData), //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId = "";
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    this.filterType(this.props.params);
 
  }
  filterType = (params) => {
    if (params.type == "edit" && params.id) {
      this.eidtColumn(params.id);
    } else {
      this.addColumn();
    }
  }
 
  eidtColumn = (id) => { //编辑数据
    fetch(`/agent/${id}.do`, {
      method: 'get',
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formData);
        let newRole = []
        for (let i in data.data) {
          if (i == "parent_id") {
            nowData[5].value = data.data[i].split(',');
          } else if (i == "level") {
            nowData[1].value = [data.data[i]];
          } else {
            nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
          }
        }
        this.eidtId = id;
        this.formType = "eidt";
        this.setState({
          formData: nowData
        })
        this.toggleModal(0);
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
      formData: tools.deepCopy(formData)
    })
  }
  setEidtForm = (data) => { //保存表单
    let url = "";
    if (this.formType == "add") {
      url = "agent.do";
    } else {
      url = "/agent/" + this.eidtId + ".do";
    }
    data.level = data.level.join('');
    data.parent_id = data.parent_id.join('');
    Process.show();
    fetch(url, {
      method: this.formType == "add" ? "post" : "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam(data)
    }).then(response => response.json())
      .then((data) => {
        Process.Close();
        Toast.show({ msg: data.info });
        if (data.code != "SUCCESS") {
          this.setState({
            formData: this.state.formData
          })
        } else {
          Modal.show({
            child: <div className="fs20">恭喜您{this.formType == "add" ? "添加" : "编辑"}成功</div>,
            conf: {
              footer: (
                <div>
                  <a href="javascript:;" onClick={() => { Modal.close(); }} className="btn btn-warn">{"继续" + (this.formType == "add" ? "添加" : "编辑")}</a>
                  <a href="javascript:;" onClick={() => { location.hash = "/agent/list.html"; Modal.close(); }} className="btn btn-info">回到列表</a>
                </div>
              )
            }
          })

          if (this.formType == "add") {
            this.addColumn();
          }
        }
      });
  }

  render() {
    let {formData} = this.state;

    return (
      <div className="wrapper">
        <section className="white-bg p15">
          <div className="panel-body ">
            <div className="fs20 pb15">编辑代理商</div>
            <div className="row pb30 pt15">
              <div className="col-md-6 col-sm-8">
                <Form formStyle="horiz" formRendData={formData} onSubForm={this.setEidtForm} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}


module.exports = AgentInfo;