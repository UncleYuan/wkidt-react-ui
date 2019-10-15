
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


var formData = [ //添加所有接口表单数据
  {
    "name": "avatar",
    "label": "头像",
    "value": "",
    "type": "file-single",
    "count": 1
  },
  {
    "name": "username",
    "label": "用户名",
    "value": "",
    "readOnly": true,
    "type": "text"
  },
  {
    "name": "old_password",
    "label": "旧密码",
    "value": "",
    "type": "password"
  },
  {
    "name": "password",
    "label": "新密码",
    "value": "",
    "type": "password"
  },

  {
    "name": "email",
    "label": "邮箱",
    "value": "",
    "readOnly": true,
    "type": "text"
  },
  {
    "name": "remark",
    "label": "备注",
    "readOnly": true,
    "value": "",
    "type": "textarea"
  },
  /*{
    "name":"roles",
    "label":"所属角色",
    "readOnly":true,
    "search":true,
    "source":"/system/modal-select.do?model=user_role_relation&field=roles",
    "type":"select-tags-input",
    "value":[]
  },*/
  {
    "name": "phone",
    "label": "手机号码",
    "readOnly": true,
    "type": "text",
    "value": ""
  },
  {
    "name": "superior",
    "label": "所属上级",
    "source": "/user-easy.do",
    "readOnly": true,
    "type": "select-single",
    "search": true,
    "value": []
  },
  {
    "name": "agent_id",
    "label": "所属代理商",
    "readOnly": true,
    "source": "/agent/agenteasy.do",
    "type": "select-single",
    "search": true,
    "value": []
  }
]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      formData: tools.deepCopy(formData) //表单数据渲染
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

    this.eidtColumn();

  }
  eidtColumn = () => { //编辑数据
    fetch('/me.do', {
      method: 'get',
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formData);
        let newRole = []
        for (let i in data.data) {
          if (i == "superior" || i == "agent_id") {
            data.data[i] = [data.data[i]]
          }
          nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
        }

        this.setState({
          formData: nowData,
          loading: false
        })
        this.toggleModal(0);
      });
  }
  toggleModal = (i) => { //切换弹窗显示
    let { modalShow } = this.state;
    modalShow[i] = !modalShow[i]
    this.setState({ modalShow })
  }

  setEidtForm = (data) => { //保存表单

    let url = "/me.do";


    Process.show();
    fetch(url, {
      method: "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        avatar: data.avatar,
        old_password: data.old_password,
        password: data.password,

      })
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
                  {data.old_password && data.password ? <a href="javascript:;" onClick={() => { location.reload(); }} className="btn btn-info">重新登陆</a> : <a href="javascript:;" onClick={() => { location.hash = "/"; Modal.close(); }} className="btn btn-warn">回到主页</a>}
                </div>
              )
            }
          })
        }
      });
  }





  render() {
    let { loading } = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }
    return (
      <div>

        <div className="wrapper">
          <section className="white-bg p15">


            <div className="panel-body">

              <Form formStyle="ver" formRendData={this.state.formData} onSubForm={this.setEidtForm} />

            </div>
          </section>
        </div>
      </div>

    );
  }
}


module.exports = MainCont;