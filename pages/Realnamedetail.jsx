
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
        "label": "会员实名认证id",
        "value": "",
        "readOnly": true,
        "type": "text"
    },
    {
        "name": "uid",
        "label": "会员id",
        "value": "",
        "readOnly": true,
        "type": "text"
    },

    {
        "name": "id_card_positive",
        "label": "会员身份证正面",
        "readOnly": true,
        "value": "",
        "type": "file-single"
    },
    {
        "name": "id_card_reverse",
        "label": "会员身份证反面",
        "readOnly": true,
        "value": "",
        "type": "file-single"
    },
    {
        "name": "member_name",
        "label": "会员名称",
        "readOnly": true,
        "value": "",
        "type": "text"
    }


]

class MainCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //是否加载中， 保留，暂无作用
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

        this.filterType(this.props.params);
    }
    filterType = (params) => {
        if (params.id) {
            this.eidtColumn(params.id);
        } 
        // else {
        //     this.addColumn();
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

        fetch('/member/realname_details/' + id + '.do', {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                let nowData = tools.deepCopy(formData);
                let newRole = [];
                for (let i in data.data) {
                    /* if("content,tags".indexOf(i)>=0){
                       if(data.data[i].length>0)data.data[i]=JSON.parse(data.data[i]);
                     }else if(i=="cat_id"){
                       data.data[i]=[data.data[i]]
                     }*/
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
        let newFormData = tools.deepCopy(formData);
        newFormData[0] = {
            "name": "uid",
            "label": "商家绑定会员",
            "value": [],
            "selLen": 1,
            "source": "/system/modal-select.do?model=borrow_product_cheya&field=uid",
            "type": "select-tags-input"
        }
        this.setState({
            formData: newFormData
        })
    }
    setEidtForm = (data) => { //保存表单

        let url = "merchant.do";
        if (this.formType == "add") {
            data.uid = data.uid[0].value
        }

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
                                    <a href="javascript:;" onClick={() => { Modal.close(); } } className="btn btn-warn">{"继续" + (this.formType == "add" ? "添加" : "编辑")}</a>
                                    <a href="javascript:;" onClick={() => { location.hash = "/merchant.html"; Modal.close(); } } className="btn btn-info">回到列表</a>
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
        formData[1].options = catData;
        return (
            <div>

                <div className="wrapper">
                    <section className="panel">


                        <div className="panel-body">
                            <Form formStyle="ver" formRendData={formData} onSubForm={this.setEidtForm} disabled={true}>
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