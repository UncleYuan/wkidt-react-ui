var React = require('react');
function toTwo(num){
  if(parseInt(num)<10){
    num='0'+num;
  }
  return num;
}
function reTime(nS,type){

  var now = new Date(nS*1000);
  var yy = now.getFullYear();      //年
  var mm = toTwo(now.getMonth() + 1);     //月
  var dd = toTwo(now.getDate());          //日
  var hh = toTwo(now.getHours());         //时
  var ii = toTwo(now.getMinutes());       //分
  if(type){
    return yy+"-"+mm+"-"+dd;
  }
  return yy+"-"+mm+"-"+dd+" "+hh+":"+ii;
}
var DateInputEle = React.createClass({
	getDefaultProps:function(){
	    return {
	    	value:"",
        title:"",
        name:"",
        type:"input",
        labelClass:"floating-label",
        optionsArr:[],
        valChange:false,
        placeholder:'',
        ispwd:false,
        abs:true
	    };
	},
  getInitialState: function() {
    var type=this.props.format=="Y-m-d H:i"?false:true;
      return {
          inputEd:false,
          value:this.props.value,
          textareaHeight:false,
          dateValue:reTime(this.props.value,type).replace(' ','T'),
          value:reTime(this.props.value,type)
        };
    },
  componentWillMount:function(){

  },

  componentWillReceiveProps:function(nextProps){
    var type=this.props.format=="Y-m-d H:i"?false:true;
    if(nextProps.value!=this.props.value&&!isNaN(parseInt(nextProps.value))){
  
      this.setState({value:reTime(nextProps.value,type),dateValue:reTime(nextProps.value,type).replace(' ','T')});
    }
  },
  getStateProps:function(){
    if(this.props.getStateProps){
      this.props.getStateProps()
    }
  },
  change:function(){

    this.setState({dateValue:event.target.value,value:event.target.value.replace('T'," ")});
    if(this.props.valChange){
      this.props.valChange(event.target.value)
    }
  },

  typeHtml:{
    input:function(o){
      var type=o.props.format=="Y-m-d H:i"?"datetime-local":"datetime";
      return <input type={type}  ref="textInput" value={o.state.dateValue} onChange={o.change}  className="item-input"  />;
    }
  },
	
  	render: function() {
 
         var value = this.state.value;
          var cn=value?"form-item focus":"form-item";
          cn=this.props.abs?cn+" form-item-abs":cn;
          var labelClass="item-tit "+this.props.labelClass;
          return (
            <div className={cn}>
              <div className="item-input-box">
                  <div className={labelClass}>{this.props.title}</div>
                  <input value={this.state.value} name={this.props.name} type="hidden" />
                  {this.typeHtml[this.props.type](this)}
                  <div className="input-bottom-line"></div>
              </div>
            </div>
          );
     
	}
});

module.exports = DateInputEle;