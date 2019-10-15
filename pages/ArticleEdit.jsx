
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
import FileGroup from '../src/FileGroup';
import SelectTagsInput from '../src/SelectTagsInput';
import Tags from '../src/Tags';
import SetMobileCont from '../src/SetMobileCont';
const formData = [ //添加所有接口表单数据
  {
    "name": "title",
    "label": "标题",
    "value": "",
    "type": "text"
  },
  {
    "name": "thumb",
    "label": "封面图片",
    "value": [],
    "type": "file-single"
  },
  {
    "name": "keywords",
    "label": "关键字",
    "value": "",
    "type": "text"
  },
  // {
  //   "name": "cat_id",
  //   "label": "栏目列表",
  //   "value": "",
  //   "options": [],
  //   "type": "select-single",
  //   "search": "true"
  // },
  {
    "name": "tags",
    "label": "标签",
    "value": "",
    "type": "text"
  },
  {
    "name": "description",
    "label": "内容描述",
    "value": "",
    "type": "text"
  },
  {
    "name": "content",
    "label": "内容详情",
    "value": [],
    "type": "set-mobile-cont"
  },

  {
    "name": "author",
    "label": "作者",
    "value": "",
    "type": "text"
  },
  {
    "name": "url",
    "label": "链接",
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
      catData: [],
      formData: tools.deepCopy(formData) //表单数据渲染
    };
    this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
    this.eidtId = "";
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    this.getCateData();
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
    fetch('/content/content/content_cat.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        if (res.code == "SUCCESS") {
          let newData = this.filterCatData(res.data);
          // newData.unshift({ name: '根目录', value: 0 })
          this.setState({ loading: false, catData: newData });
        } else if (res.code == "NO_DATA") {
          this.setState({ loading: false, catData: [] });
        }
      });
  }
  eidtColumn = (id) => { //编辑数据
    fetch('/content/cotent_details.do?' + tools.parseParam({ id: id }), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let nowData = tools.deepCopy(formData);
        let newRole = [];
        let catSelect;
        let identification;
        for (let i in data.data) {

          if ("content,tags".indexOf(i) >= 0) {
            try {
              if (data.data[i].length > 0) {
                data.data[i] = JSON.parse(data.data[i])

              };
            } catch (error) {
              data.data[i] = [];
            }

          } else if (i == "cat_id") {
            data.data[i] = [data.data[i]]
            catSelect = data.data[i]
          }else if( i=='identification'){
            identification = data.data[i];
          }

          nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
        }

        this.eidtId = id;
        this.formType = "eidt";
        this.setState({
          formData: nowData,
          catSelect:catSelect,
          identification:identification
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
      formData: tools.deepCopy(formData)
    })
  }
  setEidtForm = (data) => { //保存表单

    let url = "/content/content_add.do";

    if (this.formType == "add") {

      // url = "user.do";

    } else {
      // url = `/ads/ads_audit/${this.props.params.id}.do`;

      data.id = this.props.params.id;
    }
    data.cat_id = data.cat_id[0];
    data.content = JSON.stringify(data.content);

    Process.show();

    fetch(url, {
      // method: this.formType == "add" ? "post" : "put",
      method: "post",
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
                  <a href="javascript:;" onClick={() => { Modal.close(); } } className="btn btn-warn">{"继续" + (this.formType == "add" ? "添加" : "编辑")}</a>
                  <a href="javascript:;" onClick={() => { location.hash = "/content/article_list.html"; Modal.close(); } } className="btn btn-info">回到列表</a>
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
    let name ;
    for(let i in catData){
      if(catData[i].value == data){
        name = catData[i].name
      }
    }
    
      this.setState({
        isSingle:name == '单页'?true:false
      });
   
  }



  render() {

    let {formData, catData, loading,isSingle,catSelect} = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }
    // formData[3].options = catData;
    return (
      <div>

        <div className="wrapper">
          <section className="panel">


            <div className="panel-body">
              <Form formStyle="ver" formRendData={formData} onSubForm={this.setEidtForm} >
                <FormCtrl name="cat_id" label="栏目列表" type="select-single" search={true} value={catSelect} options={catData} itemChange={this.handleChange} />
                {isSingle?<FormCtrl name="identification" label="标识" type="text" value={this.state.identification} />:""}
              </Form>
            </div>
          </section>
        </div>
      </div>

    );
  }
}


module.exports = MainCont;