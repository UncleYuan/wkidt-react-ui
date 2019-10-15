import React,{Component} from 'react';
import tools from '../tools/public_tools';


const showStyle={display:"inline-block"};
const hideStyle={display:"none"};
class Pager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_num:props.all_num,
      all_page_num:props.all_page_num,
      sel_index:props.sel_index
    }
    this.displayName="Pager";
  }
  static defaultProps={ 
    all_num:0,
    all_page_num:0,
    sel_index:1,
    className:""
  };

  componentDidMount() {
   
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.sel_index!=this.props.sel_index){
      this.setState({sel_index:nextProps.sel_index});
    }
    if(nextProps.all_page_num!=this.props.all_page_num){
      this.setState({all_page_num:nextProps.all_page_num});
    }
    if(nextProps.all_num!=this.props.all_num){
      this.setState({all_num:nextProps.all_num});
    }
  }
  componentWillUnmount() {
   
  }
  setSelIdx=(idx)=>{
    let {onSetSelIdx}=this.props;
    if(onSetSelIdx){
      onSetSelIdx(idx)
    }
  }
  selChange=(event)=>{
    let {sel_index,all_page_num}=this.state;
    let theVal= event.target.value;
    if(!isNaN(theVal)&&theVal>=sel_index&&theVal<=all_page_num){
      this.setSelIdx(theVal);
    }
  }
  getTel=()=>{
    let numHtml=[];
    let _this=this;
    let {sel_index,all_page_num}=this.props;
    for (let i = 1; i <=7; i++) {
      let thisIdx=sel_index-4+i
      let activeClass=sel_index == thisIdx?"active":"";
      if(thisIdx>0&&thisIdx<=all_page_num){
        numHtml.push(<a key={i} onClick={_this.setSelIdx.bind(this,thisIdx)} className={"page-idx  "+activeClass}>{thisIdx}</a>);
      }
    }
    return numHtml;
  }
  render() {
      let {sel_index}=this.state;
      let {all_page_num,all_num,className}=this.props;
      if(all_num==0){
        return (
          <div className={"page "+className}>
            已无更多数据
          </div>
        );
      }
	    return (
        <div className={"page "+className}>
          <a href="javascript:;" onClick={this.setSelIdx.bind(this,1)} style={sel_index>1?showStyle:hideStyle} className="page-btn  ">首页</a>
          <a href="javascript:;" onClick={this.setSelIdx.bind(this,parseInt(sel_index)-1)} style={sel_index>1?showStyle:hideStyle} className="page-btn  ">上一页</a>
          {this.getTel()}
          <a href="javascript:;" onClick={this.setSelIdx.bind(this,parseInt(sel_index)+1)} style={sel_index<all_page_num?showStyle:hideStyle} className="page-btn  ">下一页</a>
          <input type="text" value={sel_index} onChange={this.selChange} className="page-input uba1 w50 pl5 pr2 fuzzy-border mr10" /> 
          共计<span className="base-color ml5 mr5">{all_page_num}</span>页,
          <span className="base-color ml5 mr5">{all_num}</span>条
        </div>
	    );
	}
}
export default Pager;


