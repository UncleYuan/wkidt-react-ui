
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
        "label": "进店有米id",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    // {
    //     "name": "cat_id",
    //     "label": "菜单",
    //     "value": "",
    //     "type": "text",
    //     "readOnly": "true"
    // },
    // {
    //     "name": "uid",
    //     "label": "用户",
    //     "value": "",
    //     "type": "text",
    //     "readOnly": "true"
    // },
    {
        "name": "title",
        "label": "标题",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "thumb",
        "label": "缩略图",
        "value": "",
        "type": "file-single",
        "readOnly": "true"
    },
    {
        "name": "keywords",
        "label": "关键词",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "jindian_name",
        "label": "进店有米分类的名称",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "tags",
        "label": "标签",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "description",
        "label": "内容描述",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "author",
        "label": "作者",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    // {
    //     "name": "status",
    //     "label": "状态",
    //     "value": "",
    //     "type": "text",
    //     "readOnly": "true"
    // },
    {
        "name": "add_time",
        "label": "添加时间",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "update_time",
        "label": "更新时间",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "member_name",
        "label": "会员名称",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "jindian_status",
        "label": "审核状态",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "content",
        "label": "文章内容",
        "value": "",
        "type": "set-mobile-cont",
        "readOnly": "true"
    },
    // {
    //     "name": "lat",
    //     "label": "纬度",
    //     "value": "",
    //     "type": "text",
    //     "readOnly": "true"
    // },
    // {
    //     "name": "lng",
    //     "label": "经度",
    //     "value": "",
    //     "type": "text",
    //     "readOnly": "true"
    // },
    // {
    //     "name": "address",
    //     "label": "地址",
    //     "value": "",
    //     "type": "textarea",
    //     "readOnly": "true"
    // },


]

class MainCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //是否加载中， 保留，暂无作用
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




    eidtColumn = (id) => { //编辑数据

        fetch('/jindian/jindian_details/' + this.props.params.id + '.do', {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                let nowData = tools.deepCopy(formData);
                let newRole = [];
                for (let i in data.data) {
                    if ("content".indexOf(i) >= 0) {
                      if (data.data[i].length > 0) data.data[i] = JSON.parse(data.data[i]);
                    } else if (i == "cat_id") {
                      data.data[i] = [data.data[i]]
                    } else if(i=='lat,lng'.indexOf(i)>=0){
                        try {
                            if(data.data[i] == null){
                                data.data[i] = '';
                            }
                        } catch (error) {
                             data.data[i] = '';
                        }
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
            formData: tools.deepCopy(formData)
        })
    }
    setEidtForm = (data) => { //保存表单

        let url = "";
        url = "/ads/ads_first_Add.do";
        // data.content = JSON.stringify(data.content);
        if (this.formType == "add") {

            // url = "/mishuo.do";

        } else {
            // url = `/mishuo/${this.props.params.id}.do`;
            data.id = this.props.params.id;
        }


        Process.show();

        fetch(url, {
            method: this.formType == "add" ? "post" : "post",
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
                                    <a href="javascript:;" onClick={() => { location.hash = "/ads/ads_first.html"; Modal.close(); } } className="btn btn-info">回到列表</a>
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

        let {formData, catData, loading} = this.state;
        if (loading) {
            return (<Loading></Loading>)
        }
        // formData[1].options = catData;
        return (
            <div>

                <div className="wrapper">
                    <section className="panel">
                        <div className="panel-header pb10">
                            <a href="javascript:;" onClick={()=>{history.go(-1)}} className="btn btn-info fs13">返回列表</a>
                        </div>

                        <div className="panel-body">
                            <Form formStyle="ver" className="m" formRendData={formData} onSubForm={this.setEidtForm} >
                                 <FormSub className="none"></FormSub>
                            </Form>
                            
                            {/* <div className="ml40">
                                {formData.map((obj, idx) => {
                                    let html;
                                    if(obj.name=="thumb"){
                                        html =   <img className="pl10 col-md-4" src={obj.value} />
                                    }else{
                                        html =  <div className="pl10 col-md-4">{obj.value}</div>
                                    }
                                    return (
                                        <div key={idx} className="pt20 row ubb1 fuzzy-border">
                                            <div className="col-md-2 col-sm-3 fb">{obj.label}</div>
                                           {html}
                                        </div>
                                    )
                                })}


                               
                            </div>*/}
                        </div>
                    </section>
                </div>
            </div>

        );
    }
}


module.exports = MainCont;