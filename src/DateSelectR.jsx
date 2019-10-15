import React, {
  Component,
  PropTypes
} from 'react';
import tools from '../tools/public_tools';
let theTime=new Date();
const defaultProps={ 
  // startYear:theTime.getFullYear()-10,
  startYear:1900,
  endYear:theTime.getFullYear(),
  stateDayList:[],
  onGetDate: function(){}
};
class DateSelect extends Component {
  constructor(props) {
      super(props);
      let now=new Date();
      this.state = {
        loading:true,
        stateDayList:this.props.stateDayList,
        selectYear:now.getFullYear(),
        selectMonth:now.getMonth()+1,
        nowDate:now.getDate()
      };
      
  }
  componentWillMount() {
    let _this=this;
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.stateDayList!=this.state.stateDayList&& typeof(nextProps.stateDayList)=="object") {
      this.setState({stateDayList:nextProps.stateDayList});
    }
  }
  goBack(){
    history.go(-1);
  }
  getDayArr(year,mouth){
     let day = new Date(year, mouth, 0);
     let daycount = day.getDate();
     let firstWeek = new Date(year, mouth - 1, 1).getDay();
     let forCount = parseInt(firstWeek) + parseInt(daycount);
     let arr = [];
     let start = 1;
     for (let i = 0; i < forCount; i++) {
         if (firstWeek >= i + 1) {
             arr.push({ dayNum: "" })

         } else {
             arr.push({ dayNum: tools.toTwoNum(start), repayNum: 0, repayMsg: '' });
             start++;
         }
     }
    

     return arr;
  }
  getYearOption(){
    let ex=this.props.endYear-this.props.startYear;
    let opt=[]
    for(let i=0;i<=ex;i++){
      opt.push(
        <option key={i} value={this.props.startYear+i}>{this.props.startYear+i}</option>
      )
    }
    return opt;
  }    
  reNow(){
    let now=new Date();
    this.setState({
      selectYear:now.getFullYear(),
      selectMonth:now.getMonth()+1
    })
    
  }
  onYearChange(){
    let ev=this.refs.year.value||event.target.value;
    this.setState({selectYear:ev});
    if(this.props.onTimeChange){
      setTimeout(()=>{
        this.props.onTimeChange(this.state.selectYear,this.state.selectMonth)
      },100)
    }
  }
  onMouthChange(){
    let ev=this.refs.month.value||event.target.value;
    this.setState({selectMonth:ev});
    if(this.props.onTimeChange){
      setTimeout(()=>{
        this.props.onTimeChange(this.state.selectYear,this.state.selectMonth)
      },100)
    }
  }
  turnLeftRightMonth(i){
    let nowMonth=this.state.selectMonth;
    if(nowMonth==1&&i==-1){
      this.setState({selectMonth:12,selectYear:this.state.selectYear-1});
    }else if(nowMonth==12&&i==1){
      this.setState({selectMonth:1,selectYear:this.state.selectYear+1});
    }else{
      this.setState({selectMonth:nowMonth+i});
    }
    if(this.props.onTimeChange){
      setTimeout(()=>{
        this.props.onTimeChange(this.state.selectYear,this.state.selectMonth)
      },100)
    }
  }
  clickDay(obj){
    if(!obj.dayNum) return;
    this.props.onGetDate(this.state.selectYear+"-"+this.state.selectMonth+"-"+obj.dayNum)
  }
  getDayStateHtml(){

  }
  render(){
    let now=new Date();
    let dayArr=this.getDayArr(this.state.selectYear,this.state.selectMonth)
    return(
      <div className="ub ub-f1 ub-ver">
      
      <div className="">
        
        <div className="clearfix tc date-header mt10 mb10">
          <i className="iconfont contrary-color  pointer  fr fs24 icon-jiantou-right" onClick={this.turnLeftRightMonth.bind(this,1)}></i>
          <div className="inline-block  tc">
           <select className="bn mt5 fs18" name="year" ref="year" value={this.state.selectYear} onChange={this.onYearChange.bind(this)} >
            {this.getYearOption.bind(this)()}
          </select>
          年
          <select className="bn  mt5 fs18" name="month" ref="month" value={this.state.selectMonth} onChange={this.onMouthChange.bind(this)} >
            <option value="1">1月</option>
            <option value="2">2月</option>
            <option value="3">3月</option>
            <option value="4">4月</option>
            <option value="5">5月</option>
            <option value="6">6月</option>
            <option value="7">7月</option>
            <option value="8">8月</option>
            <option value="9">9月</option>
            <option value="10">10月</option>
            <option value="11">11月</option>
            <option value="12">12月</option>
          </select>
          {/*<a href="javascript:;"  onClick={this.reNow.bind(this)} className="btn base-btn pt2 pb2 fs12">本月</a>*/}
        </div> 
         <i className="iconfont fl contrary-color  pointer  fs24  icon-jiantou-left" onClick={this.turnLeftRightMonth.bind(this,-1)}></i>
          
        </div>
        <div className="date-wrap-box  ubl1 fuzzy-border bg-fff" >
          <div className="head-span item-span">日</div>
          <div className="head-span item-span">一</div>
          <div className="head-span item-span">二</div>
          <div className="head-span item-span">三</div>
          <div className="head-span item-span">四</div>
          <div className="head-span item-span">五</div>
          <div className="head-span item-span">六</div>
          {dayArr.map(function(obj,idx){
            let nowClass=obj.dayNum==this.state.nowDate && this.state.selectYear== now.getFullYear()&& this.state.selectMonth== now.getMonth()+1?"today":"";
            nowClass=obj.repayNum>0?nowClass+" reMoney":nowClass;
      
            let dayList=this.state.stateDayList;
            let html=dayList[obj.dayNum]?this.props.numHtml(dayList[obj.dayNum]):"";
            return(
              <div key={idx} onClick={this.clickDay.bind(this,obj)} className={(obj.dayNum?"pointer":"")+" item-span "+nowClass} >{obj.dayNum} {html} {obj.repayNum>0?<i>{obj.repayNum}</i>:""}</div>
              )
          },this)}
        </div>
    </div>
    </div>

      
    )
  }

}

DateSelect.defaultProps = defaultProps;
export default DateSelect;