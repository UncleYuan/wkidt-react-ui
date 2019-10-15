
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
        "type": "text"
    },
    {
        "name": "password",
        "label": "初始密码",
        "value": "",
        "type": "password"
    },
    {
        "name": "email",
        "label": "邮箱",
        "value": "",
        "type": "text"
    },
    {
        "name": "remark",
        "label": "备注",
        "value": "",
        "type": "textarea"
    },
    {
        "name": "roles",
        "label": "所属角色",
        "search": true,
        "source": "/system/modal-select.do?model=user_role_relation&field=roles",
        "type": "select-tags-input",
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
        if (params.type == "edit" && params.id) {
            this.eidtColumn(params.id);
        } else {
            this.addColumn();
        }
    }
    eidtColumn = (id) => { //编辑数据
        fetch('/content/category_access.do?' + tools.parseParam({ role_id: id }), {
            method: 'get',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                // let nowData = tools.deepCopy(formData);
                // let newRole = []
                // for (let i in data.data) {
                //     nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
                // }
                let newArr = [];
                let htmlArr = [];
                let res = data.data;

                for (let i in res) {
                    newArr = [{
                        "name": "是",
                        "value": 1
                    }, {
                        "name": "否",
                        "value": 0
                    }]

                    htmlArr.push(<FormCtrl type="radio" key={i} checkradioStyle="btn" inline={true} value={[res[i].is_access]} options={newArr} label={res[i].name + ".是否开放权限"} name={res[i].id} itemChange={(val) => { this.turnPermi(val, res[i].id) } } />)

                }
                this.eidtId = id;
                this.formType = "eidt";
                this.setState({
                    // formData: nowData,
                    htmlData: htmlArr,
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

    turnPermi = (val, name) => {
        /*    if(this.firstOpen) return;*/
        
         let type =  val[0] == 0?'DELETE':'POST';
       
        fetch('/content/category_access.do', {
            method: type,
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam({
                cat_id: name,
                role_id: this.props.params.id
            })
        }).then(response => response.json())
            .then((data) => {
            });

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
            url = "/user/" + this.eidtId + ".do";
        }
        delete data.type;
        data.roles = form_tools.arrToStringValue(data.roles, function (o) {
            return `${o.value}`;
        })
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
                                    <a href="javascript:;" onClick={() => { location.hash = "/user/list.html"; Modal.close(); } } className="btn btn-info">回到列表</a>
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
        return (
            <div>
                <div className="wrapper">
                    <section className="panel">
                       <a href="javascript:;" className="btn btn-info mb20" onClick={()=>{history.go(-1);}}>返回列表</a>
                        <div className="panel-body">

                            {/*<Form formStyle="ver" formRendData={this.state.formData} onSubForm={this.setEidtForm} />*/}
                            {this.state.htmlData}
                        </div>
                    </section>
                </div>
            </div>

        );
    }
}


module.exports = MainCont;