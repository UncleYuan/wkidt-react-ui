
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

const turnList = (data, l) => {

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
    data[j].nameTurn = txt + data[j].name;
    arr.push(data[j]);
    if (data[j].children && data[j].children.length > 0) {
      arr = arr.concat(turnList(data[j].children, l + 1));
    }
  }
  return arr;
}

const options = [
  { name: '进店有米', value: 'jindian' },
  { name: '探客', value: 'explorer' }
]

const formDataPro = [ //添加所有接口表单数据
  {
    "name": "pid",
    "label": "父级分类",
    "value": "",
    "options": [],
    "type": "select-single"
  },

  {
    "name": "name",
    "label": "分类名",
    "value": "",
    "type": "text"
  },

  {
    "name": "description",
    "label": "描述",
    "value": "",
    "type": "textarea"
  },
  {
    "name": "icon",
    "label": "图标",
    "value": "",
    "type": "text"
  },


]

class MainCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      formData: tools.deepCopy(formDataPro), //表单数据渲染
      module: 'jindian'
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId = "";
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    this.filterType(this.props.params);
    this.getModule();
    // this.getParentid();

  }

  componentDidMount() {

  }


  getModule = () => { //更新表单数据
    let {page, len, searchTxt} = this.state;

    let postData;
    postData = { page: 1, len: 200, pid: 0 }

    fetch('/content/category/module.do?' + tools.parseParam(postData), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          let ModuleData = [];
          for (let i in data.data) {
            ModuleData.push({ name: data.data[i].module, value: data.data[i].module })
          }
          this.setState({
            ModuleData: ModuleData,
          })

        } else if (data.code == "NO_DATA") {
          this.setState({
            ModuleData: [],
            loading: false
          })
        }

      });
  }
  filterType = (params) => {
    if (params.type == "edit" && params.id) {
      this.eidtColumn(params.id);

    } else {
      this.addColumn();
      // this.getParentid();
    }
  }
  filterCatData = (data) => {
    let newData = [];
    data.forEach((obj, idx) => {
      newData.push({ name: obj.name, value: obj.id })
    })
    return newData;
  }

  getParentid = () => { //更新表单数据
    let {page, len, searchTxt} = this.state;
    const {formData} = this.state;
    let postData = { module: this.state.module };


    fetch('/content/category.do?' + tools.parseParam(postData), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          let formData = tools.deepCopy(formDataPro)
          let arr = [];
          let parent;
          // let rendData = 
          // for (let k = 0; k < data.data.length; k++) {
          //   arr.push({ name: data.data[k].name, value: data.data[k].id });

          // }
          // arr.unshift({ name: '顶级', value: 0 })
          
          arr = turnSelect(turnList(typeTree(data.data, "0", "id", "pid"), 1));
          for (let i in formData) {
            if (formData[i].type == 'select-single') {
              formData[i].options = arr;
            }
          }

          this.setState({
            parentId: data.data,
            formData: formData,
            rendData: turnList(typeTree(data.data, "0", "id", "pid"), 1),

          })

        } else if (data.code == "NO_DATA") {
          this.setState({

            loading: false
          })
        }

      });

  }

  eidtColumn = (id) => { //编辑数据
    fetch('/content/category.do' + id + '.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formDataPro);
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
      formData: tools.deepCopy(formDataPro)
    })
  }
  setEidtForm = (data) => { //保存表单

    let url = "";


    if (this.formType == "add") {

      url = "content/category.do";

    } else {
      url = `content/category.do`;
    }

    Process.show();

    fetch(url, {
      method: this.formType == "add" ? "post" : "put",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tools.parseParam({
        pid: data.pid[0],
        name: data.name,
        description: data.description,
        icon: data.icon,
        module: this.state.module
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
                  <a href="javascript:;" onClick={() => { Modal.close(); } } className="btn btn-warn">{"继续" + (this.formType == "add" ? "添加" : "编辑")}</a>
                  <a href="javascript:;" onClick={() => { location.hash = "/content/category.html"; Modal.close(); } } className="btn btn-info">回到列表</a>
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
    this.setState({
      module: data instanceof Array ? data[0] : data
    }, () => {
      this.getParentid();
    });
  }
  handleCheck = (data) => {
    this.setState({
      check: data[0],
      formData: tools.deepCopy(formDataPro)
    });
  }


  render() {

    let {formData, catData, loading, arr, check} = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }




    return (
      <div>

        <div className="wrapper">
          <section className="panel">
            <div className="panel-body">
              <FormCtrl label="选择" type="radio" inline={true} checkradioStyle="btn" defaultValue={[0]} options={[{ name: '添加模块', value: 0 }, { name: '选择模块', value: 1 }]} itemChange={this.handleCheck} />
              <Form formStyle="ver" className="m" formRendData={formData} onSubForm={this.setEidtForm} >
                {check == 1 ?
                  <FormCtrl label="模块" type="select-single" options={this.state.ModuleData} itemChange={this.handleChange} /> :
                  <FormCtrl label="模块" type="text" itemChange={this.handleChange} />}
              </Form>
            </div>
          </section>
        </div>
      </div>

    );
  }
}


module.exports = MainCont;