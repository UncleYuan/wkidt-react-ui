
var React = require('react');
var SliderBanner = React.createClass({
  getDefaultProps:function(){
      return {
        time:300,
            extime:100,
            autoDelay:2000,
            autoPlay:false,
            htmlGoBtn:false,
            arrow:"x",
            len:0,
            idx:0,
            oldIdx:0,
            end:false,
            w:window.innerWidth,
            onMoveItemEnd:function(){

            }
      };
  },
  getInitialState: function() {
      return {
          s:0,
          m:0,
          n:0,
          idx:this.props.idx,
          oldIdx:this.props.oldIdx,
          left:true
        };
    },
    componentWillReceiveProps:function(nextProps) {
      if(nextProps.idx!=this.state.idx){
        this.setState({idx:nextProps.idx})
      }
    },
    page:function () {
      return this.props.arrow=="x"?"pageX":"pageY";
    },
    setTrans:function (num) {
      if(this.props.arrow=="x"){
        return 'translate3d('+num+'px,0px,0px)';
      }else{
        return 'translate3d(0px,'+num+'px,0px)';
      }
    },
    touchStartFn:function(e){
      this.setState({s:e.targetTouches[0][this.page()]});
    },
    idxFn:function(i,len){
        if(i<0){
            return len-1;
        }else if(i==len){
            return 0;
        }else{
            return i;
        }
    },
    touchMoveFn:function(e){
      var left=e.targetTouches[0][this.page()]-this.state.s<0;
      this.setState({m:e.targetTouches[0][this.page()]-this.state.s,end:false,left:left});
    },
    touchEndFn:function(e){
      var len=this.props.imgList.length;
      var _this=this;
      var idx=null;
      if(this.state.m>50){
        idx=this.idxFn(this.state.idx-1,len);
        this.setState({m:0,idx:idx,oldIdx:this.state.idx,end:true,left:!this.state.left});
           
      }else if(this.state.m<-50){
        idx=this.idxFn(this.state.idx+1,len);
        this.setState({m:0,idx:idx,oldIdx:this.state.idx,end:true,left:!this.state.left});
      }else {
        idx=this.idxFn(this.state.idx,len);
        this.setState({m:0,idx:idx,end:true});
        
      }
      this.props.onMoveItemEnd.bind(this,idx)();
     
    },
    render:function() {
      var idx=this.state.idx;
      var oldIdx=this.state.oldIdx;
      var the=this;
      var len=this.props.imgList.length;

      return (
         <div  className="slider" onTouchStart={this.touchStartFn} onTouchMove={this.touchMoveFn}  onTouchEnd={this.touchEndFn}>
            <div className="slider-group ub-fh ub-fv slider-anim" >
            { 
              this.props.imgList.map(function (obj,i){
                var style={'WebkitTransform':'translate3d(0px,0px,0px)','WebkitTransition':'none','backgroundImage':'url(' + obj.img + ')'}
                if(the.state.end){
                
                  
                  if(i==the.idxFn(oldIdx,len)){
                    style.WebkitTransition='-webkit-transform 0.4s';
                  }else if(i==the.idxFn(oldIdx-1,len)){
                    if(idx==the.idxFn(oldIdx+1,len)&&len>2){
                      style.WebkitTransition=oldIdx==0||oldIdx==len-1?"none":'-webkit-transform 0.4s';
                    }else{
                      style.WebkitTransition='-webkit-transform 0.4s';
                    }
                    
                  }else if(i==the.idxFn(oldIdx+1,len)){
                    if(idx==the.idxFn(oldIdx-1,len)&&len>2){
                      style.WebkitTransition= oldIdx==0||oldIdx==len-2?"none":'-webkit-transform 0.4s';
                    }else{
                      style.WebkitTransition='-webkit-transform 0.4s';
                    }
                  }
              }
              
              if(i==the.idxFn(idx,len)){
                style.WebkitTransform=the.setTrans(the.state.m);
                style.zIndex=20;
              }else if(i==the.idxFn(idx-1,len)&&!this.state.left){
                style.WebkitTransform=the.setTrans(the.state.m-the.props.w);
                style.zIndex=20;
              }else if(i==the.idxFn(idx+1,len)&&this.state.left){
                style.WebkitTransform=the.setTrans(the.state.m+the.props.w);
                style.zIndex=20;
              }
              var cont=obj.cont?obj.cont:'';
                return <div key={i} className="slider-item ub-fh ub-fv ub-img1" onClick="" style={style} >{cont}</div>;
            },this)
          }
                </div>
                <ul className="ulIndex">
                    {
              this.props.imgList.map( function (res,i) {
                  return <li key={i} className={the.state.idx==i?'active':''}></li>;
              })
            }
                </ul>
            </div>
      );
  }
});

module.exports = SliderBanner;