var React = require('react');


var ImgTab = React.createClass({
	getDefaultProps:function(){
	    return {
	    	imgList:[]
	    };
	},
  getInitialState: function() {
      return {
        imgList:this.props.imgList,
        active:0,
      };
    },
  componentDidMount: function () {
   
  },
  componentWillReceiveProps:function(nextProps){
   /* if(nextProps.imgList!=this.state.imgList){
      this.setState({imgList:nextProps.imgList});
    }*/
  },
  componentWillUnmount: function () {
   
  },
  turnActive:function(idx){
    this.setState({active:idx});
  },
  filterIdx:function(idx){
    if(idx >= this.state.imgList.length){
      idx=0;
    }else if(idx < 0){
      idx=this.state.imgList.length-1;
    }
    return idx;
  },
  render: function() {
      if(this.state.imgList.length==0 || !this.state.imgList){
        return(<div></div>);
      }
      let idx=this.state.active;
	    return (
        <div className="img-bro-wrap">
            <div className="left-img-wrap">
                <div className="img-box">
                    <img src={this.state.imgList[this.state.active]&&this.state.imgList[this.state.active].image+"?imageView2/1/w/625/h/370"} alt={this.state.imgList[this.state.active]&&this.state.imgList[this.state.active].title} />
                    <div className="img-tit">{this.state.imgList[this.state.active]&&this.state.imgList[this.state.active].title}</div>
                    <div className="img-tit-bg"></div>
                </div>
                <div className="tc clearfix">
                    <a href="javascript:;" onClick={this.turnActive.bind(this,this.filterIdx(idx-1))} className="fl btn-a">上一张</a>
                    <span className="in-txt">{this.state.active+1}/{this.state.imgList.length}</span>
                    <a href="javascript:;" onClick={this.turnActive.bind(this,this.filterIdx(idx+1))} className="fr btn-a">下一张</a>
                </div>
            </div>
            <div className="right-img-list">
            {this.state.imgList.map(function(obj,idx){
              return(<div key={idx} onClick={this.turnActive.bind(this,idx)} className={(this.state.active==idx?"active":"")+" img-item"}><img src={obj.image+"?imageView2/1/w/116/h/70"} alt={obj.title} /></div>)
            },this)}
                
            </div>
        </div>

	    );
	}
});
module.exports = ImgTab;


