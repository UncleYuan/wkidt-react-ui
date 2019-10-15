var React = require('react');


var ImgTab = React.createClass({
	getDefaultProps:function(){
	    return {
	    	imgList:[],
        posWidth:0,
        posLang:0,
	    };
	},
  getInitialState: function() {
      return {
        imgList:this.props.imgList,
        active:0,
        posIdx:0,
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
  goPosIdx:function(turnNum){
    if(turnNum+this.state.posIdx<= this.props.posLang && turnNum+this.state.posIdx>=0){
      this.setState({posIdx:turnNum+this.state.posIdx})
    }
  },
  render: function() {
      if(this.state.imgList.length==0 || !this.state.imgList){
        return(<div></div>);
      }
      let idx=this.state.active;
	    return (
        <div >
         <div className="Commodity-pic  pr">
                    <img className="big-img" src={this.state.imgList[this.state.active]&&this.state.imgList[this.state.active].imgurl+"?imageView2/1/w/600/h/420"} alt={this.state.imgList[this.state.active]&&this.state.imgList[this.state.active].title}   />
                    {this.props.children}
                    <div className="pic-right pa"><span className="cf18">{parseInt(this.state.active)+1}</span>/{this.state.imgList.length}</div>
                </div>
                <div className="thumbnail-wrap">
                   <a className="border-1 hpading left fl " onClick={()=>{this.goPosIdx(-4)}}>
                            <i className="iconfont icon-chevron-copy-copy-copy-copy"></i>
                        </a>
                    <ul className="thumbnail clearfix" style={{left:-this.props.posWidth*this.state.posIdx}}>
                       
                        {this.state.imgList.map(function(obj,idx){
                          return(<li key={idx} onClick={this.turnActive.bind(this,idx)} className={(this.state.active==idx?"active ":"")+"fl thumbnail_li"}><img src={obj.imgurl+"?imageView2/1/w/135/h/95"} alt={obj.title} /></li>)
                        },this)}
                        
                    </ul>
                    <a className="border-1 hpading right fl " onClick={()=>{this.goPosIdx(4) }}>
                            <i className="iconfont icon-jikediancanicon13"></i>
                        </a>
                  </div>
        </div>

	    );
	}
});
module.exports = ImgTab;


