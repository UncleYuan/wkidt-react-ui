import React,{Component} from 'react';

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
import Panel from '../comp/Panel';
import Tags from '../../src/Tags';

class Index extends Component {
    constructor(props) {
        super(props);
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
    render() {
     
        return (
           <div >
              <div className="clearfix">
                <a href="javascript:;" className="btn btn-success fr fs11">大数据图表</a>
                <h1 className="fs18 pb15 pl5">总部</h1>
              </div>
              
              <div className="mb15">
                <Panel title="总信息" type="info" noWrap={true}>
                  <div className="p15 ">
                    <div className="row">
                      <div className="col-md-3 col-lg-2">
                        <img className="img-resize" src="https://og1r2adir.bkt.clouddn.com/2016-12-06_584673edae58c.jpg?imageView2/1/w/350/h/220" alt=""/>
                      </div>
                      <div className="col-md-9  col-lg-10">
                        <h5 className="fs20 mt10 mb10">2013款 宝马7系 740Li 豪华型</h5>
                        <div className="row ">
                          <div className="col-md-4 mb10">车辆状态：初评审核中</div>
                          <div className="col-md-4 mb10">车辆编号：未生成</div>
                          <div className="col-md-4 mb10">仓库编号：未入库</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
              <div className="m15">
                <div className="row proc-btn-wrap tj">
                  <div className="proc-btn-box">
                    <a href="javascript:;" className="btn-top">初评</a>
                    <p className="cont-bottom">已初评</p>
                  </div>
                  <div className="proc-btn-box">
                    <a href="javascript:;" className="btn-top">查档</a>
                    <p className="cont-bottom">查档通过</p>
                  </div>
                  <div className="proc-btn-box">
                    <a href="javascript:;" className="btn-top">验车</a>
                    <p className="cont-bottom">已验车</p>
                  </div>
                  <div className="proc-btn-box">
                    <a href="javascript:;" className="btn-top">终审</a>
                    <p className="cont-bottom">已终审</p>
                  </div>
                  <div className="proc-btn-box">
                    <a href="javascript:;" className="btn-top">身份核验</a>
                    <p className="cont-bottom">核验通过</p>
                  </div>
                  
                </div>
                
              </div>
              <div className="row state-overview">

                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >资产列表</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12"  >初评</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">

                      <div className="value fs18" >390</div>
                      <div className="title fs12" >查档</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >查档</div>
                    </div>
                  </div>
                </div>
              
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >终审</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >核验</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >放款</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >出入库</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >移库</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >收息管理</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >赎回管理</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >处置管理</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-6 col-sm-4 ">
                  <div className="panel green pointer" >
                    
                    <div className="">
                      <div className="value fs18" >390</div>
                      <div className="title fs12" >监控</div>
                    </div>
                  </div>
                </div>
              </div>

           </div>
        )
    }
}




export default Index;
