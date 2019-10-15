var React = require('react');
var tools = require('../tools/public_tools');
var initState={
    s:{
      x:0,
      y:0
    },
    m:{
      x:0,
      y:0
    },
    n:{
      left:0,
      top:0,
      width:0,
      height:0
    },
    keyDown:false,
    target:"drag-bar"
  }
var DragBox = React.createClass({
  getDefaultProps:function(){
      return {
        shape:{
          left:0,
          top:0,
          width:100,
          height:100
        },
        className:"",
        wrapWidth:320,
        minWidth:5,
        minHeight:5,
        name:"DragBox"+(new Date()).valueOf(),
        minLeft:0,
        minTop:0,
        onItemChange:function(){

        }
      };
  },
  getInitialState: function() {
      return {
        left:this.props.shape.left,
        top:this.props.shape.top,
        width:this.props.shape.width,
        height:this.props.shape.height
      };
  },
  componentWillReceiveProps:function(nextProps){

    if(nextProps.shape!=this.state){
      this.setState({
        left:nextProps.shape.left,
        top:nextProps.shape.top,
        width:nextProps.shape.width,
        height:nextProps.shape.height,
      });
    }

  },
  componentWillMount:function() {
    this.mouseState.keyDown=false;
       
  },
  componentDidMount: function () {
    
  },
  componentWillUnmount: function () {
   
  },
  mouseState:tools.deepCopy(initState),
  filterShape:function(type,turnStyle){
    switch(type){
      case "leftRight":
      if(turnStyle.left+turnStyle.width< this.props.wrapWidth && turnStyle.width >=this.props.minWidth && turnStyle.left >= this.props.minLeft){
          this.setState({width:turnStyle.width,left:turnStyle.left})
          this.props.onItemChange({name:this.props.name,data:this.state});
      }
      break;
      case "topBottom":
      if(turnStyle.top+turnStyle.height< this.refs.box.parentNode.offsetHeight && turnStyle.height >=this.props.minHeight && turnStyle.top >= this.props.minTop){
          this.setState({height:turnStyle.height,top:turnStyle.top})
          this.props.onItemChange({name:this.props.name,data:this.state});
      }
      break;
      case "dragBar":
        var newObj={};

        if(turnStyle.top < this.props.minTop){
          newObj.top=this.props.minTop;
        }else if(turnStyle.top+turnStyle.height> this.refs.box.parentNode.offsetHeight){ 
          newObj.top=this.refs.box.parentNode.offsetHeight-turnStyle.height;
        }else {
          newObj.top=turnStyle.top;
        }

        if(turnStyle.left < this.props.minLeft){
          newObj.left=this.props.minLeft;
        }else if(turnStyle.left+turnStyle.width > this.props.wrapWidth){ 
          newObj.left=this.props.wrapWidth-turnStyle.width;
        }else {
          newObj.left=turnStyle.left;
        }
      
        this.setState(newObj) 
        this.props.onItemChange({name:this.props.name,data:this.state});
        break;
    }
  },
  moveFnObj:{
    "left":function(){
      var width=this.mouseState.n.width;
      var left=this.mouseState.n.left;
      var lang=this.mouseState.s.x-this.mouseState.m.x;
      width=width+lang;
      left=left-lang; 
      this.filterShape("leftRight",{left:left,width:width})
      
    },
    "right":function(){
      var width=this.mouseState.n.width;
      var left=this.mouseState.n.left;
      var lang=this.mouseState.s.x-this.mouseState.m.x;
      width=width-lang;
      this.filterShape("leftRight",{left:left,width:width})
    },
    "top":function(){

      var height=this.mouseState.n.height;
      var top=this.mouseState.n.top;
      var lang=this.mouseState.s.y-this.mouseState.m.y;
      height=height+lang;
      top=top-lang; 
      this.filterShape("topBottom",{height:height,top:top})
    },
    "bottom":function(){
      var height=this.mouseState.n.height;
      var top=this.mouseState.n.top;
      var lang=this.mouseState.s.y-this.mouseState.m.y;
      height=height-lang;
      this.filterShape("topBottom",{top:top,height:height})
    },
    "drag-bar":function(){
      var left=this.mouseState.n.left;
      var top=this.mouseState.n.top;
      var height=this.mouseState.n.height;
      var width=this.mouseState.n.width;
      var langX=this.mouseState.m.x-this.mouseState.s.x;
      var langY=this.mouseState.m.y-this.mouseState.s.y;

      this.filterShape("dragBar",{top:top+langY,left:left+langX,width:width,height:height})
    },
  },
  bindMove:function(e){
    this.onMouseMoveFn(e);
  },
  bindUp:function(e){
    this.onMouseUpFn(e);
  },
  onMouseDownFn:function(e){
    var e=e?e:window.event;
    e.stopPropagation();
    e.cancelBubble = true; 
    document.addEventListener('mousemove',this.bindMove,false);
    document.addEventListener('mouseup',this.bindUp,false);
    this.mouseState.s={
      x:e.pageX,
      y:e.pageY
    }
    this.mouseState.target=e.target.className;
    
    this.mouseState.n={
      width:this.state.width,
      height:this.state.height,
      left:this.state.left,
      top:this.state.top
    }
     
    
    this.mouseState.keyDown=true;
    
  },
  onMouseMoveFn:function(e){
    var e=e?e:window.event;
    e.stopPropagation();
    e.cancelBubble = true;  

    if(this.mouseState.keyDown){
      this.mouseState.m={
        x:e.pageX,
        y:e.pageY
      }
      if(this.moveFnObj[this.mouseState.target])this.moveFnObj[this.mouseState.target].bind(this)();
    }   
  },
  onMouseUpFn:function(e){
    var e=e?e:window.event;
    if(this.mouseState.keyDown){
      document.removeEventListener('mousemove',this.bindMove,false);
      document.removeEventListener('mouseup',this.bindUp,false);
      this.mouseState=tools.deepCopy(initState);
    }
    
  },
  render: function() {

    var style={left:this.state.left,top:this.state.top,width:this.state.width,height:this.state.height}
    console.log(style)
    return (
        <div ref="box" style={style} onMouseDown={this.onMouseDownFn}  className={"drag-box "+this.props.className} >
          {this.props.children}
          <div className="top"></div>
          <div className="right"></div>
          <div className="bottom"></div>
          <div className="left"></div>
          <div className="drag-bar"></div>
        </div>
    )
  }
});


module.exports = DragBox;


