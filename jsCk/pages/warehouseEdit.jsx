
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

const typeTree = function (result, parent_id, idname, parentidname) {
  let arr = [];

  for (let i in result) {
    if (result[i][(parentidname ? parentidname : "pid")] == parent_id) {
      result[i].children = typeTree(result, result[i][(idname ? idname : "id")], idname, parentidname);
      arr.push(result[i]);
    }
  }

  return arr;

}

const turnSelect = (data) => {
  let newArr = [];
  newArr.push({ name: '顶级', value: 0 });
  for (let i in data) {
    newArr.push({ name: data[i].nameTurn, value: data[i].id });
  }
  return newArr;
}

const turnList = (data, l,namekey="name") => {

  l = parseInt(l);
  let arr = [];
  let txt = '';
  let addChild = '';
  for (let i = 0; i < l; i++) {
    if (i == 0) {
      txt += '├';
    }
    txt += '─';
  }

  for (let j in data) {
    data[j].nameTurn = txt + data[j][namekey];
    arr.push(data[j]);
    if (data[j].children && data[j].children.length > 0) {
      arr = arr.concat(turnList(data[j].children, l + 1,namekey));
    }
  }
  return arr;
}

const formData = [ //添加所有接口表单数据

  {
    "name": "name",
    "label": "仓库名称",
    "value": "",
    "type": "text"
  },
  {
    "name": "agent_id",
    "label": "所属代理商",
    "options":[],
    "value": [],
    "type": "select-single"
  },
  {
    "name": "master",
    "label": "负责人",
    "value": "",
    "type": "text"
  },
  {
    "name": "master_phone",
    "label": "负责人手机",
    "value": "",
    "type": "text"
  },
  {
    "name": "addr",
    "label": "地址",
    "value": "",
    "type": "text"
  }
]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      agentOptions:[],
      formData: tools.deepCopy(formData) //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId = "";
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    this.getAgentList();
    this.filterType(this.props.params);
  }
  filterType = (params) => {
    if (params.type == "edit" && params.id) {
      this.eidtColumn(params.id);
    } else {
      this.addColumn();
    }
  }
  getAgentList=()=>{
    fetch(`/agent.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let agentOptions=turnSelect(turnList(typeTree(data.data,'0','id','parent_id'), 1,'agent_name'));
        this.setState({agentOptions})
    })
  }
  eidtColumn = (id) => { //编辑数据

    fetch(`/property/warehouse/${id}.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formData);
        let newRole = [];
        let identification;
        for (let i in data.data) {
          if (i == "agent_id") {
             data.data[i] = [data.data[i]];
           }
          // if ("content,tags".indexOf(i) >= 0) {
          //   try {
          //     if (data.data[i].length > 0) {
          //       data.data[i] = JSON.parse(data.data[i])

          //     };
          //   } catch (error) {
          //     data.data[i] = [];
          //   }

          // } else if (i == "cat_id") {
          //   data.data[i] = [data.data[i]]
          //   catSelect = data.data[i]
          // }else if( i=='identification'){
          //   identification = data.data[i];
          // }

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

    let url = "/property/warehouse.do";

    if (this.formType == "add") {

      // url = "user.do";

    } else {
      url = `/property/warehouse/${this.eidtId}.do`;
    }
    Process.show();
    data.agent_id=data.agent_id.join(',');

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

  handleChange = (data) => {

    const {catData} = this.state;
    let name;
    for (let i in catData) {
      if (catData[i].value == data) {
        name = catData[i].name
      }
    }

    this.setState({
      isSingle: name == '单页' ? true : false
    });

  }



  render() {

    let {formData, loading,agentOptions} = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }
     formData[1].options = agentOptions;
    return (
      <div>

        <div className="wrapper">
          
          <section className="panel">

            <h4 className="fs20 pl15 pt15 ">车库详情</h4>
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