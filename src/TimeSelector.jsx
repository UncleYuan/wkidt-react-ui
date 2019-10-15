import React, {
  Component,
  PropTypes,
  Children,
  cloneElement
} from 'react';
import tools from '../tools/public_tools';
import { regComp } from './higherOrders/FormItem';

import ValTab from './ValTab';
let theTime = new Date();

class TimeSelectorEle extends Component {
  constructor(props) {
    super(props);
    let now = new Date();
    this.value = props.value;
    this.timer = null;
    this.state = {
      loading: true,
      stateDayList: props.stateDayList,
      select_y: now.getFullYear(),
      select_m: now.getMonth() + 1,
      select_d: now.getDate(),
      select_h: now.getHours(),
      select_i: now.getMinutes(),
      select_s: now.getSeconds(),
    };
    this.allDateArr = ['selectYear', 'selectMonth', 'selectDay'];
    this.allTimeArr = ['selectHours', 'selectMinutes', 'selectSeconds'];
  }
  static defaultProps = {
    startYear: theTime.getFullYear() - 30,
    endYear: theTime.getFullYear(),
    stateDayList: [],
    autoBubble: true,
    className: "",
    format: "y-m-d h:i:s",
    value: '',
    onGetDate: function () { }
  };
  componentWillMount() {
    let _this = this;
    let {value, startYear, endYear} = this.props;
    let {select_y, select_m} = this.state;
    if (value) { this.reSetTime(value); }

    this.optionYear = this.getOption(
      endYear - startYear,
      (i) => {
        return { val: startYear + i, tit: startYear + i + "年" }
      }
    );
    this.optionMouth = this.getOption(
      11,
      (i) => {
        return { val: i + 1, tit: i + 1 + "月" }
      }
    );

    this.optionHours = this.getOption(
      23,
      (i) => {
        return { val: i, tit: i + "时" }
      }
    );
    this.optionMinutes = this.getOption(
      59,
      (i) => {
        return { val: i, tit: i + "分" }
      }
    );
    this.optionSeconds = this.getOption(
      59,
      (i) => {
        return { val: i, tit: i + "秒" }
      }
    );
    this.getDayArr(select_y, select_m);
    this.resetValue();
    //this.props.onValueChange(this.value);
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    let {stateDayList,select_y} = this.state;
    if (nextProps.stateDayList.toString() != stateDayList.toString() && typeof (nextProps.stateDayList) == "object") {
      this.setState({ stateDayList: nextProps.stateDayList });
    }
    if (nextProps.value && nextProps.value != this.value) { this.reSetTime(nextProps.value); }
    let nextStartYear=parseInt(nextProps.startYear);
    let nextEndYear=parseInt(nextProps.endYear);
    if (nextStartYear != this.props.startYear || nextEndYear != this.props.endYear) {
     
      this.optionYear = this.getOption(
        nextEndYear - nextStartYear,
        (i) => {
          return { val: nextStartYear + i, tit: nextStartYear + i + "年" }
        }
      );
      if(select_y>nextEndYear||select_y<nextStartYear){
        this.setState({select_y:nextStartYear})
      }else{
        this.render();
      }
      
    }
  }
  reSetTime = (val) => {
    this.value = val;
    let state = this.state;
    let {format} = this.props;
    let formatArr = format.split(/\:|\-|\s+/);
    let valArr = val.split(/\:|\-|\s+/);
    let setState = {};
    formatArr.forEach((now, i) => {
      let resetNow = now.replace(/(^\s+)|(\s+$)/g, "");
      setState['select_' + resetNow] = valArr[i];
    })
    this.setState(setState);
  }
  goBack() {
    history.go(-1);
  }
  getDayArr = (year, mouth) => {
    let day = new Date(year, mouth, 0);
    let daycount = day.getDate();
    this.optionDay = this.getOption(
      daycount - 1,
      (i) => {
        return { val: i + 1, tit: i + 1 + "日" }
      }
    );
  }
  getOption = (ex, valFn) => {
    let opt = []
    for (let i = 0; i <= ex; i++) {
      opt.push(valFn(i));
    }
    return opt;
  }
  goSub = () => {
    let {onValueChange} = this.props;
    this.resetValue();
    if (onValueChange) onValueChange(this.value);
  }
  checkHave = (str) => {
    return this.props.format.indexOf(str);
  }
  resetValue = () => {
    let {format} = this.props;
    let sta = tools.deepCopy(this.state);
    for (let [now, idx] of format) {
      if (sta['select_' + now]) {
        let resetNow = now.replace(/(^\s+)|(\s+$)/g, "");
        format = format.replace(now, sta['select_' + resetNow]);
      }
    }
    console.log(format)
    this.value = format;
  }
  resetDateItem = (val, type) => {
   
    let {select_d, select_y, select_m} = this.state;
    let {autoBubble} = this.props;
    if (autoBubble) clearTimeout(this.timer);
    let setState = {
      ['select_' + type]: val
    }
    if (type == "m") {
      this.getDayArr(select_y, val);
      let ex = select_d - this.optionDay.length;
      if (ex > 0) {
        setState.select_d = this.optionDay[this.optionDay.length - ex].val;
      }
    }
   
    this.setState(setState)
    if (autoBubble) {
      this.timer = setTimeout(() => {
        this.goSub();
      }, 500)
    }
  }
  renderChildren = (children) => {
    return Children.map(children, (child) => {
      if (!child) { return null; }
      if (typeof child === 'string') { return child; }
      let props = {
      };
      if (child.props.goSub) {

        let oldClick = child.props.onClick;
        props.onClick = () => {
          this.resetValue();
          
          oldClick(this.value);
        };
      } else if (child.props.children) {
        props.children = this.renderChildren(child.props.children);
      }
      return cloneElement(child, props);
    })
  }
  render() {
    let now = new Date();
    let {className, children} = this.props;

    return (
      <div className={"time-select-wrap " + className}>
        {this.checkHave("y") >= 0 ? <ValTab valueList={this.optionYear} value={this.state.select_y} onValueChange={(obj) => { this.resetDateItem(obj.val, 'y'); }} ></ValTab> : ""}
        {this.checkHave("m") >= 0 ? <ValTab valueList={this.optionMouth} value={this.state.select_m} onValueChange={(obj) => { this.resetDateItem(obj.val, 'm'); }} ></ValTab> : ""}
        {this.checkHave("d") >= 0 ? <ValTab valueList={this.optionDay} value={this.state.select_d} onValueChange={(obj) => { this.resetDateItem(obj.val, 'd'); }} ></ValTab> : ""}
        {this.checkHave("h") >= 0 ? <ValTab valueList={this.optionHours} value={this.state.select_h} onValueChange={(obj) => { this.resetDateItem(obj.val, 'h'); }} ></ValTab> : ""}
        {this.checkHave("i") >= 0 ? <ValTab valueList={this.optionMinutes} value={this.state.select_i} onValueChange={(obj) => { this.resetDateItem(obj.val, 'i'); }} ></ValTab> : ""}
        {this.checkHave("s") >= 0 ? <ValTab valueList={this.optionSeconds} value={this.state.select_s} onValueChange={(obj) => { this.resetDateItem(obj.val, 's'); }} ></ValTab> : ""}
        <div className="time-select-child">
          {children ? this.renderChildren(Children.toArray(children)) : ''}
        </div>
      </div>

    )
  }

}
export default regComp(TimeSelectorEle, ['time-select']);
export const TimeSelector = TimeSelectorEle;
