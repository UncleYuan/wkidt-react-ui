var React = require('react');
var InputEle = React.createClass({
  getDefaultProps:function(){
      return {
        value:"",
        title:"",
        name:"",
        type:"input",
        // width:400,
        optionsArr:[],
        onItemChange:false,
        ispwd:false
      };
  },
  getInitialState: function() {
      return {
          inputEd:false,
          value:this.props.value,
          textareaHeight:false
        };
    },
  componentWillMount:function(){
   
  },
  componentWillReceiveProps:function(nextProps){
    if(nextProps.value!=this.props.value){

      this.setState({value:nextProps.value});
    }
    if (nextProps.value =="") {
      this.setState({value:nextProps.value});
    }
  },
  getStateProps:function(){
    if(this.props.getStateProps){
      this.props.getStateProps()
    }
  },
  change:function(){
    var value=this.refs.textInput.value||event.target.value||"";
    this.setState({value:value});
    
    if(this.props.onItemChange)this.props.onItemChange(value,this.props.name);
  },
  firstHeight:0,
  textareaChange:function(event){
    var tH=this.state.textareaHeight;
    if(this.firstHeight==0){
      this.firstHeight=event.target.offsetHeight;
    }
    event.target.style.height=this.firstHeight+'px';
    tH=event.target.scrollHeight;
    event.target.style.height=tH+'px';
    var value=this.refs.textInput.value||event.target.value||"";
    this.setState({value:value});
  
    if(this.props.onItemChange)this.props.onItemChange(value,this.props.name);
  },
  selectChang:function(){
    var value=this.refs.textInput.value;
    this.setState({value:value});
    if(this.props.onItemChange)this.props.onItemChange(value,this.props.name);
  },
  typeHtml:{
    input:function(o){
    
      var type=o.props.ispwd?"password":"text";
      return   <input 
                type={type} 
                name={o.props.name} 
                style={{width:o.props.width}} 
                placeholder={o.props.placeholder||""} 
                ref="textInput" 
                className={o.props.className}
                value={o.state.value} 
                onChange={o.change} 
                 />
    },
    textarea:function(o){
      return  <textarea 
                ref="textInput" 
                value={o.state.value}  
                style={{width:o.props.width}} 
                onChange={o.textareaChange} 
                placeholder={o.props.placeholder||""} 
                className={o.props.className}
                name={o.props.name}
                cols={o.props.cols||60}
                rows={o.props.cols||3} ></textarea>;
    },
    select:function(o){
      return  <select 
                name={o.props.name} 
                ref="textInput"  
                onChange={o.selectChang}
                className={o.props.className}
                >
                <option value="">{o.props.placeholder?o.props.placeholder:"请选择"}</option>
                {o.props.optionsArr.map(function (obj,i) {
                  return(
                    <option key={i} value={obj.val}>{obj.tit}</option>
                  ); 
                })}
              </select>;
    }
  },
  
    render: function() {
     
      if(this.props.type!="hidden"){
          var value = this.state.value;
          var focusClass=value&&value!=""?" focus":"";
          return (
                  
                  <div className="form-wrap clearfix">
                    <div className="tit">{this.props.title}：</div>
                    <div className="cont">
                      {this.typeHtml[this.props.type](this)}
                      
                    </div>
                    
                  </div>
           
          );
      }else{
        return (<input type="hidden"   value={this.state.value}  name={this.props.name} />);
      }
    }
});

module.exports = InputEle;