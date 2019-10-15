var React = require('react');
indexOf = function(arr,val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) return i;
  }
  return -1;
};
removeArr = function(arr,val) {
  var index = indexOf(arr,val);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
var Switchery = React.createClass({
	getDefaultProps:function(){
	    return {
	    	show:false
	    };
	},
  getInitialState: function() {
      return {
          show:this.props.show
        };
    },
  componentDidMount: function () {
    if(PubSub){
      this.pubsub_token = PubSub.subscribe(this.props.name, function (evename,stateObj) {
        this.setState(stateObj);
      }.bind(this));
    }
  },
  componentWillReceiveProps:function(nextProps){
    if(nextProps.show!=this.props.show){
      this.setState({show:nextProps.show});
    }
  },
  componentWillUnmount: function () {
    if(PubSub){
      PubSub.unsubscribe(this.pubsub_token);
    }
  },
  
  render: function() {
      
      var wrapShowClass=this.state.show?" open":"";
	    return (
        <span className={"switchery baseStyle"+wrapShowClass} ><small ></small></span>
	    );
	}
});
module.exports = Switchery;


