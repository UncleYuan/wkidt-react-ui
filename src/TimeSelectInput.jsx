import React, {
  Component,
  PropTypes
} from 'react';
import { regComp } from './higherOrders/FormItem';
import { TimeSelector } from './TimeSelector';
import Modal from './Modal';
let theTime = new Date();

class TimeSelectInputEle extends Component {
  constructor(props) {
    super(props);
    console.log(props.value)
    let now = new Date();
    this.state = {
      modalShow: [false],
      value: props.value
    };

  }
  static defaultProps = {
    onValueChange: function () { },
    readOnly: false,
    startYear: theTime.getFullYear() - 30,
    endYear: theTime.getFullYear(),
    value:"",
    format:"y-m-d h:i:s"
  }
  componentWillMount() {
    let _this = this;
  }
  componentWillReceiveProps(nextProps) {
    let {value,format} = this.props;

    if (nextProps.value != value && nextProps.value.split('-').length == format.split('-').length && nextProps.value.split(':').length == format.split(':').length) {
      
      this.setState({ value: nextProps.value })
    }

  }
  goBack() {
    history.go(-1);
  }
  toggleModal = (n, v) => {
    let nowModalState = this.state.modalShow;
    nowModalState[n] = v ? v : !nowModalState[n];
    this.setState({ modalShow: nowModalState })
  }
  openCal = () => {
    let {readOnly} = this.props;
    if (readOnly) return;
    this.toggleModal(0, true);
  }
  getDateVal = (val) => {
    console.log(val)
    this.setState({ value: val });
    this.props.onValueChange(val);

  }
  render() {
    let {value} = this.state;
    let {format, readOnly, startYear, endYear} = this.props;
    let readOnlyClass = readOnly ? "disabled" : "";
    return (
      <div className="ui-drop-wrap">
        <div className={"ui-input-box " + readOnlyClass} onClick={() => { this.openCal() }} >
          <i className="iconfont icon-xia" ></i>
          {value ? value : "请点击选择时间"}
        </div>

        <Modal title="选择时间" show={this.state.modalShow[0]} onClose={() => { this.toggleModal(0) }}>
          <TimeSelector autoBubble={false} className="middle" value={value} onValueChange={this.getDateVal} format={format} startYear={startYear} endYear={endYear} >
            <a href="javascript:;" onClick={(val) => { this.getDateVal(val); this.toggleModal(0, false); }} goSub={true} className="btn btn-info">确定</a>
          </TimeSelector>
        </Modal>
      </div>

    )
  }

}
export default regComp(TimeSelectInputEle, ['time-select-input']);
export const TimeSelectInput = TimeSelectInputEle;
