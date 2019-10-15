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
import Process from '../../src/Process';
import Toast from '../../src/Toast';
import form_tools from '../../tools/form_tools';

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
        "name": "title",
        "label": "附件标题",
        "value": "",
        "type": "text"
    },
    {
        "name": "file",
        "label": "附件",
        "value":[],
        "type": "file-group"
    },
    {
        "name": "content",
        "label": "内容",
        "value": "",
        "type": "textarea"
    }
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

class ZcdetailsFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
          formData:tools.deepCopy(formData),
          filesData:[],
          modalShow:[false,false],
          loading:true,
          page: {
            page_count: 0,
            page_index: 1,
            record_count: 0
          },
          len:30,
          selArr:[], 
        }
        this.editType="add";
        this.editId=null;
        this.disabledForm=false;
    }

    componentWillMount() {
        this.getFilesData();

    }
    componentWillReceiveProps(nextProps) {
    }

    validChecked=(id)=>{
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll=()=>{
    let {filesData,selArr} = this.state;
    for (let i in filesData) {
      if (tools.indexOf(selArr, filesData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked=(id)=>{
    let {selArr} = this.state;
    if (tools.indexOf(selArr, id) >= 0) {
      selArr = tools.removeArr(selArr, id);
    } else {
      selArr.push(id);
    }
    this.setState({
      selArr: selArr
    });
  }
  toggleCheckedAll=()=>{

    let newArr = [];
    let {filesData}=this.state;
    if (this.state.selArr.length == 0) {
      for (let i in filesData) {
        newArr.push(filesData[i].id);
      }
    }
    this.setState({
      selArr: newArr
    });
  }
    resetForm=(data)=>{

    }
    filterValToForm=(type="add",id,disabled=false)=>{
        this.disabledForm=disabled;
        if(type=="add"){
            this.setState({formData:tools.deepCopy(formData)},()=>{
               this.toggleModal(1);
                this.editType="add";
                this.editId=null; 
            })
            
        }else if(type=="edit"){
           
            this.editType="edit";
            this.editId=id;
            this.valToForm();
        }
    }
    removeItem=(id)=>{ //删除数据
        id = id != "all" ? id : this.state.selArr;
        if (id.length == 0) {
          Toast.show({
            msg: "请选择删除对象"
          })
          return;
        }
        Modal.show({
                child:<div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof(id)!="string"?id.join(','):id}</span> 的附件？</div>,
                conf:{
                  footer:(
                    <a href="javascript:;"  onClick={()=>{ 
                      this.sureDelItem(id)
                   }} className="btn btn-info">确定删除</a>)
                }
            
        })
    
  
  }
  sureDelItem=(id)=>{
      let {page}=this.state;
      fetch('/property/archive.do', {
        method:'DELETE',
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({ ids: id})
      }).then(response => response.json())
      .then((data)=>{
        Modal.close();
          if (data.code == "SUCCESS") {
            page.page_index = 1;
            this.setState({
              page: page
            })
           this.getFilesData();

          }
          Toast.show({
            msg: data.info
          })
    });
    
  }
    valToForm=()=>{
        Process.show();
        fetch(`/property/archive/${this.editId}.do`, {
          method: "get",
          credentials: 'same-origin'
        }).then(response => response.json())
          .then((data) => {
            Process.Close();
            if(data.code=="SUCCESS"){
                let newFormData=tools.deepCopy(formData);
                for(let i in newFormData){
                    if(typeof data.data[newFormData[i].name]!=='undefined'){
                        if(newFormData[i].name=="file"){
                            let newArr=[];
                            let valArr=[];
                            try{
                                valArr=data.data[newFormData[i].name].split(',');
                            }catch(e){}
                            for (let i in valArr){
                                newArr.push({name:"文件"+i,src:valArr[i]})
                            }
                            newFormData[i].value=newArr;
                        }else {
                            newFormData[i].value=data.data[newFormData[i].name];
                        }
                      
                    }  
                }
                this.setState({formData:newFormData},()=>{
                    this.toggleModal(1);
                }) 
            }else if(data.code=="NO_DATA"){
                //this.setState({loading:false,filesData:[]}) 
            }
            
          });
    }
    getFilesData=()=>{
        let {data_id,model,step,add_id}=this.props;

        let {page,len}=this.state;
        fetch(`/property/archive/${model}/${step}.do?`+tools.parseParam({data_id:data_id,page:page.page_index,len,batch_id:add_id}), {
          method: "get",
          credentials: 'same-origin'
        }).then(response => response.json())
          .then((data) => {
            if(data.code=="SUCCESS"){

        /*        let newData=tools.deepCopy(this.state.formData);
                let fileArr=tools.deepCopy(this.state.fileArr);
                data.data.model_car_all=[data.data.brand_id,data.data.series_id,data.data.model_id]
                for(let i in data.data){
                    if("city_id,customer_sex,level,is_full".indexOf(i)>=0){
                        data.data[i]=[data.data[i]]
                    }

                    newData=form_tools.setArrObjVal(newData,i,data.data[i]);
                    fileArr=form_tools.setArrObjVal(fileArr,i,data.data[i]);

                }*/
                this.setState({loading:false,selArr: [],filesData:data.data}) 
            }else if(data.code=="NO_DATA"){
                this.setState({loading:false,selArr: [],filesData:[]}) 
            }
            
          });
    }

    toggleModal=(i)=>{ //切换弹窗显示
        let arr=this.state.modalShow;
        arr[i]=!arr[i]
        this.setState({modalShow:arr})
    }
    getForm=(data)=>{
        console.log(this.props,this.editType)
        let {data_id,model,step}=this.props;
        let newData=tools.deepCopy(data);
        let newArr=[];
        for(let i in newData.file){
            newArr.push(newData.file[i].src);
        }
        newData.file=newArr.join(',');
        newData.id=this.editId;
        newData.data_id=data_id;
        Process.show();
        let url=this.editType=="add"?`/property/archive/${model}/${step}.do`:`/property/archive/${this.editId}.do`
        fetch(url, {
          method: this.editType == "edit" ? "put" : "post",
          credentials: 'same-origin',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: tools.parseParam(newData)
        }).then(response => response.json())
          .then((res) => {
            Process.Close();
            Toast.show({ msg: res.info })
            if (res.code == "SUCCESS") {
              this.toggleModal(1);
              this.getFilesData();
            } else if (res.code == "NO_DATA") {

            }
          });

    }
    render() {
      const {formData,loading,filesData,modalShow} = this.state;
        if(loading){
            return(
                <Loading/>
            )
        }
        return (
                <div className="mb15">
                    <div className="wrapper">
                        <section  className="p15 white-bg">
                            <div>
                                <div className="clearfix mb10">
                                    <div className="fr btn btn-info fs13" onClick={()=>{ this.filterValToForm('add') }} >添加附件</div>
                                    <h4 className="fs20">附件记录</h4>
                                </div>
                                <div>
                                    <Modal title={this.disabledForm?"查看附件":"添加附件"}  show={modalShow[1]} onClose={()=>{  this.toggleModal(1)}}>
                                      {modalShow[1]?<Form disabled={this.disabledForm} formStyle="ver" formRendData={formData} onSubForm={this.getForm} ></Form>:""} 
                                    </Modal>
                                    <div className="table-responsive fixed-loading">
                                        <table className="table mt20 table-striped ">
                                            <thead>
                                       
                                                <tr>
                                                    <th>
                                                       <input name="select" checked={this.validCheckedAll()} onClick={()=>{ this.toggleCheckedAll() } }  className="select-box" value="all" type="checkbox" />
                                                    </th>
                                                    <th>时间</th>
                                                    <th>附件名</th>
                                                    <th>上传人</th>
                                                    <th>操作</th>
                                                   
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {filesData.map((obj,idx)=>{
                                                return (
                                                <tr key={idx} >
                                                    <td>
                                                      <input name="select" checked={this.validChecked(obj.id)} onClick={()=>{ this.toggleChecked(obj.id)}}  className="select-box"  type="checkbox" />
                                                    </td>
                                                    <td>{obj.update_time}</td>
                                                    <td>{obj.title}</td>
                                                    <td>{obj.user_name}</td>
                                                    <td>
                                                      <div className="btn-group mb15">
                                                            <a href="javascript:;" className="btn btn-sm btn-info" onClick={()=>{ this.filterValToForm('edit',obj.id); }} >附件编辑</a>
                                                            <a href="javascript:;" className="btn btn-sm btn-info" onClick={()=>{ this.filterValToForm('edit',obj.id,"disabled"); }} >附件查看</a>
                                                            <a href="javascript:;" className="btn btn-sm btn-warn" onClick={()=>{ this.removeItem(obj.id)}} >删除</a>
                                                      </div>
                                                    </td>
                                                </tr>
                                                );
                                            })}
                                              
                                          
                                            </tbody>
                                        </table>

                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
  
        )
    }
}




export default ZcdetailsFiles;
