import React,{Component} from 'react';
import reqwest from 'reqwest';
/*var DropdownMenu = require('../components/DropdownMenu');*/


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showUpFile:false,
          imgList:this.props.imgArr
        }
  }
  static defaultProps= {
    username:"",
  }
  static contextTypes={
    userInfo: React.PropTypes.object,
  }
  toggleSider=()=>{
    let {onClickToggle}=this.props;
    if(onClickToggle)onClickToggle();

  }
  loginOut=()=>{
    reqwest({
          url: '/auth.do',
          method: 'DELETE',
          type:'json',
          success:  (result)=> {
            if(result.code=="SUCCESS"){
                location.href="/login.html"
            }
          }
      })
    
  }
  showRole=(data)=>{
    
    let arr=[];
    for(let i  in data){
      arr.push(data[i].name);
    }
    return arr.join(',')
  }
  render() {
    let {userInfo}=this.context;
    
    return (
    <div className="header-section">
        <a className="toggle-btn" onClick={()=>{ this.toggleSider() }}><i className="iconfont icon-caidan"></i></a>
        <div className="menu-right">
          <span className="fs16">{userInfo.username}</span><span className="desalt-color ml5">{this.showRole(userInfo.roles)}</span> <a href="javascript:;" className="fs12 base-color" onClick={this.loginOut}>[退出]</a>
        </div>
        </div>
    );
  }
}

export default  Header;


