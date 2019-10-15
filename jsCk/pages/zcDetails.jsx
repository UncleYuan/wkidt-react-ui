import React,{Component,creatElement} from 'react';

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
let options = [
    { name: "全款车", value: '0' },
    { name: "按揭车", value: '1' }
];
let options1 = [
    { name: "男", value: '1' },
    { name: "女", value: '2' }
];

const carToken="4d6a9d15e1030e8d39efd548c16226ec";

const filterCar=function(listName,keyName,valueName){
    return function(res){
        let nowData=[];
        if(res.status==1&&res[listName]){
            for(let i=0;i< res[listName].length;i++){
                nowData.push({name:res[listName][i][keyName],value:res[listName][i][valueName]});
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
        type:"jsonp",
        filter:filterCar('brand_list','brand_name','brand_id')
    },

    {
        name: "Series",
        url: `https://api.che300.com/service/getCarSeriesList?token=${carToken}`,
        keyName: 'brandId',
        type:"jsonp",
        filter:filterCar('series_list','series_name','series_id')
    },
    {
        name: "Model",
        url: `https://api.che300.com/service/getCarModelList?token=${carToken}`,
        keyName: 'seriesId',
        type:"jsonp",
        filter:filterCar('model_list','model_name','model_id')
    }
]



const formData = [
    {
        "name": "customer_name",
        "label": "客户名称",
        "value": "",
        "type": "text"
    },
    {
        "name": "customer_sex",
        "label": "性别",
        "value": [],
        "inline": true,
        "options": options1,
        "type": "radio"
    },
    {
        "name": "customer_id_card",
        "label": "客户身份证",
        "value": "",
        "type": "text"
    },
    {
        "name": "customer_phone",
        "label": "客户联系电话",
        "value": "",
        "type": "text"
    },
    {
        "name": "borrow_amount",
        "label": "借款金额（万元）",
        "value": "",
        "type": "text"
    },
    {
        "name": "borrow_limit",
        "label": "借款期限（天）",
        "value": "",
        "type": "text"
    },
    {
        "name": "borrow_interest",
        "label": "借款利率（%）",
        "value": "",
        "type": "text"
    },
    {
        "name": "model_car_all",
        "label": "车辆型号",
        "value": "",
        "config":carConfig,
        "type": "cascader"
    },
    {
        "name": "city_id",
        "label": "上牌城市",
        "value": "",
        "search":true,
        "type": "select-single",
        "options":[]
    },
    {
        "name": "reg_time",
        "label": "上牌时间",
        "value": "",
        "format":"y-m",
        "type": "time-select-input"
    },
    {
        "name": "license",
        "label": "行驶证号",
        "value": "",
        "type": "text"
    },
    {
        "name": "original_price",
        "label": "裸车价",
        "value": "",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>万</div>
    },
    {
        "name": "mileage",
        "label": "公里数",
        "value": "",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>万公里</div>
    },
    {
        "name": "level",
        "label": "车况评级",
        "value": [],
        "inline": true,
        "options":[
            {name:"一般 ",value:"low"},
            {name:"良好 ",value:"good"},
            {name:"优秀 ",value:"high"}
        ],
        "type": "radio"
    },
    {
        "name": "is_full",
        "label": "是否全款车",
        "value": [""],
        "inline": true,
        "options": options,
        "type": "radio"
    },
    {
        "name": "loan_amount",
        "label": "购车贷款金额",
        "value": "",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>万</div>
    },
    {
        "name": "repayed_amount",
        "label": "已还金额",
        "value": "",
        "type": "input-group",
        "barHtml":<div className='btn gray-bg'>元</div>
    },
    {
        "name": "monthly",
        "label": "月供金额",
        "value": "aa",
        "type": "input-group",
        "barHtml": <div className='btn gray-bg'>元</div>
    },
]

let fileArr=[
    {
        isLabel:false,
        title:"正左45度",
        type:"file-single",
        name:"front_left"
    },
    {
        isLabel:false,
        title:"正面照片",
        type:"file-single",
        name:"front"
    },
    {
        isLabel:false,
        title:"正面右45度照片",
        type:"file-single",
        name:"front_right"
    },
    {
        isLabel:false,
        title:"后左45度照片",
        type:"file-single",
        name:"behind_left"
    },
    {
        isLabel:false,
        title:"后面照片",
        type:"file-single",
        name:"behind"
    },
    {
        isLabel:false,
        title:"后左45度",
        type:"file-single",
        name:"behind_right"
    },
    {
        isLabel:false,
        title:"中控照片",
        type:"file-single",
        name:"central"
    },
    {
        isLabel:false,
        title:"内饰照片",
        type:"file-single",
        name:"interior"
    },
    {
        isLabel:false,
        title:"行驶证照片",
        type:"file-single",
        name:"license_img"
    }
]

class Zcdetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
          closeSider:false,
          formData:tools.deepCopy(formData),
          fileArr:tools.deepCopy(fileArr),
          modalShow:[false,false],
          loading:true,
          infoData:{},
          currenComp:"",
          step:false
        }
       
        this.cityOptions=[];
        this.menuData=[
          {
            "name":"初评",
            "link":"#/zc.html/first",
            "type":"first",
            "statusKeyName":"first_evaluation_status",
            "status":["未初评","初评中","初评通过","初评未通过"]
          },
          {
            "name":"查档",
            "link":"#/zc.html/whthin",
            "type":"whthin",
            "statusKeyName":"query_archives_status",
            "status":["未查档","查档中","查档通过","查档未通过"]
          },
          {
            "name":"验车",
            "link":"#/zc.html/inspection",
            "type":"inspection",
            "statusKeyName":"check_car_status",
            "status":["未验车","验车中","验车通过","验车未通过"]
          },
          {
            "name":"终审",
            "link":"#/zc.html/final",
            "type":"final",
            "statusKeyName":"end_audit_status",
            "status":["未终审","终审中","终审通过","终审未通过"]
          },
          {
            "name":"身份核验",
            "link":"#/zc.html/check",
            "type":"check",
            "statusKeyName":"rean_name_check_status",
            "status":["未核验","核验中","核验通过","核验未通过"]
          },
          {
            "name":"放款登记",
            "link":"#/zc.html/lending",
            "type":"lending",
            "statusKeyName":"lending_status",
            "status":["未放款","放款中","放款成功","放款失败"]
          }
        ]
    }
    static childContextTypes = {
        orderInfo: React.PropTypes.object,
        getOrderState: React.PropTypes.func
     }
    getChildContext() {
        return {
            orderInfo: this.state.infoData,
            getOrderState: this.getOrderState
            };
     }
    componentWillMount() {
        this.getOrderData();
        this.getCity();
        this.getContent();

    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.type!=this.props.type){
        this.getContent();
      }
    }
    getOrderState=(name)=>{
        return this.state[name];
    }
    getContent=()=>{
      let {type,params}=this.props;
      if(type=="first"){
        require.ensure(['./detail_first'], (require) => {
            const Comp = require('./detail_first').default;
            this.setState({currenComp:<Comp order_id={params.id} />})
        })
      }else if(type=="whthin"){
        require.ensure(['./detail_whthin'], (require) => {
            const Comp = require('./detail_whthin').default;
            this.setState({currenComp:<Comp order_id={params.id} />})
        })
      }else if(type=="inspection"){
        require.ensure(['./detail_inspection'], (require) => {
            const Comp = require('./detail_inspection').default;
            this.setState({currenComp:<Comp order_id={params.id} />})
        })
      }else if(type=="final"){
        require.ensure(['./detail_final'], (require) => {
            const Comp = require('./detail_final').default;
            this.setState({currenComp:<Comp order_id={params.id} />})
        })
      }else if(type=="check"){
        require.ensure(['./detail_check'], (require) => {
            const Comp = require('./detail_check').default;
            this.setState({currenComp:<Comp order_id={params.id} />})
        })
      }else if(type=="lending"){
        require.ensure(['./detail_lending'], (require) => {
            const Comp = require('./detail_lending').default;
            this.setState({currenComp:<Comp order_id={params.id} />})
        })
      }

    }
    resetForm=(data)=>{

    }
    getOrderData=()=>{
        let {id}=this.props;

        fetch(`/property/order/${id}.do`, {
          method: "get",
          credentials: 'same-origin'
        }).then(response => response.json())
          .then((data) => {
            if(data.code=="SUCCESS"){

                let newData=tools.deepCopy(this.state.formData);
                let fileArr=tools.deepCopy(this.state.fileArr);
                data.data.model_car_all=[data.data.brand_id,data.data.series_id,data.data.model_id]
                for(let i in data.data){
                    if("city_id,customer_sex,level,is_full".indexOf(i)>=0){
                        data.data[i]=[data.data[i]]
                    }

                    newData=form_tools.setArrObjVal(newData,i,data.data[i]);
                    fileArr=form_tools.setArrObjVal(fileArr,i,data.data[i]);

                }
         
                this.setState({loading:false,infoData:data.data,formData:newData,fileArr:fileArr,step:tools.filterObjVal(this.menuData,data.data.steps,'type')}) 
            }
            
          });
    }
    getCity=()=>{
        tools.getJSONP(`https://api.che300.com/service/getAllCity?token=${carToken}`,(res)=>{
            const newFilter=filterCar('city_list','city_name','city_id');
            this.cityOptions=newFilter(res);
            
            let newData=tools.deepCopy(formData);
            newData[8].options=this.cityOptions;
            this.setState({formData:newData})
        })
    }
    toggleModal=(i)=>{ //切换弹窗显示
        let arr=this.state.modalShow;
        arr[i]=!arr[i]
        this.setState({modalShow:arr})
      }
  
    getForm=(data)=>{
      alert(JSON.stringify(data))
    }
    toggleSider=()=>{
      let {closeSider}=this.state;
      this.setState({closeSider:!closeSider})
    }
    filterMenu=()=>{
      let {type}=this.props;
      return tools.filterObjVal(this.menuData,type,'type');

    }
    setEidtForm=(data)=>{
        Process.show();
        for (let i in data){
            if("city_id,level,is_full,customer_sex".indexOf(i)>=0){
                data[i]=data[i].join(',');
            }else if(i=="model_car_all"){
                data['brand_id']=data[i][0];
                data['series_id']=data[i][1];
                data['model_id']=data[i][2];
                delete data['model_car_all'];
            }
        }
        data['id']=this.props.id;
        fetch(`/property/order.do`, {
            method: "put",
            credentials:'same-origin',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body:tools.parseParam(data)
          }).then(response => response.json())
          .then((res)=>{
            Process.Close();
            Toast.show({msg:res.info});
             if(res.code=="SUCCESS"){
              Modal.show({
                    child:<div className="fs14 ">{res.info}</div>,
                    conf:{
                      footer:(
                        <a href="javascript:;" onClick={()=>{ Modal.close(); locationl.href="#/zc.html/"+order_id+"/"+this.props.params.type+"/"+(new Date()).valueOf(); }}  className="btn btn-info">确定</a>)
                    }
                
              })
            }
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
      const {formData,loading,currenComp,infoData,modalShow,fileArr,step} = this.state;
      let {params}=this.props;
      const showMenu=this.filterMenu();
     
        if(loading){
            return(
                <Loading/>
            )
        }
        return (
           <div >
             
              
              <div className="mb15">
                <Panel title={<div>总信息<a href="#/ddlist.html" className="warn-color fs12 ml15">返回</a></div>} type="default" noWrap={true}>
                  <div className="p15 ">
                    <div className="row">
                      <div className="col-md-3 col-lg-2 car-img-light-box">
                          <span className="txt-bg">点击查看图片</span>
                      <img className="img-resize pointer" onClick={()=>{ this.openImgList(infoData.images) }} src={infoData.images.length>0?infoData.images[0].url+"?imageView2/1/w/400/h/250":"/admin/img/noimg.png"} alt=""/>
                      </div>
                      <div className="col-md-9  col-lg-10">
                        <h5 className="fs20 mt10 mb10">{infoData.model_name}</h5>
                        <div className="row ">
                          <div className="col-md-4 mb10">车辆状态：{infoData.status_name}</div>
                          <div className="col-md-4 mb10">订单编号：{infoData.order_number}</div>
                          <div className="col-md-4 mb10">所属店铺：{infoData.shop_name}</div>
                        </div>
                        <div className=" proc-btn-wrap tj">
                            <div className="line"></div>
                            {this.menuData.map((obj,idx)=>{

                                let activeClass=showMenu&&showMenu.idx==idx?"active":"";
                                let disableClass=idx>step.idx?"disabled":""; 
                                let stepClass=idx==step.idx?"step-in":""; 
                                return (
                                <div key={idx} className={"proc-btn-box "+activeClass+" "+disableClass+" "+stepClass}>
                                    <a href={!disableClass?`#/zc.html/${this.props.id}/${obj.type}`:"javascript:;"} className="btn-top">{obj.name}</a>
                                    <p className="cont-bottom">{obj.status[parseInt(infoData[obj.statusKeyName])]}</p>
                                    <p className="cont-line"></p>
                                </div>
                                );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
              {/*<Panel title={"业务员"+infoData.create_name+"提交  "+infoData.model_name+"   订单号："+infoData.order_number} show={false} type="default" noWrap={true}>
                  <div className="p20">

                    <Form formStyle="horiz" disabled={tools.arrIndexOf([1,3,6,9,12,15],infoData.status)>=0?false:true} onSubForm={this.setEidtForm} >
                                <div className="row mt10 pb20">
                                    <div className=" col-md-6 mb30">
                                        {formData.map((obj,idx)=>{
                                            return (<FormCtrl key={idx} {...obj}   />)
                                        })}
                                    </div>
                                    <div className=" col-md-6 tc">
                                        <div className="row">
                                            {fileArr.map((obj,idx)=>{
                                                return (
                                                    <div key={idx} className="col-md-4 col-xs-4 mb15" >
                                                        <FormCtrl  {...obj} />
                                                    </div>
                                                )
                                            })}
                                            
                                          
                                        </div>
                                    </div>
                                </div>
                            </Form>
                          </div>
                </Panel>*/}
            
                <div className="mt15">
                    
                </div>
              
                {currenComp}
               

                
           </div>
        )
    }
}




export default Zcdetails;
