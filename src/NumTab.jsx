import React, {
  Component,
  PropTypes
} from 'react';
import tools from '../tools/public_tools';
let theTime=new Date();
const defaultProps={ 
  min:false,
  max:false,
  value:1,
  onChangeValue: function(){}
};
class NumTab extends Component {
  constructor(props) {
      super(props);
      let now=new Date();
      this.timer=null;
      this.speed=300;
      this.state = {
        loading:true,
        value:this.props.value,
      };
      
  }
  componentWillMount() {
    let _this=this;
  }

  componentWillReceiveProps(nextProps) {
   /* if(nextProps.value!=this.state.value){
      this.setState({value:nextProps.value});
    }*/
  }
  componentDidMount() {
    if(this.refs.scrollBox.addEventListener){
      this.refs.scrollBox.addEventListener('DOMMouseScroll',(event)=>{ this.scrollFunc(event); },false);
    }//W3C
    this.refs.scrollBox.onmousewheel=this.refs.scrollBox.onmousewheel=(event)=>{ this.scrollFunc(event); }//IE/Opera/Chrome  
  }
  scrollFunc=(event)=>{
    let scrollDelta=false;
    if (event&&event.preventDefault ) {
      event.preventDefault(); 
    }else{
      window.event.returnValue = false; 
    }
    if(event.wheelDelta){
      scrollDelta=event.wheelDelta;
    }else if(event.detail){
      scrollDelta=event.detail;
    }

    if(scrollDelta>0){
      this.turnBtnCli(1);
    }else if(scrollDelta < 0){
      this.turnBtnCli(-1);
    }
  }

  filterNum=(num)=>{
    return ((!this.props.max || this.props.max >= num) && (!this.props.min || num >= this.props.min));
  }
  turnBtnCli=(num)=>{

    let nextNum=this.state.value+num;
    if(this.filterNum(nextNum)){
      this.setState({value:nextNum});
      if(this.props.onChangeValue) this.props.onChangeValue(nextNum);
    }else{
      this.onMouseUpFn()
    }
  }
  setTimeFn=(num)=>{
    if(this.speed>50){
      this.speed-=50;
    }
    this.turnBtnCli(num)
    this.timer=setTimeout(()=>{
      this.setTimeFn(num)
    },this.speed)
  }
  onMouseDownFn=(num)=>{
    this.setTimeFn(num)
  }
  onMouseUpFn=()=>{
    this.speed=300;
    clearTimeout(this.timer);
  }
  change=()=>{
    let value=this.refs.scrollBox.value;
    if(!isNaN(value) && this.filterNum(value)){
      if(this.props.onChangeValue) this.props.onChangeValue(parseInt(value));
      this.setState({value:parseInt(value)})
    }
  }
  render(){
    let state=this.state;
    return(
      <div className="turn-num">
        <a href="javascript:;" className="turn-btn" onMouseUp={()=>{ this.onMouseUpFn(); }} onMouseDown={()=>{ this.onMouseDownFn(+1)  }}>+</a>
        <input ref="scrollBox" onChange={this.change} className="turn-txt" value={this.state.value} title="滑动滚轮可修改" />
        <a href="javascript:;" className="turn-btn" onMouseUp={()=>{ this.onMouseUpFn(); }} onMouseDown={()=>{ this.onMouseDownFn(-1)  }}>-</a>
      </div>
      

      
    )
  }

}

NumTab.defaultProps = defaultProps;
export default NumTab;