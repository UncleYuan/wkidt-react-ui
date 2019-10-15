var React = require('react');
var $=require('jquery');
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
}
var List = React.createClass({
    getDefaultProps:function(){
        return {
            rendData:[],
            className:"",
            callback:function () {
                
            },
            ajaxType:"post"
        };
    },
    getInitialState: function() {
        return {
            loading:false,
            rendData:this.props.rendData,
            p:1,
            txt:"正在加载中...",
            len:10
        };
    },
    Wrap:false,
    Cont:false,
    componentWillMount:function(){
         this.getData(this.props.callback);
    },
    componentDidMount:function() {

        this.Wrap=$(this.refs.scrollItem);
        this.Cont=$(this.refs.scrollCont);
        this.Wrap[0].addEventListener('scroll', this.handleScroll);
    },
    componentWillUnmount:function() {
        this.Wrap[0].removeEventListener('scroll', this.handleScroll);
    },
    handleScroll:function(e) {
        var _this=this;
        if(this.Cont.height()-this.Wrap.scrollTop()< this.Wrap.height()+10){
            if(!this.state.loading){
                _this.setState({loading:true,txt:"正在加载中..."});
                this.getData(_this.props.callback);
            }
            
        }
    },
    getData:function(callback){
        var _this=this;
        var postData={page:this.state.p,len:this.state.len};
        postData=$.extend(postData,this.props.postData);
        $[this.props.ajaxType](this.props.url,postData,function(data){
         
            if(data.code=="SUCCESS"){
                var now=_this.state.rendData;
                var add=data.data;
                var p=_this.state.p+1;
                now=now.concat(add);
                var txt=data.data.length<_this.state.len?"已无更多内容":"加载成功";
                _this.setState({txt:txt,rendData:now,loading:false,p:p});
            }else if(data.code=="NO_DATA"){
                _this.setState({txt:"已无更多内容"});
                window.removeEventListener('scroll', _this.handleScroll);
            }
            if(callback){ callback(_this.state.rendData,_this); }
        },'json');
    },
    goUrl:function(url){
        location.href=url;
    },
    getHtml:function(){
        if(this.props.dataTel){
        return  this.props.dataTel(this.state.rendData,this);
        }
    },
    render: function() {
        return (
            <div className="scrollBox" ref="scrollItem">
                    <div ref="scrollCont" className={this.props.className}> 
                        {this.props.children}
                        {this.getHtml()}
                        
                    <div className="pt10 pb10 tc sc-text">{this.state.txt}</div>
                </div>
            </div>
        )
    }
});

module.exports = List;


