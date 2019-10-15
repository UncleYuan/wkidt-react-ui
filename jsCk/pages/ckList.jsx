
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest  from 'reqwest';
import Modal from '../../src/Modal';
import Pager from '../../src/Pager';
import Form from '../../src/Form';
import Loading from '../../src/Loading';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';

import FormCtrl from '../../src/FormCtrl';
import FileSingle from '../../src/FileSingle';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import {CheckRadio} from '../../src/CheckRadio';
import {InputGroup} from '../../src/InputGroup';

import {FileGroup} from '../../src/FileGroup';


const FormDataPro =  //审核探客
  [ 


  {
    "label": "状态选择",
    "value":[],
    "inline":true,
    "type":"radio",
    "options":[
      {
        name:"验车完成",
        value:1
      },
      {
        name:"未合格",
        value:0
      }
    ]
  },
  {
    "label": "车辆评价",
    "value":[],
    "inline":true,
    "type":"radio",
    "options":[
      {
        name:"优",
        value:1
      },
      {
        name:"普通",
        value:0
      }
    ]
  },
  {
    "name": "remarks",
    "label": "验车综评",
    "value": "",
    "type": "textarea"
  }
]

const formData1 =  //审核探客
  [ 


  {
    "label": "车辆编号",
    "value":[],
    "type":"select-single",
    "options":[
      {
        name:"287341621",
        value:1
      },
      {
        name:"287341622",
        value:0
      }
    ]
  },
  {
    "label": "仓库编号",
    "value":[],
    "type":"select-single",
    "options":[
      {
        name:"C1234",
        value:1
      },
      {
        name:"C1232",
        value:0
      }
    ]
  },
  {
    "label": "仓库管理员",
    "value":[],
    "type":"select-single",
    "options":[
      {
        name:"B2323",
        value:1
      },
      {
        name:"B2321",
        value:0
      }
    ]
  },
  {

    "label": "附件",
    "value": "",
    "type": "file-group"
  },
  {
    "name": "remarks",
    "label": "备注",
    "value": "",
    "type": "textarea"
  }
]

