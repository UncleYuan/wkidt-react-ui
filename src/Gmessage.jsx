var React = require('react');
var Toast = require('./Toast');
var Process = require('./Process');
var Gmessage=React.createClass({
  getDefaultProps:function(){
      return {
        value:"",
        url:"/verify-code.do",
        postData:''
        };
    },
  getInitialState:function(){

      return {
        canClick:true,
        overtime:60

      };
  },
  componentWillUnmount:function() {
     clearInterval(this.timer);     
  },
  timer:null,
  setTimeFn:function(){
        this.setState({canClick:false});
    this.timer=setInterval(()=>{
          this.setInterFn();
        },1000);
  },
  goClick:function(e){
    if(this.props.goClick && this.state.canClick){
  
      this.props.goClick(e,this.setTimeFn)
        
      return;
    }
    var _this=this;
    Process.show();
    $.post('/Member/Public/verify_code',this.props.postData,function(data){
      Process.Close();
      Toast.show({msg:data.info})
      if(data.code=="SUCCESS"){
        _this.setState({canClick:false});
        _this.timer=setInterval(function(){
          _this.setInterFn();
        },1000);
      }
      if(_this.props.callback) _this.props.callback(data);
    },'json');
  },
  setInterFn:function(){
    if(this.state.overtime==1){
      clearInterval(this.timer);
      this.setState({canClick:true,overtime:60});
    }else{
      this.setState({overtime:this.state.overtime-1});
    }
  },
  render: function () {
    var canClick=this.state.canClick;
    var defaultClass = this.props.gClass?this.props.gClass:" base-btn btn  pt5 pb5 pl15 pr15 fs12"
    return (
        <div className="inline-block" >
           <span className={defaultClass} onClick={this.goClick} style={{display:(canClick?"inline-block":"none")}}>点击获取验证码</span>
           <span className={defaultClass} style={{display:(!canClick?"inline-block":"none"),opacity:0.5}}>{this.state.overtime}后可重新发送</span>
        </div>
        )
  }
})

module.exports = Gmessage;


