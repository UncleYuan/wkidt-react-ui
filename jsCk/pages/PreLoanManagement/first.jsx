import React, { Component, creatElement } from 'react';

import Select from '../../../src/Select';
import Loading from '../../../src/Loading';
import Form from '../../../src/Form';
import FormCtrl from '../../../src/FormCtrl';
import FormSub from '../../../src/FormSub';
import Input from '../../../src/Input';
import InputGroup from '../../../src/InputGroup';
import CheckRadio from '../../../src/CheckRadio';
import Modal from '../../../src/Modal';
import FileSingle from '../../../src/FileSingle';
import FileGroup from '../../../src/FileGroup';
import Cascader from '../../../src/Cascader';
import TimeSelector from '../../../src/TimeSelector';
import TimeSelectInput from '../../../src/TimeSelectInput';
import SetMobileCont from '../../../src/SetMobileCont';
import Panel from '../../comp/Panel';
import Tags from '../../../src/Tags';
import tools from '../../../tools/public_tools';
import form_tools from '../../../tools/form_tools';
import ZcdetailsFiles from './../zcDetails_files';
import Process from '../../../src/Process';
import Toast from '../../../src/Toast';
import FirstCarMore from './firstCarMore';
const carToken = "4d6a9d15e1030e8d39efd548c16226ec";

