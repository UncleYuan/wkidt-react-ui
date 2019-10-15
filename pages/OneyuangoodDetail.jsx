
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
        "name": "cid",
        "label": "分类",
        "value": "",
        "type": "select-single"
    },
    {
        "name": "max_periods",
        "label": "周期",
        "value": "",
        "type": "text"
    },
    {
        "name": "name",
        "label": "商品名",
        "value": "",
        "type": "text"
    },
    {
        "name": "oprice",
        "label": "商品价格",
        "value": "",
        "type": "text"
    },
    {
        "name": "price",
        "label": "单次价格",
        "value": "",
        "type": "text"
    },
    {
        "name": "description",
        "label": "描述",
        "value": "",
        "type": "text"
    },
    {
        "name": "album",
        "label": "商品图片",
        "value": "",
        "type": "file-group"
    },
    {
        "name": "indexpic",
        "label": "商品缩略图",
        "value": "",
        "type": "file-single"
    },

    {
        "name": "content",
        "label": "商品图文",
        "value": [],
        "type": "set-mobile-cont"
    },


    {
        "name": "merchant_id",
        "label": "选择商家",
        "value": [],
        "type": "select-single",
        "search": true
    },


]

class MainCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //是否加载中， 保留，暂无作用
            modalShow: [false, false], //是否显示编辑表单弹窗
            newData: [],
            formData: tools.deepCopy(formData) //表单数据渲染
        };
        this.formType = "add"; //表单当前类型，添加（add）还是编辑（edit）
        this.eidtId = "";
    }
    componentWillReceiveProps(nextProps) {

    }
    componentWillMount() {
        this.getCateData();
        this.getMerchantList();
    }

    getMerchantList = () => {

        fetch('merchant/apprecord.do?' + tools.parseParam({ status: 1, page: 1, len: 1000 }), {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((res) => {

                if (res.code == "SUCCESS") {
                    let newData = [];
                    for (let i in res.data) {
                        newData[i] = { name: res.data[i].nickname, value: res.data[i].uid }
                    }
                    // let newData = this.filterCatData(res.data);

                    this.setState({ loading: false, MerchantList: newData });
                } else if (res.code == "NO_DATA") {
                    this.setState({ loading: false, MerchantList: [] });
                }
            });
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
        fetch('oneyuan/category.do', {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((res) => {
                if (res.code == "SUCCESS") {

                    let newData = this.filterCatData(res.data);

                    this.setState({ loading: false, catData: newData }, () => { this.filterType(this.props.params); });
                } else if (res.code == "NO_DATA") {
                    this.setState({ loading: false, catData: [] }, () => { this.filterType(this.props.params); });
                }
            });
    }



    eidtColumn = (id) => { //编辑数据
        fetch(`oneyuan/goods/${this.props.params.id}.do`, {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                const {catData} = this.state;
                let nowData = tools.deepCopy(formData);
                let newRole = [];
                let merchant_id;
                for (let i in data.data) {
                    if ("content".indexOf(i) >= 0) {

                        try {
                            if (data.data[i].length > 0) data.data[i] = JSON.parse(data.data[i]);
                        } catch (error) {
                            data.data[i] = [];
                        }

                    } else if (i == "cid") {
                        data.data[i] = [data.data[i]]
                    } else if (i == 'uid') {
                        merchant_id = [data.data[i]]
                    } else if (i == "album") {
                        let newData = data.data[i].split(',');
                        let thumbArr = [];
                        for (let x in newData) {
                            thumbArr.push({ name: `${x}.jpg`, src: newData[x] })
                        }
                        data.data[i] = thumbArr;
                    }
                    nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
                }

                nowData[0].options = catData;
                nowData[nowData.length - 1].value = merchant_id;
                // for(let j in nowData){
                //     if(nowData[j].name == 'merchant_id'){
                //         nowData[j].options = this.state.MerchantList;
                //     }
                // }

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
        let nowData = tools.deepCopy(formData);
        nowData[0].options = this.state.catData;
        this.setState({
            formData: nowData
        })
    }
    setEidtForm = (data) => { //保存表单

        let url = "";
        url = "oneyuan/goods.do";

        // if (this.formType == "add") {

        //   url = "/mishuo.do";

        // } else {
        //   url = `/mishuo/${this.props.params.id}.do`;
        // }
        if (this.formType !== "add") {
            data.id = this.props.params.id;
        }
        data.content = JSON.stringify(data.content);
        data.cid = data.cid[0];
        data.merchant_id = data.merchant_id[0];
        let newThumb = [];

        for (let i in data.album) {
            newThumb.push(data.album[i].src);
        }
        data.album = newThumb.join(',');
        
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
                                    <a href="javascript:;" onClick={() => { location.hash = "/oneyuan/goods.html"; Modal.close(); } } className="btn btn-info">回到列表</a>
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

        let {formData, catData, loading, MerchantList} = this.state;
        if (loading) {
            return (<Loading></Loading>)
        }
        formData[1].options = catData;
        formData[formData.length - 1].options = MerchantList;

        return (
            <div>

                <div className="wrapper">
                    <section className="panel">


                        <div className="panel-body">
                            <Form formStyle="ver" className="m" formRendData={formData} onSubForm={this.setEidtForm} />
                        </div>
                    </section>
                </div>
            </div>

        );
    }
}


module.exports = MainCont;

