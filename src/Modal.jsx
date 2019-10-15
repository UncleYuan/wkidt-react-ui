/** 
* @fileOverview react Modal组件封装 
* @author <a href="">pan</a> 
* @version 0.1 
*/ 
/** 
* @author pan 

* @description react Modal组件封装  
* @since version 0.2 
* @param  Props {String} show             设置modal显示隐藏,如果从父级传参，需配合onClose修改状态
* @param  Props {String} title            标题  
* @param  Props {Function} onClose        当窗口关闭时的事件回调
* @param  Props {String} showClass        modal显示时，添加的样式
* @param  Props {String} hideClass        modal隐藏时，添加的样式
*/ 

import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import tools from '../tools/public_tools';
import Transition from "react-addons-css-transition-group" ;
class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show:props.show,
    }
    this.displayName="Modal";
  }
  static defaultProps={ 
    show:false,
    title:"新窗口",  
    showClass:'fadeInUp',
    hideClass:'fadeOutUp',
    sizeClass:'',
    onClose:function(){}
  };
  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.show!=this.state.show){
      this.setState({show:nextProps.show});
    }
  }
  componentDidMount() {
  }
  closeModal=()=>{
    this.setState({show:false});
    if(this.props.onHide){
      this.props.onHide();
    }
    this.props.onClose();
    
  }
  render() {  
      let {show}=this.state;
      let {showClass,title,children,sizeClass,footer,zIndex}=this.props;
      let docBody=document.body;
      let style={display:show?"block":"none"};
      if(zIndex) style.zIndex=zIndex;
      let bgClass=show?"in":"";
      let dialogClass=show?showClass:"hide";
      dialogClass=dialogClass+" "+sizeClass;
      let h=docBody.offsetHeight< docBody.scrollHeight?docBody.scrollHeight:docBody.offsetHeight;
           h=document.documentElement.clientHeight;
      let height={height:h };
      return (
        <Transition transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={500}  >
          <div className={"modal "}  style={style}>
              <div className={"modal-backdrop "+bgClass} style={height}></div>
              <div className="modal-dialog-wrap">
                <div className={"modal-dialog animated "+dialogClass} >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="tit-text">{title}</h4>
                            <div className="bootbox-close-button close"  onClick={this.closeModal}>×</div>
                        </div>
                        <div className="modal-body" >
                          {children}
                        </div>
                        {footer?(<div className="modal-footer">{footer}</div>):""}
                    </div>
                </div>
              </div>
          </div>
        </Transition>
    )
  }
}


var containerDOM=null;
var config={};
var doc=document;
Modal.show = function (opt={child:"",conf:{}}) {
  let conf=opt.conf?opt.conf:{};
  let child=opt.child?opt.child:'';
  conf.open=true;
  conf.onClose=()=>{
    Modal.close();
  }
  config=conf;
  if (!containerDOM) {
    containerDOM = doc.createElement('div');
    doc.body.appendChild(containerDOM);
  }
  ReactDOM.render(React.createElement(Modal,conf,child),containerDOM);
 
};
Modal.close = function () {
  config.open=false;
  ReactDOM.render(React.createElement(Modal,config),containerDOM);
  setTimeout(function(){
    ReactDOM.render(<div/>,containerDOM);
  },500)
};
export default Modal;


