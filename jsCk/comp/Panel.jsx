import React,{Component,createElement} from 'react';

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show:props.show
    }

  }
  componentDidMount() {
    
  }
  static defaultProps={ 
    title:"新窗口",
    type:'info',
    
    show:true,
    noWrap:false
  };
  toggleShow=()=>{
    this.setState({show:!this.state.show})
  }
  render () {
      let {noWrap,children,type,title}=this.props;
      let {show}=this.state;
      let bodyHtml=noWrap?children:<div className="panel-body">{children}</div>;
      let showClass=show?"open":"close";
      return( 
        <div className={"panel panel-"+type+" "+showClass} >
          <div className="panel-heading" ref="panel-heading">
            <i className="iconfont icon-xia" onClick={()=>{ this.toggleShow() }}></i>
            <h3 className="panel-title">{title}</h3>
          </div>
          <div className="panel-body" ref="panel-body">
            {bodyHtml}
          </div>
          
        </div>
      );
    }
}
export default Panel;



