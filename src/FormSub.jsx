import React, {
  Component,
  PropTypes,
  createElement
} from 'react';
import tools from '../tools/public_tools';

class FormSub extends Component {
  constructor(props) {
      super(props);
      this.state = {
        
      };
  }
  static defaultProps={ 
    disabled:false,
    text:"提交",
    onClick:function(){}
  };
  componentWillMount() {
   
  }
  componentWillReceiveProps(nextProps) {
    
  }
  render(){
    let {text,disabled,onClick,className,inputCol,labelCol,layoutType}=this.props;
    let ifCol=layoutType=="horiz";
    return(
      <div className={"form-sub-box "+className+" "+(ifCol?"clearfix":"")}>
        {ifCol?<div className={labelCol}> </div>:null}
        <div className={"form-sub "+(ifCol?inputCol:"")}>
          {createElement(
            'a',
            {
              className:'btn btn-info '+(disabled?"disabled":""),
              onClick:()=>{ 
                if(disabled){ return ;} 
                onClick();
              } 
            },
            text
          )}
        </div>
      </div>
    )
  }

}


export default FormSub;