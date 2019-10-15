
import React,{Component} from 'react';

import Loading from '../../src/Loading';
import Select from '../../src/Select';

import Form from '../../src/Form';
import FormCtrl from '../../src/FormCtrl';
import Input from '../../src/Input';
import CheckRadio from '../../src/CheckRadio';
import Modal from '../../src/Modal';
import FileSingle from '../../src/FileSingle';
import FileGroup from '../../src/FileGroup';
import Cascader from '../../src/Cascader';
import TimeSelector from '../../src/TimeSelector';
import TimeSelectInput from '../../src/TimeSelectInput';
import SetMobileCont from '../../src/SetMobileCont';
import InputPosition from '../../src/InputPosition';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import Tags from '../../src/Tags';
import tools from '../../tools/public_tools';

class Wrap extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'Form';
        this.state = {
          catData:[],
          loading:true
        }
        this.pointer={}
    }

    componentWillMount() {
      this.getCateData();
    }
    filterCatData=(data)=>{
      let newData=[];
      data.forEach((obj,idx)=>{
        newData.push({name:obj.name,value:obj.id})
      })
      return newData;
    }
    getCateData=()=>{
      fetch('/explorer/category.do', {
        method: "get",
      }).then(response => response.json())
      .then((res)=>{
        if(res.code=="SUCCESS"){
            let newData=this.filterCatData(res.data);
            this.setState({loading:false,catData:newData});
          }else if(res.code=="NO_DATA"){
            this.setState({loading:false,catData:[]});
          }
      });
    }
    getForm=(data)=>{
      Process.show();
      let newData=tools.deepCopy(data);
      newData['cat_id']=newData['cat_id'].join(',');
      newData['content']=JSON.stringify(newData['content']);
      let newArr=[]
      newData['tags'].map((obj,idx)=>{
        newArr.push(obj.name);
      })
      newData['tags']=newArr.join(',');
      if(this.pointer.x){
        newData['lat']=this.pointer.x;
        newData['lng']=this.pointer.x;
      }
      
      fetch('/explorer.do?access_token='+Token, {
        method: "post",
        body: JSON.stringify(newData) 
      }).then(response => response.json())
      .then((res)=>{
        Process.Close();
        Toast.show({msg:res.info})
        if(res.code=="SUCCESS"){
           
        }else if(res.code=="NO_DATA"){
            
        }
      });
    }
    getPointer=(p)=>{
      this.pointer=p;
    }
    render() {
      let {loading,catData}=this.state;
   
      if(loading){
        return (<Loading></Loading>)
      }
        return (
   
          <div className="main container pt30 pb30" >
      
            <Form className="m" formStyle="horiz" onSubForm={this.getForm} >
           
              <FormCtrl name="title" label="文章标题"  max={50} required={true} type="text"   placeholder="请在这里输入文章标题" />
       
              <FormCtrl name="cat_id" label="文章分类"  search={true} type="select-single" options={catData} />
              <FormCtrl name="thumb" label="封面图片"  type="file-single" title="立即上传" />
              <FormCtrl label="标签" name="tags" type="tags"  />
              <FormCtrl label="正文" name="content" type="set-mobile-cont"  />
              <FormCtrl label="" name="address"  type="position" latLngChange={this.getPointer} />
            </Form>
          </div>
        )
    }
}




export default Wrap;
