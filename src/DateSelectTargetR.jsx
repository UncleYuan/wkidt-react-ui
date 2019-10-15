import React, {
  Component,
  PropTypes
} from 'react';
import DateSelect from '../components/DateSelectR';
import Modal from '../components/Modal';
class DateSelectTarget extends Component {
  constructor(props) {
      super(props);
      let now=new Date();
      this.state = {
        modalShow:[false],
        value:""
      };
      
  }
  componentWillMount() {
    let _this=this;
  }
  componentWillReceiveProps(nextProps) {
     if(nextProps.value!=this.state.value){
        this.setState({value:nextProps.value})
     }     
  }
  goBack(){
    history.go(-1);
  }
  toggleModal(n,v){
    let nowModalState=this.state.modalShow;
    nowModalState[n]=v?v:!nowModalState[n];
    this.setState({modalShow:nowModalState})
  }
  openCal(){
    this.toggleModal(0,true);
  }
  getDateVal=(data)=>{
    this.setState({setDate:data})
    this.props.onChangeDate(this.props.name,data)
    this.toggleModal(0,false);
  }
  render(){

    return (
      <div className="calInput inline-block">
        {React.Children.map(this.props.children, function(child, idx) { 
          var props = child.props;
          var _this=this;
         
          if (props.Select) {
            return React.cloneElement(child, {
              onFocus: this.openCal.bind(this),
              value:this.props.value?this.props.value:this.state.value,
              name:this.props.name
            });
          }
        },this)}
        <Modal title="选择时间" show={this.state.modalShow[0]} onClose={this.toggleModal.bind(this,0)}>
          <DateSelect onGetDate={this.getDateVal} />
        </Modal>
      </div>
      
      )
  }

}

DateSelectTarget.defaultProps = { onChangeDate: function(){} };
export default DateSelectTarget;