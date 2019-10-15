import React, { Component } from 'react';
import reqwest from 'reqwest';
import Select from '../../src/Select';
import tools from '../../tools/public_tools';
/*var DropdownMenu = require('../components/DropdownMenu');*/
const typeTree = function (result, parent_id, idname, parentidname) {
  let arr = [];

  for (let i in result) {
    if (result[i][(parentidname ? parentidname : "pid")] == parent_id) {
      result[i].children = typeTree(result, result[i][(idname ? idname : "id")], idname, parentidname);
      arr.push(result[i]);
    }
  }

  return arr;

}

const turnSelect = (data) => {
  let newArr = [];
  newArr.push({ name: '顶级', value: 0 });
  for (let i in data) {
    newArr.push({ name: data[i].nameTurn, value: data[i].id });
  }
  return newArr;
}

const turnList = (data, l, namekey = "name") => {

  l = parseInt(l);
  let arr = [];
  let txt = '';
  let addChild = '';
  for (let i = 0; i < l; i++) {
    if (i == 0) {
      txt += '├';
    }
    txt += '─';
  }

  for (let j in data) {
    data[j].nameTurn = txt + data[j][namekey];
    arr.push(data[j]);
    if (data[j].children && data[j].children.length > 0) {
      arr = arr.concat(turnList(data[j].children, l + 1, namekey));
    }
  }
  return arr;
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpFile: false,
      imgList: props.imgArr,
      agentData: props.agentData.length > 0 ? turnSelect(turnList(typeTree(props.agentData, '0', 'id', 'parent_id'), 1, 'agent_name')) : []
    }
  }
  static defaultProps = {
    username: "",
  }
  static contextTypes = {
    userInfo: React.PropTypes.object,
  }
  componentWillReceiveProps(nextProps) {
    let nextStr = JSON.stringify(nextProps.agentData);
    let propsStr = JSON.stringify(this.props.agentData);

    if (nextProps.agentData instanceof Array && nextStr != propsStr) {

      this.setState({ agentData: turnSelect(turnList(typeTree(nextProps.agentData, '0', 'id', 'parent_id'), 1, 'agent_name')) });
    }
  }
  toggleSider = () => {
    let { onClickToggle } = this.props;
    if (onClickToggle) onClickToggle();

  }
  loginOut = () => {
    reqwest({
      url: '/auth.do',
      method: 'DELETE',
      type: 'json',
      success: (result) => {
        if (result.code == "SUCCESS") {
          location.href = "/login.html"
        }
      }
    })

  }
  showRole = (data) => {

    let arr = [];
    for (let i in data) {
      arr.push(data[i].name);
    }
    return arr.join(',')
  }
  toggleCookie = (id) => {
    tools.setCookie("agent_id", id);
    location.reload();
  }
  turnVal=(val)=>{
    this.toggleCookie(val[0])
  }
  render() {
    let { userInfo } = this.context;
    let { agentData } = this.state;
    return (
      <div className="header-section">

        <a className="toggle-btn" onClick={() => { this.toggleSider() }}><i className="iconfont icon-caidan"></i></a>
        <div className="clearfix">
          <h1 className="fl logo hidden-xs">极速车贷资产管理系统</h1>
          <div className="fl pt7 ml10">
            {agentData.length > 0 ? <Select options={agentData} value={[userInfo.current_agent]} onValueChange={this.turnVal}  search={true}></Select> : null}
            {userInfo.current_agent<0?<span className="ml10 color-warn">警告：您无权访问当前层级代理，请切换其他的。</span>:null}
          </div>
          <div className="menu-right">  <a href="http://testadmin.jscdcn.com/data.html" target="_BLANK" className=" uba1 mr10 pt5 pb5 pl15 pr15 br15 fuzzy-border fs11 hidden-xs">大数据图表</a>

            <a href="#/user/editme" className="vm inline-block lh1 mr5"><img src={(userInfo.avatar||"/admin/img/noimg.png") + '?imageView2/1/w/36/h/36'} width="36" height="36" className="br100 hidden-xs" alt="" /></a>
            <span className="fs16">{userInfo.username}</span><span className="desalt-color ml5 fs12 hidden-xs">({this.showRole(userInfo.roles)})</span>  <a href="javascript:;" className="fs12 desalt-color" onClick={this.loginOut}>[退出]</a>
          </div>
        </div>

      </div>
    );
  }
}

export default Header;


