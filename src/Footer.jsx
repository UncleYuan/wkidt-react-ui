import React, { Component, PropTypes } from 'react';


const url=['/','/reward.html','/member.html']
class Footer extends Component {
	constructor(props) {
	    super(props);
	}
	goUrl(i){
		location.href=url[i];
	}
	render(){
		return(
			<div id="footer" className="">
			        <div  className=" ub">
			            <div className="ub ub-f1 ">
			                <div onClick={this.goUrl.bind(this,0)} className={this.props.active==0?"footer-btn active":"footer-btn"}>
			                    <div className="icon-licai iconfont tc"></div>
			                    <div className="menu-text fs10 pb5">投资理财</div>
			                </div>
			            </div>
			            <div onClick={this.goUrl.bind(this,1)} className="ub ub-f1 ">
			                <div className={this.props.active==1?"footer-btn active":"footer-btn"}>
			                    <div className="iconfont icon-zengzhi-copy tc"></div>
			                    <div className="menu-text fs10 pb5">增值活动</div>
			                </div>
			            </div>
			            <div onClick={this.goUrl.bind(this,2)} className="ub ub-f1">
			                <div className={this.props.active==2?"footer-btn active":"footer-btn"}>
			                    <div className=" iconfont icon-geren  tc"></div>
			                    <div className="menu-text fs10 pb5">我的账户</div>
			                </div>
			            </div>
			        </div>
			    </div>
			
		)
	}

}

Footer.PropTypes = { active: React.PropTypes.number };
Footer.defaultProps = { active: false };


export default Footer;