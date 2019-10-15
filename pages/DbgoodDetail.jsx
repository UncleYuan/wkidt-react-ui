
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
        "name": "name",
        "label": "夺宝商品名称",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "max_periods",
        "label": "商品最大周期",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "phone",
        "label": "中奖人号码",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "c_renshu",
        "label": "参与人数",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "z_renshu",
        "label": "总人数",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "price",
        "label": "商品价格",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "s_renshu",
        "label": "剩余人数",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "cur_periods",
        "label": "当前周期",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "zj_number",
        "label": "中奖号码",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "announcetime",
        "label": "揭晓时间",
        "value": "",
        "type": "text",
        "readOnly": "true"
    },
    {
        "name": "open_status",
        "label": "是否开奖",
        "value": "",
        "type": "text",
        "readOnly":"true"
    },



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
        // if (params.type == "edit" && params.id) {
        this.eidtColumn(params.id);
        // } else {
        // this.addColumn();
        // }
    }
    filterCatData = (data) => {
        let newData = [];
        data.forEach((obj, idx) => {
            newData.push({ name: obj.name, value: obj.id })
        })
        return newData;
    }




    eidtColumn = (id) => { //编辑数据
        fetch(`oneyuan/goods/dbinfo/${id}.do`, {
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

        // if (this.formType == "add") {

        //   url = "/mishuo.do";

        // } else {
        //   url = `/mishuo/${this.props.params.id}.do`;
        // }
        data.content = JSON.stringify(data.content);
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
  
        let arr = formData.slice(0, 10);
        
        return (
            <div>

                <div className="wrapper">
                    <section className="panel">

                        <div className="panel-header pb10">
                            <div className="btn-info btn " onClick={()=>{location.hash="/oneyuan/dbgoods.html"}}>返回列表</div>
                        </div>
                        <div className="panel-body">
                           <Form 
                                formStyle="ver" 
                                className="m" 
                                formRendData={formData} 
                                onSubForm={this.setEidtForm} >
                                <FormSub className="none"></FormSub>
                            </Form>
                           {/* <div className="ml40">
                                {arr.map((obj, idx) => {
                                    return (
                                        <div key={idx} className="pt20 row">
                                            <div className="col-md-1 col-sm-2 fb">{obj.label}</div>
                                            <div className="pl10 col-md-3">{obj.value}</div>
                                        </div>
                                    )
                                })}


                                <div className="pt20 row">
                                    <div className="col-md-1 col-sm-2 fb">是否开奖:</div>
                                    <div className="pl10 col-md-3"> {formData[10].value==0?"否":"是"}</div>
                                </div>
                            </div>*/}

                        </div>
                    </section>
                </div>
            </div>

        );
    }
}


module.exports = MainCont;