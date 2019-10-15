import React, { Component } from 'react';
class Tabs  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active:props.active
    }
  }
  static defaultProps={
    active:0,
    btnBoxClass:"top-tab-box",
    btnClass:"tab-btn",
    scroll:true
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.active!=this.props.active){
      this.setState({show:nextProps.active});
    }
  }
  componentDidMount() {
   
  }
  componentWillUnmount() {
    
  }
  selTab=(idx,obj)=>{
    let {onSelect}=this.props;
    this.setState({active:idx});
    if(onSelect){
      onSelect(idx,obj);
    }
  }
  render() {
      let {btnBoxClass,children,btnClass,title}=this.props;
      let {active}=this.state;
      return (
        <div className="tab-wrap">
          <div className={"tab-head  " +btnBoxClass}>
        
              {children.map(function(obj,index){
                let activeClass=active==index?" active":""
                return(
                  <div  key={index} onClick={this.selTab.bind(this,index)} className={""+btnClass+" "+activeClass}>{obj.props.title}</div>
                )
              },this)}
          
          </div>
          <div className="tab-cont">
            {children.map(function(obj,index){
              let activeClass=active==index?" active":""
              return(
                <div key={index} className={"tab-box"+activeClass}>{obj}</div>
              )
            },this)}
          </div>
        </div>  
      )
	}
}


export default  Tabs;


