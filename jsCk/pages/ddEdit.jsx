import React, { Component } from 'react';

import Select from '../../src/Select';
import Loading from '../../src/Loading';
import Form from '../../src/Form';
import FormCtrl from '../../src/FormCtrl';
import FormSub from '../../src/FormSub';
import Input from '../../src/Input';
import InputGroup from '../../src/InputGroup';
import CheckRadio from '../../src/CheckRadio';
import Modal from '../../src/Modal';
import FileSingle from '../../src/FileSingle';
import FileGroup from '../../src/FileGroup';
import Cascader from '../../src/Cascader';
import TimeSelector from '../../src/TimeSelector';
import TimeSelectInput from '../../src/TimeSelectInput';
import SetMobileCont from '../../src/SetMobileCont';
import Panel from '../comp/Panel';
import Tags from '../../src/Tags';
import Toast from '../../src/Toast';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';

let options = [
    { name: "全款车", value: "1" },
    { name: "按揭车", value:"0" }
];
let options1 = [
    { name: "男", value: "1" },
    { name: "女", value: "2" }
];

const carToken = "4d6a9d15e1030e8d39efd548c16226ec";

const filterCar = function (listName, keyName, valueName) {
    return function (res) {
        let nowData = [];
        if (res.status == 1 && res[listName]) {
            for (let i = 0; i < res[listName].length; i++) {
                nowData.push({ name: res[listName][i][keyName], value: res[listName][i][valueName] });
            }
        }
        return nowData;
    }
}
let carConfig = [
    {
        name: "Brand",
        url: `https://api.che300.com/service/getCarBrandList?token=${carToken}`,
        keyName: '',
        type: "jsonp",
        filter: filterCar('brand_list', 'brand_name', 'brand_id')
    },

    {
        name: "Series",
        url: `https://api.che300.com/service/getCarSeriesList?token=${carToken}`,
        keyName: 'brandId',
        type: "jsonp",
        filter: filterCar('series_list', 'series_name', 'series_id')
    },
    {
        name: "Model",
        url: `https://api.che300.com/service/getCarModelList?token=${carToken}`,
        keyName: 'seriesId',
        type: "jsonp",
        filter: filterCar('model_list', 'model_name', 'model_id')
    }
]



const formData = [
    {
        "name": "customer_name",
        "label": "姓名",
        "value": "",
        "type": "text",
        "required": true
    },
    {
        "name": "customer_sex",
        "label": "性别",
        "value": [""],
        "inline": true,
        "options": options1,
        "type": "radio",
        "required": true
    },
    {
        "name": "customer_id_card",
        "label": "身份证",
        "value": "",
        "type": "text",
        "required": true
    },
    {
        "name": "customer_phone",
        "label": "联系电话",
        "value": "",
        "type": "text",
        "required": true
    },
    {
        "name": "borrow_amount",
        "label": "借款金额",
        "value": "",
        "type": "text",
        "required": true
    },
    {
        "name": "borrow_limit",
        "label": "借款周期",
        "value": "",
        "type": "text",
        "required": true
    },
    {
        "name": "borrow_interest",
        "label": "借款利率",
        "value": "",
        "type": "text",
        "required": true
    },
    {
        "name": "model_name",
        "label": "车辆型号",
        "value": "",
        "type":"text",
        "required": true
    },
    {
        "name": "city_id",
        "label": "上牌城市",
        "value": "",
        "search": true,
        "type": "select-single",
        "options": [],
        "required": true
    },
    {
        "name": "reg_time",
        "label": "上牌时间",
        "value": '',
        "format": "y-m",
        "type": "time-select-input",
        "required": true
    },
    {
        "name": "license",
        "label": "行驶证号",
        "value": "",
        "type": "text",
        "required": true
    },

    {
        "name": "original_price",
        "label": "裸车原价",
        "value": "",
        "type": "input-group",
        "required": true,
        "barHtml": <div className='btn gray-bg'>万</div>
    },
    {
        "name": "mileage",
        "label": "公里数",
        "value": '',
        "type": "input-group",
        "required": true,
        "barHtml": <div className='btn gray-bg'>万公里</div>
    },

    {
        "name": "level",
        "label": "车况评级 ",
        "value": [""],
        "inline": true,
        "options": [{ name: '较低', value: 'low' }, { name: '一般', value: 'good' }, { name: '极好', value: 'high' }],
        "type": "select-single",
        "required": true
    },
    {
        "name": "is_full",
        "label": "是否全款车",
        "value": [""],
        "inline": true,
        "options": options,
        "type": "radio",
        "required": true
    },
    {
        "name": "loan_amount",
        "label": "贷款金额",
        "value": "",
        "type": "input-group",
        "required": true,
        "barHtml": <div className='btn gray-bg'>万</div>
    },
    {
        "name": "repayed_amount",
        "label": "已还金额",
        "value": "",
        "type": "input-group",
        "required": true,
        "barHtml": <div className='btn gray-bg'>万</div>
    },
    {
        "name": "monthly",
        "label": "月供金额",
        "value": "",
        "type": "input-group",
        "required": true,
        "barHtml": <div className='btn gray-bg'>万</div>
    },
]

