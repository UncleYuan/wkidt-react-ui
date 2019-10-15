var React = require('react');
var InputEle = require('../components/InputEle');
var tools = require('../tools/public_tools');
var $= require('jquery');
var CheckRadio = require('../components/CheckRadio');
var SelUpImg = require('../components/SelUpImg');
/*var SetMobileCont = require('../components/SetMobileCont');
var GetMsgCode = require('../components/GetMsgCode');
var DateInputEle = require('../components/DateInputEle');*/

var allFormComp = ['InputEle', 'CheckRadio', 'SetMobileCont', 'GetMsgCode', 'DateInputEle']
var RenderForm = React.createClass({
  getDefaultProps: function() {
    return {
      liNum: false,
      name: "Form" + (new Date).valueOf(),
      rendData: {}
    };
  },
  getInitialState: function() {
    return {
      loading: true,
      haveBtn: false,
      rendData: this.props.rendData,
      childData:this.initChildData()
    };
  },
  componentWillMount: function() {
    if (this.props.getFormThis) {
      this.props.getFormThis(this);
    }
    if (this.props.url) {
      this.upDataForm();
    }
    if (this.props.rendData) {
      this.propsSetForm();
    }
    if (typeof(PubSub) != "undefined") {
      this.pubsub_token = PubSub.subscribe(this.props.name + 'rendForm', function(evename, stateObj) {
        this.setState(stateObj);
      }.bind(this));
    }

  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.rendData != this.state.rendData) {

      this.propsSetForm(nextProps.rendData);
    }
  },
  componentDidMount: function() {
    if (!this.props.url) this.setState({
      loading: false
    });
  },
  initChildData:function(){
    var childData={}
    React.Children.map(this.props.children, function(child, idx) {
      if (child.type.displayName && tools.indexOf(allFormComp, child.type.displayName) >= 0) {
        childData[child.props.name]="";
      }
    })
    return childData;
  },
  rendChildHtml: function() {


    var all=React.Children.map(this.props.children, function(child, idx) {
    var props = child.props;
    var childData=this.state.childData;
    
    var _this=this;
      if (props.Submit) {
        this.haveBtn = true;
        return React.cloneElement(child, {
          onClick: this.goSub
        });
      } /*else if (child.type.displayName && tools.indexOf(allFormComp, child.type.displayName) >= 0) {
        var mixChangeFn = function(value) {
          console.log(value)
          if (child.props.onItemChange) child.props.onItemChange(value);
          _this.dataChange(props.name,value);
        }
        var value = props.value ? props.value:childData[props.name];

          return React.cloneElement(child, {
            onItemChange:  _this.dataChange,
            value:value
          });
      }*/
      return React.cloneElement(child);
    }, this)


    return all;
  },
  upDataForm: function() {
    var _this = this;
    $.get(this.props.url, function(data) {
      _this.setState({
        loading: false,
        rendData: data.data
      });
    }, 'json')
  },
  propsSetForm: function(data) {
    this.setState({
      loading: false,
      rendData: data||this.props.rendData
    });
  },
  goSub: function(e) {
    e.preventDefault();
    var _this = this;
    var formDom = $("#" + this.props.name + "Dom");
   
    var postData = formDom.serializeArray();
    if (this.props.postUrl) {
      $.post(this.props.postUrl, postData, function(data) {
        alert(data.info);
        if (_this.props.getSubVal) _this.props.getSubVal(postData, data);
      }, 'json')
    } else {

      _this.props.getSubVal(postData);
    }
  },
  getFormHtml: function(res) {
    var rendHtml = [];
    var _this = this;
    var n = 0;
    for (var i in res) {
      n++;
      var newSelFields = res[i];
      var newArr = this.getComponents(newSelFields, i, n);
      rendHtml = rendHtml.concat(newArr)
    }
    return rendHtml;
  },
  dataChange: function(name,value) {
      var data=this.state.childData;
      data[name]=value;
      this.setState({childData:data});
  },
  setTab: function(value, arr) {
    var newData = this.state.rendData;
    newData[arr].defaultValue = value;
    this.setState({
      data: newData
    })
  },
  getComponents:function(newSelFields,i,n){
    var rendHtml=[];
    n=this.props.liNum?n+'.':'';
    newSelFields.defaultValue=newSelFields.defaultValue?newSelFields.defaultValue:newSelFields.value;
    if(newSelFields.type=="input"||newSelFields.type=="select"||newSelFields.type=="textarea"||newSelFields.type=="password"||newSelFields.type=="hidden"){
        if(newSelFields.type=="password"){ 
          newSelFields.type="input";
          var x=true;
        }

        rendHtml.push(
          <InputEle key={i} value={newSelFields.defaultValue}  ispwd={x} type={newSelFields.type} ref={newSelFields.field} title={n+newSelFields.name} name={newSelFields.field} optionsArr={newSelFields.optionsArr} />
        );
      }else if(newSelFields.type=="datetime"){

        rendHtml.push(
          <DateInputEle key={i} value={newSelFields.defaultValue} format={newSelFields.format}  ref={newSelFields.field} title={n+newSelFields.name} name={newSelFields.field} />
        );
      }else if(newSelFields.type=="html"){
        rendHtml.push(
          <HtmlInputEle key={i} value={newSelFields.defaultValue}  ref={newSelFields.field} title={n+newSelFields.name} name={newSelFields.field} />
        );
      }else if(newSelFields.type=="video"){
        rendHtml.push(
          <InputEle key={i} value={newSelFields.defaultValue} type="input" ref={newSelFields.field} title={n+newSelFields.name} name={newSelFields.field} />
        );
      }else if(newSelFields.type=="radio"||newSelFields.type=="checkbox"){
        var options=newSelFields.options;
        var newArr=[];
        for(var x in options){
          newArr.push({tit:options[x].name,val:options[x].value})
        }

        rendHtml.push(
        <CheckRadio key={i} getTitle={newSelFields.getTitle?newSelFields.getTitle:false} inline={newSelFields.inline} selLen={newSelFields.count||1} value={newSelFields.defaultValue} ref={newSelFields.field}  optionsArr={newArr}  type={newSelFields.type} title={n+newSelFields.name}   name={newSelFields.field} />
        );
      }else if(newSelFields.type=="tab"){
        var options=newSelFields.options;
        var newArr=[];
        for(var x in options){
          newArr.push({tit:options[x].name,val:options[x].value})
        }
        rendHtml.push(
        <CheckRadio key={i} callBack={this.setTab} selStr={i} key={i} value={newSelFields.defaultValue} ref={newSelFields.field} inline="true"  optionsArr={newArr}  type="radio" title={n+newSelFields.name}   name={newSelFields.field} />
        );
        var  newArr=[]
        for(var h in newSelFields.options){
          for(var x in newSelFields.options[h].child){
            if(newSelFields.defaultValue==newSelFields.options[h].value){
              newArr.push(<div key={x} >{this.getComponents(newSelFields.options[h].child[x],newSelFields.name,newSelFields.name)}</div>);
            }
          }
        }
        rendHtml=rendHtml.concat(newArr);
      }else if(newSelFields.type=="images"){
        rendHtml.push(
          <SelUpImg key={i} isSetText={newSelFields.isSetText?newSelFields.isSetText:false} selLen={newSelFields.count}  value={newSelFields.defaultValue} ref={newSelFields.field} title={n+newSelFields.name}  name={newSelFields.field} />
        );
      }else if(newSelFields.type=="image_text"){
        rendHtml.push(
          <SetMobileCont  key={i} value={newSelFields.defaultValue} ref={newSelFields.field} title={n+newSelFields.name}  name={newSelFields.field}/>
        );
      }else if(newSelFields.type=="position"){
        rendHtml.push(
          <InputPosition value={newSelFields.defaultValue} key={i} ref={newSelFields.field}  title={n+newSelFields.name}   name={newSelFields.field} />
        );
      }else if(newSelFields.type=="codeInput"){
        rendHtml.push(
          <div className="pb15">
            <InputEle key={i} value={newSelFields.defaultValue} type="input"  title={n+newSelFields.name} name={newSelFields.field} />
            <GetMsgCode postData={newSelFields.data} />
          </div>
        );
      }else if(newSelFields.type=="modal_select"){

        rendHtml.push(
          <SelTags key={i} tagsArr={newSelFields.defaultValue?newSelFields.defaultValue:[]} selLen={newSelFields.count} source={newSelFields.source}  title={newSelFields.name} name={newSelFields.field} />
        );
      }

      return rendHtml;

  },
  haveBtn:false,
  render: function() {
  
    if (this.state.loading) {
      return (<div className="cont-wrap white-bg  mt30 mAuto  tc">正在加载中...</div>)
    } else {
      var allGetHtml = this.getFormHtml(this.state.rendData);
      var FormObj = this;
      var childData = this.state.childData;
      return (
        <div className={this.props.className}>
          <form id={this.props.name+"Dom"}>
                {allGetHtml}  
       
                
                {this.rendChildHtml()}
                {!this.haveBtn?<div className="tc pt30 pb30"><a onClick={this.goSub} className=" base-btn block btn">保存</a></div>:""}
              
          </form>
        </div>
      );
    }
  }
});

module.exports = RenderForm;