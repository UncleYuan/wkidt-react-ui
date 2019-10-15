import React, {
  Component,
  PropTypes
} from 'react';
import Modal from '../src/Modal';
import Pager from '../src/Pager';

import Loading from '../src/Loading';

import CheckRadio from '../src/CheckRadio';
import { TimeSelectInput } from '../src/TimeSelectInput';
import { InputGroup } from '../src/InputGroup';
import tools from '../tools/public_tools';
import Toast from '../src/Toast';


const deepCopy = tools.deepCopy;

class MainCont extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'MainCont';
    this.state = {
      loading: true,
      modalShow: false,
      rendData: [],
      selArr: [],
      easy_time: "",
      start_time: "",
      end_time: "",
      setTime: false,
      page: {
        page_count: 0,
        page_index: 1,
        record_count: 0
      },
      len: 10,
      len: 25,
      searchTxt: ""
    }
    this.timer = null;
  }
  componentDidMount() {
    this.upData();

  }

  textChange(name, val) {
    let setState = {};
    setState[name] = val;
    this.setState(setState, () => {
      if (name == "len") {
        let {page} = this.state;
        page.page_index = 1;
        this.setState({
          page: page
        })
        this.upData();
      }
    });

  }

  upData(callback) { //更新表单数据
    let _this = this;
    let {page, len, type, easy_time, start_time, end_time, searchTxt, setTime} = this.state;
    let postData = {
      page: page.page_index,
      len,
      type,
      easy_time,
      start_time,
      end_time,
      keyword: searchTxt
    }
    if (setTime) {
      if (!start_time || !end_time) {
        return;
      } else {
        delete postData.easy_time;
      }
    }
    if (typeof (postData.easy_time) != "undefined") {
      delete postData.start_time;
      delete postData.end_time;
    }
    fetch('/merchant.do?' + tools.parseParam(postData), {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        data.data = data.data ? data.data : [];
        if (data.code == 'SUCCESS') {
          _this.setState({
            rendData: data.data,
            page: data.page,
            loading: false
          })
          if (callback) callback();
        } else if (data.code == 'NO_DATA') {
          _this.setState({
            loading: false,
            listData: [],
            page: {
              page_count: 0,
              page_index: 1,
              record_count: 0
            }
          })
        }
      });


  }

  toggleModal() { //切换弹窗显示
    this.setState({
      modalShow: !this.state.modalShow
    })
  }
  toggleTable() {
    this.setState({
      showTable: !this.state.showTable
    })
  }

  onSetSelIdx = (idx) => { //选择分页回调
    let page = this.state.page;
    page.page_index = idx;
    this.setState({
      page: page
    });
    this.upData();
  }
  validChecked(id) {
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
  toggleChecked(id) {
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

  toggleCheckedAll() {
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

  setEasyTime(val) {
    this.setTimeTurn(false)
    this.setState({ easy_time: val });
    setTimeout(() => {
      this.upData();
    }, 100)
  }

  setTimeTurn(status) {
    let setData = {
      setTime: status
    };
    if (status) {
      setData['easy_time'] = ""
    }
    this.setState(setData);
  }
  changeDate = (name, date) => {
    let setData = {}
    setData[name] = date;
    this.setState(setData);
    setTimeout(() => {
      this.upData();
    }, 100)
  }
  turnFreeze = (id, state, idx) => {

    fetch(`/merchant/ban/${id}/${state}.do`, {
      method: "post",
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(response => response.json())
      .then((data) => {
        Toast.show({ msg: data.info })
        if (data.code == 'SUCCESS') {
          let {rendData} = this.state;
          rendData[idx].is_banned = state;
          this.setState({
            rendData
          })

        }
      });
  }

  openBan = (uid,idx) => {
    Modal.show({
            title:<div className="fs20">禁用商家</div>,
            child: <div className="fs20 tc">请选择禁用商家选项</div>,
            conf: {
              footer: (
                <div className>
                  <a href="javascript:;" onClick={() => { this.turnFreeze(uid,"1",idx);Modal.close(); } } className="btn btn-info">禁止商家登录</a>
                  <a href="javascript:;" onClick={() => {  this.turnFreeze(uid,"2",idx);Modal.close(); } } className="btn btn-warn">禁止商家登录和禁用商家内容</a>
                </div>
              )
            }
          })
  }
  render() {

    const cont = this.state.rendData.map((obj, idx) => {
      let date = new Date(obj.add_time / 1000);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return (
        <tr key={idx}>
          <td>
            {/* <input 
                    name="select" 
                    checked={this.validChecked.bind(this,obj.id)()} 
                    onClick={this.toggleChecked.bind(this,obj.id)}  
                    className="select-box"  
                    type="checkbox" 
                    />*/}
          </td>
          <td>{obj.uid}</td>
          <td><img className="w40 h40 br_100 mr10 vm" src={obj.avatar || "/admin/images/head.png"} alt="" />{obj.name}</td>
          <td>{obj.phone}</td>
          <td>{obj.add_time}</td>
          <td>{obj.is_banned == "0" ? "否" : "是"}</td>

          <td>
            <div className="btn-group">
              <a href={"#/merchant/details/edit/" + obj.uid} className="btn btn-sm btn-info">更新商家</a>
              {/*<a href="javascript:;" onClick={()=>{ this.turnFreeze(obj.uid,(obj.is_banned=="0"?"1":"0"),idx); }} className="btn btn-sm btn-default">{obj.is_banned=="0"?"禁用":"解禁"}商家</a>*/}
              <a href="javascript:;" onClick={() => { obj.is_banned == "0" ? this.openBan(obj.uid, idx) : this.turnFreeze(obj.uid, 0, idx) } } className="btn btn-sm btn-default">{obj.is_banned == "0" ? "禁用" : "解禁"}商家</a>
            </div>
          </td>
        </tr>
      );
    }, this)

    const LoadCont = this.state.loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
    return (
      <div>

        <div className="wrapper">
          <section className="panel">


            <div className="panel-body">
              <div className="row mt15">
                <div className=" col-md-9">
                  <div className=" mb15">
                    <a href="#/merchant/details/add" className="btn btn-info">添加商家</a>
                    { /*  <button  className="btn btn-default" onClick={ ()=>{ this.removeItem("all")}} type="button">删除所选资源</button>*/}
                  </div>
                </div>
                <div className=" col-md-3 mb10">
                  <InputGroup placeholder="请在这里输入搜索的内容" value={this.state.searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => { this.upData() } } type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) } }></InputGroup>
                </div>
              </div>
              <div className="mt10">
                <div className="table-responsive fixed-loading">
                  <table className="table mt20 table-striped ">
                    <thead>
                      <tr>
                        <th>
                          {/*<input 
                                                  name="select" 
                                                  checked={this.validCheckedAll.bind(this)()} 
                                                  onClick={this.toggleCheckedAll.bind(this)}  
                                                  className="select-box" 
                                                  value="all" 
                                                  type="checkbox" 
                                                  />*/}
                        </th>
                        <th>商家ID</th>
                        <th>商家名</th>
                        <th>手机号码</th>
                        <th>添加时间</th>
                        <th>是否被禁</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cont}
                    </tbody>
                  </table>

                  {LoadCont}
                </div>
                <div className="pb15 pt15">
                  <div className="row">
                    <div className="col-sm-9 col-lg-10">
                      <Pager className="mb15"
                        all_num={this.state.page.record_count}
                        all_page_num={this.state.page.page_count}
                        sel_index={this.state.page.page_index}
                        onSetSelIdx={this.onSetSelIdx} />
                    </div>
                    <div className="col-sm-3  col-lg-2">
                      <InputGroup value={this.state.len} barHtml={<span className="btn gray-bg fs12">每页条数</span>} onValueChange={(val) => { this.textChange('len', val) } }></InputGroup>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    );
  }
}

module.exports = MainCont;