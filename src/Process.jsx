var React = require('react');
var ReactDOM = require('react-dom');
var ProcessComp = React.createClass({
  getDefaultProps:function(){
      return {
        show:false,
        title:"玩命加载中...",
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
      <div className={"load-container load-ring "+classShow}>
        <div className="loader"><div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
     
        <div className="tip-txt">{this.props.title}</div>
      </div>
      </div>
    )
  }
});


var containerDOM=null;
var Process={};
var config={}
Process.show = function (conf) {
  conf=conf||{};
  
  conf.show=true;
  config=conf;
  conf.onClose=function(){
    Process.Close();
  };
  if (!containerDOM) {
    containerDOM = document.createElement('div');
    document.body.appendChild(containerDOM);
  }
  ReactDOM.render(React.createElement(ProcessComp,conf),containerDOM);
};
Process.Close = function (content, type) {
  config.show=false;
  ReactDOM.render(React.createElement(ProcessComp,config),containerDOM);
  setTimeout(function(){
    ReactDOM.render(<div/>,containerDOM);
  },500)
};
module.exports = Process;

