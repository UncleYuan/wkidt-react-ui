import React, {
  Component,
  PropTypes
} from 'react';
import tools from '../tools/public_tools';
import $ from 'jquery';
const now=new Date();
const defaultProps={ 
  show:false,
  title:"未命名"
};
class DateSelect extends Component {
  constructor(props) {
      super(props);
      this.bind=false;
      this.state = {
        show:this.props.show,
      };
  }
  componentWillMount() {
    let _this=this;
  }
  componentWillReceiveProps(nextProps) {
   // console.log(nextProps.show)
   /* if(nextProps.show!=this.state.show) {
      this.setState({show:nextProps.show});
    }*/
  }
  componentDidMount() {

  }
  bindClick=(event)=>{
    if($(event.target).closest(this.refs.box).size()==0){
      this.toggelMenu(false);
    }
  }
  toggelMenu=(type)=>{
    let setVal=type?type:!this.state.show;
   /* if(setVal){
      $(document).unbind('click',this.bindClick);
      $(document).bind('click',this.bindClick)
    }*/
    this.setState({
      show:setVal
    })
  }
  render(){
    return(
      <div  ref="box" className="filter-row">
        <div onClick={()=>{ this.toggelMenu() }}  className={"bg "+(this.state.show?"show":"")}></div>
        <div className="filter_title">
          {this.props.title}
        </div>
        <a href="javascript:;" onClick={()=>{ this.toggelMenu() }}  className="more-btn" >
          <span className="more-btn-text">{this.state.show?"收起":"更多"}</span>
          <i className={(this.state.show?"icon-shangjiantou":"icon-xiajiantou")+" iconfont more-icon"}></i>
        </a>
        <div className={"filter-ul-wrap "+(this.state.show?"pos":"")}>
           {this.props.children}                             
        </div>
      </div>
    )
  }

}

DateSelect.defaultProps = defaultProps;
export default DateSelect;