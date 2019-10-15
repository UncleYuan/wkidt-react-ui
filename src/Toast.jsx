var React = require('react');
var ReactDOM = require('react-dom');
var ToastComp = React.createClass({
  getDefaultProps:function(){
      return {
        show:false,
        msg:"玩命加载中...",
      };
  },
  getInitialState: function() {
      return {
          show:this.props.show,
        };
  },
  componentWillReceiveProps:function(nextProps){
    if(nextProps.show!=this.state.show){
      this.setState({show:nextProps.show});
    }
  },
  render: function() {
    var classShow=this.state.show?"show":"hide";
    return (
      <div className={"toast "+classShow}>
        <div className="msg">{this.props.msg}</div>
      </div>
    )
  }
});


var containerDOM=null;
var Toast={};
var config={}
Toast.show = function (conf) {
  conf=conf||{};
  let closeTime=conf.closeTime||2000;
  conf.show=true;
  config=conf;
  conf.onClose=function(){
    Toast.Close();
  };
  if (!containerDOM) {
    containerDOM = document.createElement('div');
    document.body.appendChild(containerDOM);
  }
  ReactDOM.render(React.createElement(ToastComp,conf),containerDOM);
  setTimeout(function(){
    Toast.Close();
  },closeTime)
};
Toast.Close = function (content, type) {
  config.show=false;
  ReactDOM.render(React.createElement(ToastComp,config),containerDOM);
  setTimeout(function(){
    ReactDOM.render(<div/>,containerDOM);
  },500)
 
 
};
module.exports = Toast;

