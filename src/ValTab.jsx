import React, {
  Component,
  PropTypes
} from 'react';
import tools from '../tools/public_tools';
let theTime=new Date();

class ValTab extends Component {
  constructor(props) {
      super(props);
      let now=new Date();
      this.timer=null;
      this.speed=300;
      let firstIdx=parseInt(props.idx);
      console.log(props.value)
      if(props.value){
          let res=tools.filterObjVal(props.valueList,props.value,'val');
          if(res){ 
            firstIdx=res.idx;
          }
      }
      this.state = {
        loading:true,
        valueList:props.valueList,
        idx:firstIdx,
      };
      
  }
  static defaultProps={ 
    valueList:[],
    idx:0,
    value:"",
    onValueChange: function(){}
  };
  componentWillMount() {
    let _this=this;
  }
  turnValIdx=(val,list=false)=>{
    let {valueList,idx}=this.state;
    let {onValueChange}=this.props;
    let checkVal=tools.filterObjVal(list?list:valueList,val,'val');

    if(checkVal ){
      this.setState({idx:parseInt(checkVal.idx)});
 
      if(onValueChange) onValueChange(valueList[parseInt(checkVal.idx)]);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.valueList&&nextProps.valueList.toString()!=this.state.valueList.join(',').toString()){
      this.setState({valueList:nextProps.valueList,idx:0},()=>{
       this.turnValIdx(nextProps.valueList[0].val);
      });
    }else if(nextProps.value!=this.props.value){
       //this.turnValIdx(this.props.value);
    }
    
  }
  componentDidMount() {
    let {scrollBox}=this.refs;
    if(scrollBox.addEventListener){
      scrollBox.addEventListener('DOMMouseScroll',(event)=>{ this.scrollFunc(event); },false);
    }//W3C
    scrollBox.onmousewheel=scrollBox.onmousewheel=(event)=>{ this.scrollFunc(event); }//IE/Opera/Chrome  
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
  turnBtnCli=(num)=>{
    let {valueList,onValueChange}=this.props;
    let {idx}=this.state;
    let nextIdx=idx+num;
    console.log(nextIdx)
    if(valueList.length > nextIdx && nextIdx >= 0){
      this.setState({idx:nextIdx});
      if(onValueChange)onValueChange(valueList[nextIdx]);
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
  render(){
    let {valueList,idx}=this.state;

    return(
      <div className="val-tab">
        <div className="val-plus val-btn" onMouseUp={()=>{ this.onMouseUpFn(); }} onMouseDown={()=>{ this.onMouseDownFn(+1)  }}>+</div>
        <div ref="scrollBox" className="val-sel-box" title="滑动滚轮可修改">
          {valueList.length>0?valueList[idx].tit:''}
        </div>
        <div className="val-minus val-btn" onMouseUp={()=>{ this.onMouseUpFn(); }} onMouseDown={()=>{ this.onMouseDownFn(-1)  }}>-</div>
      </div>

      
    )
  }

}

export default ValTab;