const filterCar = function (listName, keyName, valueName) {
    return function (res) {
        let nowData = [];
        if (res.status == 1 && res[listName]) {
            for (let i = 0; i < res[listName].length; i++) {
                res[listName][i].name = res[listName][i][keyName];
                res[listName][i].value = res[listName][i][valueName];
                nowData.push(res[listName][i]);
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
        "name": "regDate",
        "label": "车辆上牌日期",
        "value": "",
        "format": "y-m",
        "type": "time-select-input"
    },
    {
        "name": "mile",
        "label": "公里数",
        "value": "",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>万公里</div>
    },
    {
        "name": "zone",
        "label": "上牌城市",
        "value": "",
        "search": true,
        "type": "select-single",
        "options": []
    },
    {
        "name": "color",
        "label": "车辆颜色",
        "value": "",
        "search": true,
        "type": "select-single",
        "options": [
            { name: "米色", value: "米色" },
            { name: "棕色", value: "棕色" },
            { name: "金色", value: "金色" },
            { name: "紫色", value: "紫色" },
            { name: "巧克力色", value: "巧克力色" },
            { name: "黑色", value: "黑色" },
            { name: "蓝色", value: "蓝色" },
            { name: "灰色", value: "灰色" },
            { name: "绿色", value: "绿色" },
            { name: "红色", value: "红色" },
            { name: "橙色", value: "橙色" },
            { name: "白色", value: "白色" },
            { name: "香槟色", value: "香槟色" },
            { name: "银色", value: "银色" },
            { name: "黄色", value: "黄色" }
        ]
    },
    {
        "name": "interior",
        "label": "内饰状况",
        "value": "",
        "search": true,
        "type": "select-single",
        "value":["优"],
        "options": [
            { name: "优", value: "优" },
            { name: "良", value: "良" },
            { name: "中", value: "中" },
            { name: "差", value: "差" }
        ]
    },
    {
        "name": "surface",
        "label": "漆面状况",
        "value": "",
        "search": true,
        "type": "select-single",
        "value":["优"],
        "options": [
            { name: "优", value: "优" },
            { name: "良", value: "良" },
            { name: "中", value: "中" },
            { name: "差", value: "差" }
        ]
    },
    {
        "name": "work_state",
        "label": "工况状况",
        "value": "",
        "search": true,
        "type": "select-single",
        "value":["优"],
        "options": [
            { name: "优", value: "优" },
            { name: "良", value: "良" },
            { name: "中", value: "中" },
            { name: "差", value: "差" }
        ]
    },
    {
        "name": "transfer_times",
        "label": "过户次数",
        "value": "",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>次</div>
    }, {
        "name": "car_type",
        "label": "车辆类型",
        "value": [1],
        "inline": true,
        "type": "radio",
        "options": [
            { name: "全款车", value: 1 },
            { name: "按揭车", value: 0 }
        ]
    }
]
const goFormData = [
    {
        "name": "customer_name",
        "label": "客户姓名",
        "value": "",
        "type": "text"
    },
    {
        "name": "customer_sex",
        "label": "性别",
        "value": "",
        "inline": true,
        "type": "radio",
        "options": [
            { name: "男", value: 1 },
            { name: "女", value: 2 }
        ]
    },
    {
        "name": "customer_contact",
        "label": "客户联系方式",
        "value": "",
        "type": "text"
    },
    {
        "name": "borrow_amount",
        "label": "意向借款金额",
        "value": "",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>万元</div>
    }
]
const formTypeOptions = [
    { name: "vin码查询", value: 0 },
    { name: "输入信息查询", value: 1 }
]
const formTypeProp = {
    "name": "search_type",
    "label": "查询方式",
    "inline": true,
    "type": "radio",
    "options": [
        { name: "使用VIN码（车架号）查询", value: 1 },
        { name: "手动查询", value: 2 }
    ]
}
const modelSelectProp = {
    "name": "modelId",
    "label": "车辆型号",
    "config": carConfig,
    "type": "cascader"
}
class First extends Component {
    constructor(props) {
        super(props);
        this.state = {
            closeSider: false,
            formData: tools.deepCopy(formData),
            modalShow: [false, false],
            price: false,
            modelSelectOtions: [],
            searchType: [1],
            loading: true,
            formShow: true,
            system:{},
            vinValue: "",
            goFormDataType: 1,
            modelSelectValue: [],
            seleclModelData: null,
            selectModelInfoData: null,
            car_type: 1,

            goFormData: tools.deepCopy(goFormData),
            currenComp: ""
        }
        this.preData = {};
    }

    componentWillMount() {
        this.getCity();
        this.getSystem();
    }
    componentWillReceiveProps(nextProps) {

    }
    getSystem=()=>{
         fetch(`/system/config.do`, {
            method: "get",
            credentials: 'same-origin',
       
        }).then(response => response.json())
            .then((res) => {
                if(res.code=="SUCCESS"){
                    this.setState({system:res.data})
                }
            });
    }
    getCity = () => {
        tools.getJSONP(`https://api.che300.com/service/getAllCity?token=${carToken}`, (res) => {
            const newFilter = filterCar('city_list', 'city_name', 'city_id');
            this.cityOptions = newFilter(res);
            let newData = tools.deepCopy(formData);
            newData[2].options = this.cityOptions;
            this.setState({ formData: newData, loading: false })
        })
    }
    toggleModal = (i) => { //切换弹窗显示
        let arr = this.state.modalShow;
        arr[i] = !arr[i]
        this.setState({ modalShow: arr })
    }
    vinGetInfo = (data) => {

        tools.getJSONP(`https://api.che300.com/service/jsmc/getUsedCarPriceAnalysis?` + tools.parseParam(data), (res) => {

        })
    }

    getInfo = (data) => {
        let {selectModelData} = this.state;
        if (!selectModelData) {
            Toast.show({ msg: "请选择车型" })
            return;
        }
        this.preData = tools.deepCopy(data);

        for (let i in data) {
            if ("zone,color,interior,surface,work_state".indexOf(i) >= 0) {
                data[i] = data[i][0];
            } else if ("modelId".indexOf(i) >= 0) {
                data[i] = data[i][2];
            }
        }
        data.token = carToken;
        data.modelId = selectModelData.value;
        this.preData.modelId = selectModelData.value;
        this.preData.brand_id = selectModelData.brand_id;
        this.preData.series_id = selectModelData.series_id;
        this.preData.makeDate = selectModelData.min_reg_year + "-1";
        tools.getJSONP(`https://api.che300.com/service/jsmc/getUsedCarPriceAnalysis?` + tools.parseParam(data), (res) => {

            if (res.status == 1) {
                Toast.show({ msg: "查询成功" })
                this.setState({ price: res.eval_prices })
            } else {
                Toast.show({ msg: res.error_msg })
            }
        })
    }
    setEidtForm = (data) => {
        this.setState({ car_type: data.car_type.join(',') })
        this.getInfo(data);
    }
    goForm = (data) => {
        Process.show();
        fetch(`/property/order.do`, {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam({
                customer_name: data.customer_name,
                customer_sex: data.customer_sex.join(','),
                customer_phone: data.customer_phone,
                brand_id: this.preData.brand_id,
                series_id: this.preData.series_id,
                model_id: this.preData.modelId,
                city_id: this.preData.zone[0],
                reg_time: this.preData.regDate,
                is_full: this.preData.car_type.join(''),

                mileage: this.preData.mile,
                //salesman_phone: data.salesman_phone[0],
                borrow_amount: data.borrow_amount,
                production_date: this.preData.makeDate,
                color: this.preData.color[0],
                interior_level: this.preData.interior[0],
                paint_level: this.preData.surface[0],
                working_level: this.preData.work_state[0],
                transfer_count: this.preData.transfer_times[0]
            })
        }).then(response => response.json())
            .then((res) => {
                Process.Close();
                Toast.show({ msg: res.info });
                this.toggleModal(0);
                if (res.code == "SUCCESS") {
                    Modal.show({
                        child: <div className="fs14 ">{res.info}</div>,
                        conf: {
                            title: "系统提示",
                            footer: (
                                <a href="javascript:;" onClick={() => { Modal.close(); location.href = "#/zc.html/" + res.data + "/whthin/" + (new Date()).valueOf(); }} className="btn btn-info">确定</a>
                            )
                        }
                    })
                }
            });
    }

    formTypeChange = (data) => {
        if (data[0] != 2) {
            this.setState({ selectModelInfoData: null, seleclModelData: null })
        }
        if (data[0] != 1) {
            this.setState({ modelSelectValue: [], vinValue: "", selectModelInfoData: null, seleclModelData: null })
        }
        this.setState({ searchType: data });
    }
    stateChange = (setData) => {
        this.setState(setData);
    }
    searchModel = (data) => {
        let {vinValue} = this.state;
        Process.show();
        tools.getJSONP(`https://api.che300.com/service/identifyModelByVIN?vin=${vinValue}&token=${carToken}`, (data) => {
            Process.Close();
            let optionsArr = [];
            if (data.status == 1) {
                for (let i in data.modelInfo) {
                    data.modelInfo[i].name = data.modelInfo[i].model_name;
                    data.modelInfo[i].value = data.modelInfo[i].model_id;
                    optionsArr.push(data.modelInfo[i])
                }
                this.setState({ modelSelectOtions: optionsArr, modelSelectValue: [optionsArr[0].value] });
                this.selectModelInfo([optionsArr[0].value], true);
            }

        })

    }
    selectModelInfo = (val, type = false) => {
        if (!val[0]) return;
        Process.show();
        let {modelSelectOtions, formData} = this.state;
        let filter = tools.filterObjVal(modelSelectOtions, val[0], "value");
        tools.getJSONP(`https://api.che300.com/service/getModelParameters?modelId=${val.join('')}&token=${carToken}`, (data) => {
            Process.Close();
            if (data.status == 1) {
                let setData = { selectModelInfoData: data.paramters };
                if (type) {
                    setData.selectModelData = filter.data;
                    formData[0].startYear = filter.data.min_reg_year ;
                    formData[0].value = filter.data.min_reg_year  + "-" + 12;
                    formData[0].endYear = parseInt(filter.data.max_reg_year);
                    this.setState({ selectModelData: data[0], formData })
                }

                this.setState(setData)
            }

        })

    }
    filterDataRow = (val, data) => {
        let {formData} = this.state;
        for (let i in data) {

            if (data[i].value == val[2]) {
                data[i].brand_id = val[0];
                data[i].series_id = val[1];
                formData[0].startYear = data[i].min_reg_year;
                formData[0].value = data[i].min_reg_year  + "-" + 12;
                formData[0].endYear = parseInt(data[i].max_reg_year);
                this.setState({ selectModelData: data[i], formData })
            }
        }
    }
    modelSelectChange = (val, dataAll) => {
        if (val[2] && val[2] != this.state.modelSelectValue[0]) {
            this.filterDataRow(val, dataAll[2]);
            this.setState({ modelSelectValue: [val[2]] });
            this.selectModelInfo([val[2]]);
        }
    }
    sureSearchInfo = () => {
        let {modelSelectValue} = this.state;
        if (modelSelectValue.lenght > 0) {
            this.selectModelInfo(modelSelectValue[0]);
        } else {
            Toast.show({ msg: "请先确认车型" })
        }

    }
    render() {
        const {formData, vinValue, selectModelData, selectModelInfoData, modelSelectOtions, modelSelectValue, loading, searchType, currenComp, infoData, modalShow, fileArr, goFormDataType, goFormData, formShow, price, car_type} = this.state;
        let {params,userInfo} = this.props;
        if (loading) {
            return (
                <Loading />
            )
        }
        if(userInfo.permissions.indexOf('0101')<0){
            return (<div className="p50 fs16 warn-color tc"><i className="iconfont icon-cuowu block fs40" ></i>您尚未有提交订单的的权限</div>)
        }
        return (
            <div >
                <Modal title="生成订单" show={modalShow[0]} onClose={() => { this.toggleModal(0); }} >
                    {modalShow[0] ? <Form formStyle="ver" formRendData={goFormData} onSubForm={this.goForm} /> : ""}
                </Modal>
                <div className="row">
                    <div className="col-md-6">
                        <Panel title="1.查询汽车信息" type="default" noWrap={true}>
                            <div className="p15">
                                <FormCtrl {...formTypeProp} value={searchType} itemChange={this.formTypeChange} ></FormCtrl>
                                <div className=" " style={{ display: searchType.join('') == 1 ? "block" : "none" }} >
                                    <FormCtrl label="VIN码（车架号）" type="input-group" itemChange={(val) => { this.stateChange({ vinValue: val }); }} value={vinValue} barHtml={<div onClick={() => { this.searchModel(); }} className='btn btn-info'>确定</div>} ></FormCtrl>
                                    <FormCtrl label="车型名称" type="select-single" options={modelSelectOtions} value={modelSelectValue} itemChange={this.selectModelInfo}></FormCtrl>

                                </div>
                                <div className=" " style={{ display: searchType.join('') == 2 ? "block" : "none" }}>
                                    {searchType.join('') == 2 ? <Cascader {...modelSelectProp} onValueChange={this.modelSelectChange}  > </Cascader> : ""}

                                </div>
                                {selectModelInfoData ? <FirstCarMore carData={selectModelInfoData} baseInfo={selectModelData}></FirstCarMore> : ""}
                            </div>
                        </Panel>
                    </div>
                    <div className="col-md-6">
                        <Panel title="2.提交汽车信息" type="default" noWrap={true}>
                            <div className="p15 ">

                                <Form formStyle="ver" onSubForm={this.setEidtForm} >
                                    {formData.map((obj, idx) => {
                                        return (<FormCtrl key={idx} {...obj}></FormCtrl>)
                                    })}
                                </Form>

                            </div>
                        </Panel>
                        <div className="mt15">
                            <Panel title="3.评估结果" type="default" noWrap={true}>
                                <div className="p20">
                                    {(() => {
                                        if (!price) {
                                            return (<div className="tc">
                                                <i className="iconfont fs65 warn-color icon-che"></i>
                                                <div className="fs18 desalt-color">请填写您要检验的的车辆信息并提交</div>
                                            </div>)
                                        } else {
                                            return (
                                                <div className="tc row">
                                                    <div className="col-md-12 pb15">
                                                        <i className="iconfont fs65 warn-color icon-quanbushouchexiansuo"></i>

                                                        <div className="fs18 desalt-color">初评价格: <span className="fs24 warn-color">{car_type == 1 ? (price.c2b_price * Number(system.car300_full_discount)).toFixed(2) : (price.c2b_price *  Number(system.car300_part_discount)).toFixed(2)}</span> 万</div>
                                                    </div>

                                                    <div className="col-md-12 pt15 pb10">
                                                        <a href="javascript:;" onClick={() => { this.toggleModal(0); }} className="btn btn-warn col-md-6 col-md-push-3">生成订单</a>
                                                    </div>
                                                </div>)
                                        }
                                    })()}

                                </div>
                            </Panel>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}




export default First;
