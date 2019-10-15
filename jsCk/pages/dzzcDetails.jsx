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
import Process from '../../src/Process';
import Toast from '../../src/Toast';

import DzzcdetailsInfo from './dzzcDetails_info';


let fileArr=[
    {
        isLabel:false,
        title:"正左45度",
        type:"file-single",
        readOnly:true,
        name:"front_left"
    },
    {
        isLabel:false,
        title:"正面照片",
        type:"file-single",
        readOnly:true,
        name:"front"
    },
    {
        isLabel:false,
        title:"正面右45度照片",
        readOnly:true,
        type:"file-single",
        name:"front_right"
    },
    {
        isLabel:false,
        title:"后左45度照片",
        type:"file-single",
        readOnly:true,
        name:"behind_left"
    },
    {
        isLabel:false,
        title:"后面照片",
        type:"file-single",
        readOnly:true,
        name:"behind"
    },
    {
        isLabel:false,
        title:"后左45度",
        type:"file-single",
        readOnly:true,
        name:"behind_right"
    },
    {
        isLabel:false,
        title:"中控照片",
        type:"file-single",
        readOnly:true,
        name:"central"
    },
    {
        isLabel:false,
        title:"内饰照片",
        type:"file-single",
        readOnly:true,
        name:"interior"
    },
    {
        isLabel:false,
        title:"行驶证照片",
        readOnly:true,
        type:"file-single",
        name:"license_img"
    }
]
const typeOptions= [
        {
          name: "合同",
          value:"ht"
        },
        {
          name: "出入库",
          value:"outin"
        },
        {
          name: "资产交接",
          value:"move"
        },
        {
          name: "收息",
          value:"defer"
        },
        {
          name: "断档",
          value:"interrupt"
        },
        {
          name: "赎回",
          value:"redemption"
        },
       /* {
          name: "逾期",
          value:"overdue"
        },*/
        {
          name: "已处置",
          value:"dispose"
        }
]
class Dzzcdetails extends Component {
    constructor(props) {
        super(props);
        this.timer=null;
        this.state = {
          closeSider:false,
          fileArr:tools.deepCopy(fileArr),
          modalShow:[false,false],
          loading:true,
          currenComp:"",
        }
    }
   
    componentWillMount() {
        this.getProperData();
        this.getContent();

    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.type!=this.props.type){
        this.getContent();
      }
      if(JSON.stringify(nextProps.infoData)!=JSON.stringify(this.props.infoData)){
        this.getContent(nextProps.infoData);
      }
    }
    componentWillUnmount(){
   
    }
   
    getContent=(data)=>{
      let {type,params,infoData}=this.props;
      infoData=data&&data.id?data:infoData;
      if(type=="ht"){
        require.ensure(['./detail_ht'], (require) => {
            const Comp = require('./detail_ht').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type} />})
        })
      }else if(type=="outin"){
        require.ensure(['./detail_outin'], (require) => {
            const Comp = require('./detail_outin').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  />})
        })
      }else if(type=="in"){
        require.ensure(['./detail_in'], (require) => {
            const Comp = require('./detail_in').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  item_id={params.add_id}  />})
        })
      }else if(type=="moveitem"){
        require.ensure(['./detail_moveitem'], (require) => {
            const Comp = require('./detail_moveitem').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type} item_id={params.add_id} />})
        })
      }else if(type=="deferitem"){
        require.ensure(['./detail_deferitem'], (require) => {
            const Comp = require('./detail_deferitem').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type} redemption_count={params.upData.split('-')[0]} item_id={params.add_id}/>})
        })
      }else if(type=="interruptitem"){
        require.ensure(['./detail_interruptitem'], (require) => {
            const Comp = require('./detail_interruptitem').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type} item_id={params.add_id} />})
        })
      }else if(type=="redemptionitem"){
        require.ensure(['./detail_redemptionitem'], (require) => {
            const Comp = require('./detail_redemptionitem').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type} item_id={params.add_id} />})
        })
      }else if(type=="disposeitem"){
        require.ensure(['./detail_disposeitem'], (require) => {
            const Comp = require('./detail_disposeitem').default;

            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type} item_id={params.add_id} />})
        })
      }else if(type=="out"){
        require.ensure(['./detail_out'], (require) => {
            const Comp = require('./detail_out').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  item_id={params.add_id} />})
        })
      }else if(type=="move"){
        require.ensure(['./detail_move'], (require) => {
            const Comp = require('./detail_move').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData}  pageType={params.type}  />})
        })
      }else if(type=="defer"){
        require.ensure(['./detail_defer'], (require) => {
            const Comp = require('./detail_defer').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  />})
        })
      }else if(type=="interrupt"){
        require.ensure(['./detail_interrupt'], (require) => {
            const Comp = require('./detail_interrupt').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  />})
        })
      }else if(type=="redemption"){
        require.ensure(['./detail_redemption'], (require) => {
            const Comp = require('./detail_redemption').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  />})
        })
      }else if(type=="overdue"){
        require.ensure(['./detail_overdue'], (require) => {
            const Comp = require('./detail_overdue').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  />})
        })
      }else if(type=="dispose"){
        require.ensure(['./detail_dispose'], (require) => {
            const Comp = require('./detail_dispose').default;
            this.setState({currenComp:<Comp proper_id={params.id} orderInfo={infoData} pageType={params.type}  />})
        })
      }

    }
    resetForm=(data)=>{

    }
    getProperData=()=>{
        let {id,infoData}=this.props;
        if(infoData.id){
            clearTimeout(this.timer);
            let fileArr=tools.deepCopy(this.state.fileArr);
            for(let i in infoData){
                fileArr=form_tools.setArrObjVal(fileArr,i,infoData[i]);
            }         
            this.setState({loading:false,fileArr:fileArr}) 
        }else{
            this.timer=setTimeout(()=>{
                this.getProperData();
            },200)  
        }
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

    render() {
      const {formData,loading,currenComp,modalShow,fileArr} = this.state;
      let {params,type,infoData}=this.props;
      const showMenu=this.filterMenu();
     
         if(loading){
             return(
                 <Loading/>
            )
         }

        return (
           <div >

                <div className={"in,out,moveitem,deferitem,interruptitem,redemptionitem,disposeitem,".indexOf(params.type+",")<0?"mt15 clearfix white-bg":" "}>
                     <div className="tab-wrap ">
                        <div style={{display:"in,moveitem,deferitem,interruptitem,redemptionitem,disposeitem,out,".indexOf(params.type+",")<0?"block":"none"}} className={"tab-head pl10  " }>
                            {typeOptions.map((obj,index)=>{
                                let activeClass=obj.value==type?" active":"";
                                return(
                                    <a href={'#/dzzc.html/'+params.id+'/'+obj.value}  key={index}  className={"tab-btn "+activeClass} >{obj.name}</a>
                                )
                            },this)}
                        
                        </div>
                        <div className="tab-cont">
                           <div className="">
                             {currenComp}
                           </div>
                        </div>
                         
                    </div>
                </div>
              
                
               

                
           </div>
        )
    }
}




export default Dzzcdetails;
