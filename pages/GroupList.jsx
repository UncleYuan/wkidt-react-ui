import React, {
  Component,
  PropTypes
} from 'react';
import Modal from '../src/Modal';
import Pager from '../src/Pager';

import Loading from '../src/Loading';

import CheckRadio from '../src/CheckRadio';
import DateSelect from '../src/DateSelect';

import tools from '../tools/public_tools';

var deepCopy = tools.deepCopy;
class MainCont extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'MainCont';
        this.state = {
        	loading: true, 
        	modalShow:false, 
        	rendData: [], 
        	selArr: [], 
        	easy_time:"",
        	start_time:"",
        	end_time:"",
        	setTime:false,
        	page: { 
        	  page_count: 0, 
        	  page_index: 1, 
        	  record_count: 0 
        	},
        	len: 10, 
        	qxData:[]
        	
        };
        this.timer = null;
    }
    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
      this.upData();

    }

    upData(callback) { //更新表单数据
      let _this = this;
      let postData = {
        page:this.state.page.page_index,
        len:this.state.len,
        type:this.state.type,
        easy_time:this.state.easy_time,
        start_time:this.state.start_time,
        end_time:this.state.end_time
      }
      if(this.state.setTime){
        if(!this.state.start_time||!this.state.end_time){
          return;
        }else{
          delete postData.easy_time;
        }
      }
      if(typeof(postData.easy_time)!="undefined"){
        delete postData.start_time;
        delete postData.end_time;
      }
      fetch('/member/group_list.do?'+tools.parseParam(postData), {
        method:"get",
        credentials:'same-origin'
      }).then(response => response.json())
      .then((data)=>{
         data.data=data.data?data.data:[];
            if (data.code == 'SUCCESS') {
              _this.setState({
                rendData: data.data,
                page: data.page,
                loading: false
              })
              if (callback) callback();
            }else if(data.code == 'NO_DATA'){
              _this.setState({
                loading: false,
                listData: [],
                page:{
                "record_count":0,
                "page_count": 1,
                "page_index": 1
              }
              })
            }
      });
      
    }

    onSetSelIdx=(idx)=>{ //选择分页回调
      let page = this.state.page;
      page.page_index = idx;
      this.setState({
        page: page
      });
      this.upData();
    }

    validChecked=(id)=> {
      return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
    }

    validCheckedAll() {
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

    setEasyTime=(val)=>{
      this.setTimeTurn(false)
      this.setState({easy_time:val});
      setTimeout(function(){
        this.upData();
      }.bind(this),100)
      
    }
    setTimeTurn=(status)=>{
      let setData={
        setTime:status
      };
      if(status){
        setData['easy_time']=""
      }
      this.setState(setData);
    }
    changeDate=(name,date)=>{
      let setData={}
      setData[name]=date;
      this.setState(setData);
       setTimeout(function(){
        this.upData();
      }.bind(this),100)
    }

    render() {

      var cont = this.state.rendData.map(function(obj, idx) {
        var date = new Date(obj.add_time/1000);
        var Y = date.getFullYear()+'-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds(); 
        return (
          <tr key={idx}>
                  <td>
                    <input 
                      name="select" 
                      checked={this.validChecked.bind(this,obj.id)()} 
                      onClick={this.toggleChecked.bind(this,obj.id)}  
                      className="select-box"  
                      type="checkbox" 
                      />
                  </td>
                  <td>{obj.id}</td>
                  <td>{obj.name}</td>
                  <td>{obj.remark}</td>
                  <td>{obj.member_num}</td>
                  <td>
                  
              </td>
          </tr>
        );
      }, this)

      var LoadCont = this.state.loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
      return (
        <div>
              
              <div className="wrapper">
                  <section className="panel">
                
                      <div className="panel-body">
                          <div id="column-table">
                              <div className="table-responsive fixed-loading">
                                  <table className="table mt20 table-striped ">
                                      <thead>
                                          <tr>
                                              <th>
                                                  <input 
                                                    name="select" 
                                                    checked={this.validCheckedAll.bind(this)()} 
                                                    onClick={this.toggleCheckedAll.bind(this)}  
                                                    className="select-box" 
                                                    value="all" 
                                                    type="checkbox" 
                                                    />
                                              </th>
                                              <th>记录id</th>
                                              <th>组名</th>
                                              <th>备注</th>
                                              <th>会员数量</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {cont}
                                      </tbody>
                                  </table>

                                  {LoadCont}
                                  
                              </div>

                          </div>
                          <div className="pb15">
                                    <Pager 
                                      all_num={this.state.page.record_count} 
                                      all_page_num={this.state.page.page_count} 
                                      sel_index={this.state.page.page_index}  
                                      onSetSelIdx={this.onSetSelIdx} 
                                      />
                                  </div>
                      </div>
                  </section>
              </div>
          </div>

      );
    }
}

module.exports = MainCont;
