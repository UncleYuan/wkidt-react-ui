import React, { Component, creatElement } from 'react';

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
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';
import PicLightBox from '../../src/PicLightBox';
import Process from '../../src/Process';
import Toast from '../../src/Toast';



let fileArr = [
    {
        isLabel: false,
        title: "正左45度",
        type: "file-single",
        readOnly: true,
        name: "front_left"
    },
    {
        isLabel: false,
        title: "正面照片",
        type: "file-single",
        readOnly: true,
        name: "front"
    },
    {
        isLabel: false,
        title: "正面右45度照片",
        readOnly: true,
        type: "file-single",
        name: "front_right"
    },
    {
        isLabel: false,
        title: "后左45度照片",
        type: "file-single",
        readOnly: true,
        name: "behind_left"
    },
    {
        isLabel: false,
        title: "后面照片",
        type: "file-single",
        readOnly: true,
        name: "behind"
    },
    {
        isLabel: false,
        title: "后左45度",
        type: "file-single",
        readOnly: true,
        name: "behind_right"
    },
    {
        isLabel: false,
        title: "中控照片",
        type: "file-single",
        readOnly: true,
        name: "central"
    },
    {
        isLabel: false,
        title: "内饰照片",
        type: "file-single",
        readOnly: true,
        name: "interior"
    },
    {
        isLabel: false,
        title: "行驶证照片",
        readOnly: true,
        type: "file-single",
        name: "license_img"
    }
]
const typeOptions = [
    {
        name: "合同",
        value: "ht"
    },
    {
        name: "出入库",
        value: "outin"
    },
    {
        name: "资产交接",
        value: "move"
    },
    {
        name: "收息",
        value: "defer"
    },
    {
        name: "断档",
        value: "interrupt"
    },
    {
        name: "赎回",
        value: "redemption"
    },
    /* {
       name: "逾期",
       value:"overdue"
     },*/
    {
        name: "已处置",
        value: "dispose"
    }
]
class DzzcdetailsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            closeSider: false,
            fileArr: tools.deepCopy(fileArr),
            modalShow: [false, false],
            loading: true,
            infoData: {},
            currenComp: "",
        }
        window.upDataProperFunc=this.getProperData;
    }
    componentWillUnmount() {
  
    }
    componentWillMount() {
        this.getProperData();
    }
    getProperData = (cb) => {
        let {id, hookInfoData} = this.props;
        fetch(`/property2/${id}.do?items=warehouse,customer,contract,files,product`, {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                if (data.code == "SUCCESS") {
                    let fileArr = tools.deepCopy(this.state.fileArr);
                    for (let i in data.data) {
                        fileArr = form_tools.setArrObjVal(fileArr, i, data.data[i]);
                    }
                    
                    let newData=tools.deepCopy(data);
                    newData.data.contract=newData.contract;
                    newData.data.customer=newData.customer;
                    newData.data.files=newData.files;
                    newData.data.warehouse=newData.warehouse;
                    newData.data.product=newData.product;
                    if (hookInfoData) {
                        hookInfoData(newData.data);
                    }
                    this.setState({ loading: false, infoData:newData.data, fileArr: fileArr })
                }
                if(typeof cb=="function")cb(); 
            });
    }
     openImgList=(images)=>{
        if(images.length>0){
            let imgArr=[];
            let textArr=[];
            for(let i in images){
               imgArr.push(images[i].url||"");
               textArr.push(images[i].remark||"");
            }
            PicLightBox.show({
                conf:{
                     title: "查看图片",
                     imgList:imgArr,
                     infoList:textArr,
                     idx:0
                    }
            }) 
        }
    }
    render() {
        const {infoData, fileArr, loading} = this.state;
        if (loading) {
            return (<div><Loading></Loading></div>)
        }
        return (
            <div className="p15 ">
                <div className="row">
                      <div className="col-md-3 col-lg-2 car-img-light-box">
                         {infoData.images.length>0? <div className="txt-bg"><span className="fr">{infoData.images.length}张</span>车辆相册</div>:""}
                         <img className="img-resize pointer" onClick={()=>{ this.openImgList(infoData.images) }} src={infoData.images.length>0?infoData.images[0].url+"?imageView2/1/w/400/h/250":"/admin/img/noimg.png"} alt=""/>
                      </div>
                    <div className="col-lg-10 col-md-9">
                        
                        <div className="">
                            <h5 className="fs20  mb10">{infoData.model_name}<a href={"#/zc.html/" + infoData.order_number + "/first"} className="fs14 pl5 pointer base-color">查看车辆信息</a></h5>
                            <div className="gray-bg clearfix pt10 ">

                                <div className="col-md-4 mb10">资产编号：{infoData.property_number}</div>
                                <div className="col-md-4 mb10">合同编号：{infoData.contract_no}</div>
                                <div className="col-md-4 mb10">上牌城市：{infoData.city_name}</div>
                                <div className="col-md-4 mb10">上牌时间：{infoData.reg_time}</div>
                                <div className="col-md-4 mb10">放款：{infoData.lending_amount}万元</div>
                                <div className="col-md-4 mb10">利息：{infoData.interest}%</div>
                                 <div className="col-md-4 mb10">所属门店：{infoData.agent_name}</div>
                                <div className="col-md-4 mb10">状态：{infoData.status_name}</div>
                            </div>

                        </div>


                        {/*<div className="clearfix pt15">
                            {fileArr.map((obj, idx) => {
                                return (
                                    <div key={idx} className=" fl mr10" >
                                        <FormCtrl  {...obj} />
                                    </div>
                                )
                            })}
                        </div>*/}
           
                    </div>
                    <div className="col-md-5">

                    </div>
                </div>
            </div>

        )
    }
}




export default DzzcdetailsInfo;