const defaultProps={ 
};
class DetailChuPing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow:[false,false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      len:30, //分页长度
      logList:[],
      searchTxt:"",
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.openContId=""
  }
  componentWillReceiveProps(nextProps) {


  }

  
  componentWillMount() {
      
  }
  
  componentDidMount() {
    this.upData();

  }
  textChange=(name,val)=>{
    let setState={};
    setState[name]=val;
    this.setState(setState);
    if(name=="len"){
      clearTimeout(this.timer);
      let page=this.state.page;
      page.page_index=1;
      this.setState({
        page:page
      })
      this.timer=setTimeout(()=>{
        this.upData();
      },500)
    }
  }
  upData=(callback)=>{ //更新表单数据
    let {page,len,searchTxt}=this.state;
    this.setState({
      loading: true
    })

    this.setState({
             rendData:[],
             selArr:[],
             page: { 
              page_count: 0, 
              page_index: 1, 
              record_count: 0 
              },
             loading: false
          })
    return;
    fetch('/ads/ads_audit_list.do?'+ tools.parseParam({title:searchTxt,page:page.page_index,len}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        if(data.code=="SUCCESS"){
          this.setState({
             rendData: data.data,
             page: data.page,
             selArr:[],
             loading: false
          })
          if (callback) callback();
        }else if(data.code=="NO_DATA"){
          this.setState({
             rendData:[],
             selArr:[],
             page: { 
              page_count: 0, 
              page_index: 1, 
              record_count: 0 
              },
             loading: false
          })
        }
        if (callback) callback();
      });
  
  }


  toggleModal=(i)=>{ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
  }
  
  
  onSetSelIdx=(idx)=>{ //选择分页回调
    let page = this.state.page;
    page.page_index = idx;
    this.setState({
      page: page
    });
    this.upData();
  }
  validChecked=(id)=>{
    return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
  }
  validCheckedAll=()=>{
    let rendData = this.state.rendData;
    for (let i in rendData) {
      if (tools.indexOf(this.state.selArr, rendData[i].id) < 0) {
        return false;
      }
    }
    return true;
  }
  toggleChecked=(id)=>{
    let selArr = this.state.selArr;
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

    if (this.state.selArr.length == 0) {
      for (let i in this.state.rendData) {
        newArr.push(this.state.rendData[i].id);
      }
    }
    this.setState({
      selArr: newArr
    });
  }
  
  
  
  
  sureDelItem=(id)=>{
      
      let {page}=this.state;

      fetch('/explorer.do', {
        method: "DELETE",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam({
          ids:id.join(',')
        })
      }).then(response => response.json())
      .then((data)=>{
        Modal.close();
        if (data.code == "SUCCESS") {
          page.page_index = 1;
          this.setState({
            page
          })
          this.upData();
        }
        Toast.show({
          msg: data.info
        })
      });
  }
  removeItem=(id)=>{ //删除数据
    id = id != "all" ? id : this.state.selArr;
    if (id.length == 0) {
      Alert.show({
        cont: "请选择删除对象"
      })
      return;
    }
    Modal.show({
            child:<div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof(id)!="string"?id.join(','):id}</span> 的探客文章？</div>,
            conf:{
              footer:(
                <a href="javascript:;"  onClick={()=>{ 
                  this.sureDelItem(id)
               }} className="btn btn-info">确定删除</a>)
            }
            
        })
    
  
  }
  openLogs=(id)=>{
    this.openContId=id;
    this.toggleModal(0)
    fetch('/ads/ads_audit_record.do?'+tools.parseParam({ ads_id: id}), {
        method: "get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
        if (data.code == "SUCCESS") {
          this.setState({logList:data.data})
        }else {
          this.setState({logList:[]})
        }
    });
  }
  openSh=(id)=>{
    this.toggleModal(1);
    let formData=tools.deepCopy(FormDataPro);

    this.setState({formData:formData||[]})
  }
  subSh=(data)=>{
    Process.show();
    fetch(`/ads/ads_audit/${data.id}.do`, {
        method: "put",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam( {
          status: data.status[0],
          remarks:data.remarks,
          id:data.id
        })
      }).then(response => response.json())
      .then((data)=>{
        Process.Close();
        Toast.show({msg:data.info});
        this.toggleModal(1);
    });
  }
 
  render() {
    let {rendData,loading,formData,modalShow,page,len}=this.state;

    let cont=rendData.map(function(obj, idx) {
      return (<tr key={idx}>
                <td>
                  <input name="select" checked={this.validChecked(obj.id)} onClick={()=>{ this.toggleChecked(obj.id)}}  className="select-box"  type="checkbox" />
                </td>
                <td>{obj.id}</td>
                <td><a href={"#/ads/details/edit/"+obj.id} className="">{obj.name}</a></td>
                <td>
                  {obj.description}
                </td>
                <td>
                <div className="btn-group mb15">
                    <a href={"#/ads/details/edit/"+obj.id} className="btn btn-sm btn-info">修改资料</a>
                    <a href="javascript:;" onClick={ ()=>{ this.openLogs(obj.id)}} className="btn btn-sm btn-default">关闭订单</a>
                    <button className="btn btn-warn" onClick={()=>{ this.openSh(obj.id)}} type="button">审核</button>
                </div>
            </td>
        </tr>);
    }, this)
    return (
      <div>
            
            <div className="wrapper">
                <section  className="p15 white-bg">
                    <div>
                        <div className="row">
                          <div className=" col-md-9">
                           {/* <a className="fr btn btn-info fs13" href="#/cp/add.html" >添加申请</a>*/}
                            <h4 className="fs20">出入库管理列表</h4>
                           
                            {/*<button  className="btn btn-default" onClick={ ()=>{ this.removeItem("all")}} type="button">删除所选资源</button>*/}
                       
                          </div>
                          <div className=" col-md-3 pb10">
                             <InputGroup placeholder="请在这里输入搜索的内容" value={this.state.searchTxt}  barHtml={<button className="btn btn-info fs12" onClick={()=>{ this.upData()}} type="button">搜索</button>} onValueChange={(val)=>{ this.textChange("searchTxt",val)}}></InputGroup>
                            
                          </div>
                        </div>
                      <div>
                        <Modal title="添加处置记录"   show={modalShow[1]} onClose={()=>{  this.toggleModal(1)}}>
                          {modalShow[1]? <Form formStyle="ver" formRendData={formData1} onSubForm={this.subSh} />:""}
                        </Modal>
                         <div className="table-responsive fixed-loading">
                                    <table className="table mt20 table-striped ">
                                        <thead>
                                            <tr>
                                                <th>资产编号</th>
                                                <th>提交时间</th>
                                                <th>申请</th>
                                                <th>车型</th>
                                                
                                                <th>店</th>
                                                <th>资产状态</th>
                                                <th>订单状态</th>
                                                
                                                <th>入库时间</th>
                                                <th>仓库编号</th>
                                                
                                                <th>经手人</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr >
                                                <td><a href="#/zc.html" className="base-color">281732</a></td>
                                                <td>10-16  13:16</td>
                                                <td>新单入库</td>
                                                <td>2015款宝马310LI 豪华版</td>
                                                
                                                <th>广州天河极速车行</th>
                                                <td>一期在押</td>
                                                <td>待放款</td>
                                                <td>10-16  13:16</td>
                                                <td>C21376</td>
                                                
                                                <td>李辉</td>
                                                <td>关闭订单</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                          </div>
                    </div>
                </section>
            </div>
        </div>

    );
  }
}

export default DetailChuPing;