let fileArr = [
    {
        isLabel: false,
        title: "正左左45度照片",
        type: "file-single",
        name: "front_left",
        required: true,

    },
    {
        isLabel: false,
        title: "正面照片",
        type: "file-single",
        name: "front",
        required: true,
    },
    {
        isLabel: false,
        title: "正面右45度照片",
        type: "file-single",
        name: "front_right",
        required: true,
    },
    {
        isLabel: false,
        title: "后左45度照片",
        type: "file-single",
        name: "behind_left",
        required: true,
    },
    {
        isLabel: false,
        title: "后面照片",
        type: "file-single",
        name: "behind",
        required: true,
    },
    {
        isLabel: false,
        title: "后左45度",
        type: "file-single",
        name: "behind_right",
        required: true,
    },
    {
        isLabel: false,
        title: "中控照片",
        type: "file-single",
        name: "central",
        required: true
    },
    {
        isLabel: false,
        title: "内饰照片",
        type: "file-single",
        name: "interior",
        required: true,
    },
    {
        isLabel: false,
        title: "行驶证照片",
        type: "file-single",
        name: "license_img",
        required: true,
    }
]

class CpDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: [],
            loading: true,
            fileArr:[]
        }
        this.cityOptions = [];
    }
    componentWillMount() {

        this.getCity();
        this.upData();
    }
    upData = () => {
        fetch(`/property/order/${this.props.params.id}.do`, {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                let nowData = tools.deepCopy(formData);
                let nowArr = tools.deepCopy(fileArr);
                let newRole = [];
                for (let i in data.data) {
                    // if ("content,tags".indexOf(i) >= 0) {
                    //     if (data.data[i].length > 0) data.data[i] = JSON.parse(data.data[i]);
                    // } else if (i == "cat_id") {
                    //     data.data[i] = [data.data[i]]
                    // }
                    if('customer_sex,city_id,is_full'.indexOf(i) >= 0){
                        data.data[i] = [data.data[i]]
                    }
                    nowData = form_tools.setArrObjVal(nowData, i, data.data[i])
                    nowArr = form_tools.setArrObjVal(nowArr, i, data.data[i])
                }
                // this.eidtId = id;
                this.formType = "eidt";
                this.setState({
                    formData: nowData,
                    fileArr:nowArr
                })
                // this.toggleModal(0);
            });
    }
    getCity = () => {
        tools.getJSONP(`https://api.che300.com/service/getAllCity?token=${carToken}`, (res) => {
            const newFilter = filterCar('city_list', 'city_name', 'city_id');
            this.cityOptions = newFilter(res);

            let newData = tools.deepCopy(formData);

            for (let i in newData) {
                if(newData[i].name == 'city_id') {
                    newData[i].options = this.cityOptions

                }
            }
            this.setState({ loading: false, formData: newData })
        })
    }
    setEidtForm = (data) => {

        data.customer_sex = data.customer_sex[0];
        data.model_id = this.props.params.model_id;
        data.brand_id = this.props.params.brand_id;
        data.series_id = this.props.params.series_id;
        data.city_id = this.props.params.city_id;
        data.level = data.level[0];
        data.is_full = data.is_full[0]
        fetch(' /property/order.do', {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam(data),
        }).then(response => response.json())
            .then((data) => {
                Toast.show({ msg: data.info });
                if (data.code == "SUCCESS") {
                    this.setState({
                        // rendData: data.data,
                        // page: data.page,
                        // selArr: [],
                        // loading: false
                    })
                    location.hash = '/ddlist.html'
                    // if (callback) callback();
                } else if (data.code == "NO_DATA") {
                    this.setState({
                        // rendData: [],
                        // selArr: [],
                        // page: {
                        //     page_count: 0,
                        //     page_index: 1,
                        //     record_count: 0
                        // },
                        // loading: false
                    })
                }
                // if (callback) callback();
            });
    }

    render() {
        const {formData, loading,fileArr} = this.state;

        if (loading) {
            return (
                <Loading />
            )
        }
        return (
            <div className="">
                <a className="btn btn-info fs fs12 mb15" href="javascript:;" onClick={() => { history.go(-1) } }>返回</a>
                <Panel title='车辆基本资料' type="default">
                    <div className="p20">




                        <Form formStyle="horiz" onSubForm={this.setEidtForm} >
                            <div className="row mt10 pb20">
                                <div className=" col-md-6 mb30">
                                    {formData.map((obj, idx) => {
                                        return (<FormCtrl key={idx} {...obj} />)
                                    })}
                                </div>
                                <div className=" col-md-6 tc">
                                    <div className="row">
                                        {fileArr.map((obj, idx) => {
                                            return (
                                                <div key={idx} className="col-md-4 col-xs-4 mb15" >
                                                    <FormCtrl  {...obj} />
                                                </div>
                                            )
                                        })}


                                    </div>
                                </div>
                            </div>

                            <FormSub className="full"></FormSub>


                        </Form>



                    </div>


                </Panel>


            </div>

        )
    }

}

export default CpDetails;