
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';
import Modal from '../src/Modal';
import Pager from '../src/Pager';
import Form from '../src/Form';
import Loading from '../src/Loading';
import Toast from '../src/Toast';
import Process from '../src/Process';
import tools from '../tools/public_tools';
import form_tools from '../tools/form_tools';

import FormCtrl from '../src/FormCtrl';
import Input from '../src/Input';
import Alert from '../src/Alert';
import { CheckRadio } from '../src/CheckRadio';
import Select from '../src/Select';
import FileSingle from '../src/FileSingle';
import SelectTagsInput from '../src/SelectTagsInput';
import Tags from '../src/Tags';
import SetMobileCont from '../src/SetMobileCont';
import FormSub from '../src/FormSub';
const formData = [ //添加所有接口表单数据
  {
    "name": "id",
    "label": "记录ID",
    "value": "",
    "type": "text",
    "readOnly":true
  },
  {
    "name": "uid",
    "label": "申请者ID",
    "value": '',
    "type": "text",
    "readOnly":true
  },
  {
    "name": "nickname",
    "label": "申请者名字",
    "value": '',
    "type": "text",
    "readOnly":true
  },
  {
    "name": "add_time",
    "label": "添加时间",
    "value": '',
    "type": "text",
    "readOnly":true
  },
  {
    "name": "by_time",
    "label": "管理员处理时间",
    "value": '',
    "type": "text",
    "readOnly":true
  },
  {
    "name": "status",
    "label": "审核状态",
    "value": '',
    "type": "text",
    "readOnly":true
  },
  {
    "name": "name",
    "label": "商家名字",
    "value": '',
    "type": "text",
    "readOnly":true
  },
  {
    "name": "avatar",
    "label": "商家头像",
    "value": "",
    "type": "file-single",
    "readOnly":true
  },

  {
    "name": "is_update",
    "label": "是否更新",
    "type": "text",
    "value": "",
    "readOnly":true
  },

  {
    "name": "phone",
    "label": "手机号",
    "type": "text",
    "value": "",
    "readOnly":true
  }

]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      catData: [],
      formData: tools.deepCopy(formData) //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId = "";
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    // this.getCateData();
    this.filterType(this.props.params);
  }
  filterType = (params) => {
    if (params.type == "edit" && params.id) {
      this.eidtColumn(params.id);
    } else {
      this.addColumn();
    }
  }
  filterCatData = (data) => {
    let newData = [];
    data.forEach((obj, idx) => {
      newData.push({ name: obj.name, value: obj.id })
    })
    return newData;
  }



  getCateData = () => {
    fetch('/content/category.do?len=50&module=explorer', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        if (res.code == "SUCCESS") {
          let newData = this.filterCatData(res.data);
          this.setState({ loading: false, catData: newData });
        } else if (res.code == "NO_DATA") {
          this.setState({ loading: false, catData: [] });
        }
      });
  }
  eidtColumn = (id) => { //编辑数据
    fetch('merchant/app/info/' + id + '.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formData);
        let newRole = [];
        for (let i in data.data) {
          if ("content,tags".indexOf(i) >= 0) {
            if (data.data[i].length > 0) data.data[i] = JSON.parse(data.data[i]);
          } else if (i == "cat_id") {
            data.data[i] = [data.data[i]]
          }
          nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
        }
        this.eidtId = id;
        this.formType = "eidt";
        this.setState({
          formData: nowData,
          personloglist: data.data,
          loading: false
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

      url = "user.do";

    } else {
      url = "/explorer.do";
      data.id = this.props.params.id;
    }

    Process.show();

    fetch(url, {
      method: this.formType == "add" ? "post" : "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify(data)
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
                  <a href="javascript:;" onClick={() => { Modal.close(); } } className="btn btn-warn">{"继续" + (this.formType == "add" ? "添加" : "编辑")}</a>
                  <a href="javascript:;" onClick={() => { location.hash = "/tank/list.html"; Modal.close(); } } className="btn btn-info">回到列表</a>
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

    let {formData, catData, loading, personloglist} = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }
    formData[1].options = catData;
    return (
      <div>

        <div className="wrapper">
          <section className="panel">

            <h1 className="fs22">商家申请记录详情</h1>
            <div className="panel-body">

              <Form formStyle="ver" formRendData={formData} readOnly={true} >
                <FormSub className="none"></FormSub>
              </Form>

            </div>
          </section>
        </div>
      </div>

    );
  }
}


module.exports = MainCont;