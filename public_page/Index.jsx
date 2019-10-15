import React,{Component} from 'react';

import Select from '../src/Select';
import Form from '../src/Form';
import FormCtrl from '../src/FormCtrl';
import Input from '../src/Input';
import CheckRadio from '../src/CheckRadio';
import Modal from '../src/Modal';
import FileSingle from '../src/FileSingle';
import FileGroup from '../src/FileGroup';
import Cascader from '../src/Cascader';
import TimeSelector from '../src/TimeSelector';
import TimeSelectInput from '../src/TimeSelectInput';
import SetMobileCont from '../src/SetMobileCont';
import Tags from '../src/Tags';
import Sider from '../public_page/Sider';
import AppBar from '../public_page/AppBar';
class Wrap extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'Form';
        this.state = {
          closeSider:false
        }
    }

    componentWillMount() {

    }
    getForm=(data)=>{
      alert(JSON.stringify(data))
    }
    toggleSider=()=>{
      let {closeSider}=this.state;
      this.setState({closeSider:!closeSider})
    }
    fileSelect1(e) {
      console.log(this)
      var files = this.files;
      console.log(file)
      for(var i = 0, len = files.length; i < len; i++) {
          var f = files[i];
          html.push(
              '<p>',
                  f.name + '(' + (f.type || "n/a") + ')' + ' - ' + f.size + 'bytes',
              '</p>'
          );
        }
     
    } 
    render() {
      let options=[
        {name:"选项1",value:1},
        {name:"选择2",value:2}
      ];
      let options1=[
        "选项1","选择2"
      ];
      let imgValue=[
        {name:"tes1",src:"http://7xp4uq.com1.z0.glb.clouddn.com/2016-11-21_5832642385f59.png"},
        {name:"tes2",src:"http://7xp4uq.com1.z0.glb.clouddn.com/2016-11-21_5832642385f59.png"}
      ];

      let lianData=[
        {
          name:"group1",
          url:"/system/bank-area.do",
          keyName:'parent_id'
        },
        {
          name:"group2",
          url:"/system/bank-area.do",
          keyName:'parent_id'
        },
        {
          name:"group3",
          url:"/system/bank-area.do",
          keyName:'parent_id'
        }
      ]
      let formData=[
        {
          label:"ceshi",
          type:"text",
          name:"a1",
          value:123213
        }
      ]
      let {closeSider}=this.state;
        return (
           <div className={"content-all-wrap "+(closeSider?"close-sider":"")}>

            <Sider></Sider>
            <AppBar onClickToggle={this.toggleSider}></AppBar>
            <div className="main-wrap " >
            <h1 className="fs18 pb15 pl5">添加文字</h1>
          <div className="main " >
            
            <Form className="l" formStyle="horiz" onSubForm={this.getForm} formRandData={formData}>
              <FormCtrl label="长文本" type="textarea" defaultValue="ASDAS" />
              <FormCtrl label="标签" type="tags" options={options} />
              
              {/* 
              <FormCtrl label="密码"  max={12} required={true} type="password"  exp={{reg:/^[0-9]*$/,info:"请输入纯数字"}} placeholder="请在这里输入密码" />
              <FormCtrl label="选项1" type="radio" checkradioStyle="btn" defaultValue={[2]}  inline={true} options={options} />
              <FormCtrl label="选项2" type="checkbox" options={options} />
              <FormCtrl label="下拉筛选"  search={true} type="select-multiple" options={options} />
              <FormCtrl name="test" label="单图上传"  type="file-single" defaultValue="http://7xp4uq.com1.z0.glb.clouddn.com/2016-11-12_58266f122a3d1.jpg" options={options} />
              <FormCtrl label="多图上传"  type="file-group"  defaultValue={imgValue} />
              <FormCtrl label="多级联动"    type="cascader" config={lianData} />
              <FormCtrl label="时间选择器"  type="time-select-input"  />
              <FormCtrl label="手机端内容设置" name="phoneCont" type="set-mobile-cont"  />*/}
            </Form>
          </div></div>
          </div>
        )
    }
}




export default Wrap;
