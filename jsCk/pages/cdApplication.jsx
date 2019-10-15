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
import Toast from '../../src/Toast';
import SetMobileCont from '../../src/SetMobileCont';
import Panel from '../comp/Panel';
import Tags from '../../src/Tags';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';

let options = [
    { name: "全款车", value: 1 },
    { name: "按揭车", value: 2 }
];
let options1 = [
    { name: "男", value: 1 },
    { name: "女", value: 2 }
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
    // {
    //     "name": "uid",
    //     "label": "客户姓名",
    //     "value": "",
    //     "type": "text"
    // },
    // {
    //     "name": "uid",
    //     "label": "性别",
    //     "value": [""],
    //     "inline": true,
    //     "options": options1,
    //     "type": "radio"
    // },
    // {
    //     "name": "uid",
    //     "label": "联系电话",
    //     "value": "",
    //     "type": "text"
    // },
    // {
    //     "name": "uid",
    //     "label": "借款金额",
    //     "value": "",
    //     "type": "text"
    // },
    // {
    //     "name": "uid",
    //     "label": "借款周期",
    //     "value": "",
    //     "type": "text"
    // },
    {
        "name": "model_id",
        "label": "车辆型号",
        "value":"",
        "config": carConfig,
        "type": "cascader"
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
        "name": "time",
        "label": "上牌时间",
        "value": "",
        "format": "y-m",
        "type": "time-select-input"
    },
    // {
    //     "name": "uid",
    //     "label": "裸车价",
    //     "value": "",
    //     "type": "input-group",
    //     "barHtml": <div className='btn gray-bg'>万</div>
    // },
    {
        "name": "mile",
        "label": "公里数",
        "value": "",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>万公里</div>
    },
    // {
    //     "name": "uid",
    //     "label": "是否全款车",
    //     "value": [""],
    //     "inline": true,
    //     "options": options,
    //     "type": "radio"
    // },
    // {
    //     "name": "uid",
    //     "label": "贷款金额",
    //     "value": "",
    //     "type": "input-group",
    //     "barHtml": <div className='btn gray-bg'>万</div>
    // },
    // {
    //     "name": "uid",
    //     "label": "已还金额",
    //     "value": "",
    //     "type": "input-group",
    //     "barHtml":<div className='btn gray-bg'>万</div>
    // },
    // {
    //     "name": "uid",
    //     "label": "月供金额",
    //     "value": "aa",
    //     "type": "input-group",
    //     "barHtml": <div className='btn gray-bg'>万</div>
    // },
]

let fileArr = [
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_1_1"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_1_2"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_1_3"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_2_1"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_2_2"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_2_3"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_3_1"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_3_2"
    },
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        name: "l_3_3"
    }
]

class CpDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: [],
            loading: true,
            showModal: [false],
            carResault: 0,
            carPrice: {},
            showResult: false
        }
        this.cityOptions = [];
    }
    componentWillMount() {
        this.getCity();
    }
    getCity = () => {
        tools.getJSONP(`https://api.che300.com/service/getAllCity?token=${carToken}`, (res) => {
            const newFilter = filterCar('city_list', 'city_name', 'city_id');
            this.cityOptions = newFilter(res);
            let newData = tools.deepCopy(formData);
            newData[1].options = this.cityOptions;

            this.setState({ loading: false, formData: newData })
        })
    }
    setEidtForm = (data) => {
        
        this.setState({
            jsonpData:{
                model_id:data.model_id[2],
                brand_id:data.model_id[0],
                series_id:data.model_id[1],
                city_id:data.zone[0],
                reg_time:data.time,
                mileage:data.mile,

            }
        })
        tools.getJSONP(`https://api.che300.com/service/getUsedCarPrice?token=4d6a9d15e1030e8d39efd548c16226ec&modelId=${data.model_id[2]}&regDate=${data.time}&mile=${data.mile}&zone=${data.zone[0]}`, (result) => {
            if (result.status == 1) {
                this.setState({ loading: false, carPrice: result, showResult: true });
            } else if (result.status == 0) {
                this.setState({ loading: false });
                Toast.show({ msg: result.error_msg });
            } else if (result.status == 2) {
                Toast.show({ msg: '上牌年份应为' })
            }

        })
        // this.toggleModal(0);

    }
    toggleModal = (num) => {
        let {showModal} = this.state;
        showModal[num] = !showModal[num];
        this.setState(showModal);
    }


    handleSetResault = (num) => {
        this.setState({
            carResault: num
        })
    }

    handleGo=()=>{
        const {carResault,carPrice,jsonpData} = this.state;
        let level;
        if(carResault==1){
            level = 'good';
        }else if(carResault ==2){
            level = 'high';
        }else if(carResault == 0){
            level = 'low';
        }
        location.href = `#/cp/add/${level}/${jsonpData.brand_id}/${jsonpData.series_id}/${jsonpData.model_id}/${jsonpData.city_id}/${jsonpData.reg_time}/${jsonpData.mileage}`  
    }

    render() {
        const {formData, loading, carPrice, carResault, showResult} = this.state;

        if (loading) {
            return (
                <Loading />
            )
        }
        let finalCarPrice;
        try {
            if (carResault == 0) {
                finalCarPrice = carPrice.low_price
            } else if (carResault == 1) {
                finalCarPrice = carPrice.good_price
            } else if (carResault == 2) {
                finalCarPrice = carPrice.high_price
            }
        } catch (error) {

        }

        return (
            <div className="">
                <a className={(!showResult ? '' : 'none ') + "btn btn-info fs fs12 mb15 "} href="javascript:;" onClick={() => { history.go(-1) } }>返回</a>

                <div className={!showResult ? '' : 'none'}>
                    <Panel title='车辆基本资料' type="default">

                        <div className="p20">
                            <Modal show={this.state.showModal[0]} title="提示">
                                <div ></div>
                            </Modal>
                            <Form formStyle="horiz" onSubForm={this.setEidtForm} >
                                <div className="row mt10 pb20">
                                    <div className=" col-md-6 mb30">
                                        {formData.map((obj, idx) => {
                                            return (<FormCtrl key={idx} {...obj} />)
                                        })}
                                    </div>

                                </div>

                                <FormSub className="full" ></FormSub>


                            </Form>



                        </div>


                    </Panel>
                </div>
                <div className={showResult ? '' : 'none'}>
                    <Panel title='车辆评估结果' type="success">
                        <div className="list p20">
                            <div className="list-contert-zy">
                                <ul>
                                    <li className="list-contert-zy-jg"></li>
                                    <li className="list-contert-zy-bm">{carPrice.title}</li>
                                    {/*<li className="list-contert-zy-js">{this.state.zoneCity}<span>|</span>{this.state.time}上牌<span>|</span>行驶里程{this.state.mile}万公里<span>|</span>新车指导价{carPrice.price}万</li>*/}
                                    <li className="list-contert-zy-pg">
                                        <a href="javascript:;" className="price br2" style={{ width: '280px', height: '44px' }}>评估初步收购价<span className="fs28 vm warn-color ">￥{finalCarPrice}万</span></a>

                                    </li>
                                    <li className="list-contert-zy-gs fs12">
                                        {/*<img src="/Public/mall/pc/images/gantan.png" style={{ padding: "5px 5px 0 35px" }} />*/}
                                        影响收购价的主要因素有<span>车龄，行驶里程，车况，交易地区</span>等，实际融资金额许通过实地检测而定。
                                    </li>
                                    <div className="pt10 pb10">选择车况</div>
                                    <li className="list-contert-zy-ck ">
                                        <a onClick={this.handleSetResault.bind(this, 2)} className={carResault == 2 ? "btn-info btn tc mr10 fs12" : 'btn btn-default tc mr10 fs12'}>车况优秀</a>
                                        <a onClick={this.handleSetResault.bind(this, 1)} className={carResault == 1 ? "btn-info btn tc mr10 fs12" : 'btn btn-default tc mr10 fs12'}>车况良好</a>
                                        <a onClick={this.handleSetResault.bind(this, 0)} className={carResault == 0 ? "btn-info btn tc mr10 fs12" : 'btn btn-default tc mr10 fs12'}>车况一般</a>
                                    </li>
                                    <li className="list-contert-zy-gg" style={{ display: carResault == 2 ? 'block' : 'none' }}>
                                        {/*<img src="/Public/mall/pc/images/xiaosanjiao.png" style={{ position: "relative", top: "-33px", left: "150px" }} />*/}
                                       {/* <i className="iconfont icon-xuanze cf18 mr5"></i><span>外观没有任何痕迹，无补漆</span>
                                        <i className="iconfont icon-xuanze cf18 mr5"></i><span>内饰及座椅无磨损、污渍</span>
                                        <i className="iconfont icon-xuanze cf18 mr5"></i><span>机械设备处于极好的状态</span>*/}
                                        <div className="pt10 warn-color">外观没有任何痕迹，无补漆</div>
                                        <div className="pt10 warn-color">内饰及座椅无磨损、污渍</div>
                                        <div className="pt10 warn-color">机械设备处于极好的状态</div>
                                    </li>
                                    <li className="list-contert-zy-gg" style={{ display: carResault == 1 ? 'block' : 'none' }}>
                                        {/*<img src="/Public/mall/pc/images/xiaosanjiao.png" style={{ position: "relative", top: "-33px", left: "340px" }} />*/}
                                       {/* <i className="iconfont icon-xuanze cf18 mr5"></i><span>外观轻微痕迹</span>
                                        <i className="iconfont icon-xuanze cf18 mr5"></i><span>内饰及座椅有轻微磨损、少量污渍</span>
                                        <i className="iconfont icon-xuanze cf18 mr5"></i><span>机械设备处于较好的状态</span>*/}
                                        <div className="pt10 warn-color">外观轻微痕迹</div>
                                        <div className="pt10 warn-color">内饰及座椅有轻微磨损、少量污渍</div>
                                        <div className="pt10 warn-color">机械设备处于较好的状态</div>
                                    </li>
                                    <li className="list-contert-zy-gg" style={{ display: carResault == 0 ? 'block' : 'none' }}>
                                        {/* <img src="/Public/mall/pc/images/xiaosanjiao.png" style={{ position: "relative", top: "-33px", left: "540px" }} />*/}
                                       {/* <i className="iconfont icon-xuanze cf18 mr5"></i><span>外观轻微痕迹</span>
                                        <i className="iconfont icon-xuanze cf18 mr5"></i><span>内饰及座椅有较多磨损、污渍</span>
                                        <i className="iconfont icon-xuanze cf18 mr5"></i><span>机械设备处于一般的状态</span>*/}
                                        <div className="pt10 warn-color">外观轻微痕迹</div>
                                        <div className="pt10 warn-color">内饰及座椅有较多磨损、污渍</div>
                                        <div className="pt10 warn-color">机械设备处于一般的状态</div>
                                    </li>
                                </ul>
                                <div className="mt10">

                                     <a className="br2 btn btn-info fs12" onClick={this.handleGo}>提交订单</a>

                                </div>
                               
                            </div>
                        </div>

                    </Panel>


                </div>



            </div>

        )
    }

}

export default CpDetails;