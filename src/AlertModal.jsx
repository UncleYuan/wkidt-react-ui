var React = require('react');
var AlertModal = React.createClass({
	getDefaultProps:function(){
	    return {
        show:false,
        title:"系统提示",
        name:"AlertModal"+(new Date()).valueOf(),
        type:"checkbox",
        ifBindSP:false,
        showClass:'fadeInUp'
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
  componentDidMount: function () {
    if(this.props.ifBindSP&&PubSub){
      this.pubsub_token = PubSub.subscribe(this.props.name, function (evename,stateObj) {
        this.setState(stateObj);
      }.bind(this));
    }
  },
  componentWillUnmount: function () {
    if(this.props.ifBindSP&&PubSub){
      PubSub.unsubscribe(this.pubsub_token);
    }
  },
  closeModal:function(){
    this.setState({show:false});
    if(this.props.closeFn){
      this.props.closeFn();
    }
    if(this.props.onClose){
      this.props.onClose();
    }
  },
  btnClassJson:{
    warning:"assist",
    danger:"contrary",
    info:"base",
    def:"default"
  },
  emptyFn:function(){

  },
  getBtnHtml:function(){
    var allBtnHtml=[];

    var btnOptions=this.props.btnOptions;

    if(btnOptions){
        for(var i in btnOptions){
          var btnType=btnOptions[i].type?this.btnClassJson[btnOptions[i].type]:'default';
          var clickFn=btnOptions[i].onCli?btnOptions[i].onCli.bind(this,this.closeModal):this.closeModal;
          allBtnHtml.push(<span key={i} onClick={clickFn} className={btnType+"-btn btn"} >{btnOptions[i].txt||"关闭"}</span>)
        }
    }else{

      allBtnHtml.push(<span onClick={this.closeModal} className="default-btn btn">确定</span>)
    }
    
    return allBtnHtml;
  },
  render: function() {
      var style={display:this.state.show?"block":"none"};
      var bgClass=this.state.show?"in":"";
      var modelClass=this.state.show?this.props.showClass:"hide";

      return (
        <div style={style} className={"alert-modal "+bgClass}>
                  <div className={"alert-dialog "+modelClass}>
                    <div className="cont-up">
                      <div className="head">{this.props.title}</div>
                      <div className="cont">{this.props.children}</div>
                    </div>
                    <div className="btn-group">
                      {this.getBtnHtml()}
                    </div>
                  </div>
                </div>
        
          )
	}
});

module.exports = AlertModal;


