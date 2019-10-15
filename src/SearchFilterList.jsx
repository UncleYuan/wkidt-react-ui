import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';
import Pager from './Pager';
import Loading from './Loading';
import {InputGroup} from './InputGroup';
import { regComp } from './higherOrders/FormItem';
class SearchFilterListEle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selTagsList: this.props.selTagsList||[],
      selLen: this.props.selLen,
      page: { //分页数据
        page_count: 0, //分页页数
        page_index: 1, //当前页码
        record_count: 0 //共计条数
      },
      loading:false,
      len:this.props.len,
      value: this.props.value,
      searchTxt:""
    };
  }
  static defaultProps={ 
    getTagsArr: false,
    source: "/",
    value: [],
    name: "",
    selTagsList: [],
    onValueChange:function(){},
    len:10,
    selLen:100
  };
  componentWillMount() {

    if(this.props.source) this.upData();
  }
  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.value)!=JSON.stringify(this.props.value)){
      this.setState({value:nextProps.value});
    }
    if(nextProps.selTagsList && JSON.stringify(nextProps.selTagsList)!=JSON.stringify(this.props.selTagsList) ){
      this.setState({selTagsList:nextProps.selTagsList});
    }
  }
  componentDidMount() {


  }
  componentWillUnmount() {

  }
  upData=()=>{
    let {page,len,searchTxt}=this.state;
    let {source}=this.props;
    reqwest({
      url: source,
      type: 'json',
      data:{
        page: page.page_index,
        len: len,
        keyword:searchTxt
      },
      success: (data)=> {

        if(data.code=="SUCCESS"){
           this.setState({
            selTagsList: data.data,
            page: data.page,
            loading:false
          })
         }else{
          this.setState({
            selTagsList:[],
            loading:false
          })
         }
       
      }
    })
  }
  checkIn=(val)=>{
    let {value}=this.state;
    for (let i in value) {
      if (value[i].value == val) {
        return true;
      }
    }
    return false;
  }
  selRow=(val, name)=>{
    let {value} = this.state;
    let {selLen,onValueChange}=this.props;
    if(selLen<=value.length){
        value.shift();
    }
    value.push({
      value: val,
      name: name
    })
    
    this.setState({
      value
    });
    onValueChange(value);
  }
  removeRow=(idx)=>{
    let {value} = this.state;
    value.splice(idx,1);
    this.setState({
      value
    });
    this.props.onValueChange(value);
  }
  textChange=(name,val)=>{
    let setState={};
    setState[name]=val;
    this.setState(setState);
  }
  onSetSelIdx=(idx)=>{ //选择分页回调
    let {page} = this.state;
    page.page_index = idx;
    this.setState({
      page
    });
    this.upData();
  }
  render() {
    let {searchTxt,selTagsList,loading,value,page}=this.state;
    let {title}=this.props;
    return (
      <div className="pb15">
        <InputGroup 
                  placeholder={"搜索对应的"+title+"..."}
                  value={this.state.searchTxt}  
                  barHtml={<button className="btn btn-info fs12"  onClick={()=>{ this.upData()}} type="button">搜索</button>} 
                  onValueChange={(val)=>{ this.textChange("searchTxt",val)}}
                ></InputGroup>
          <div className="ui-select-filter mt15 mb15">
              
                
         
                      <div className="ui-selectable ">
                          <ul className="ui-list" >  
                            <li className="ui-optgroup-label"><span>未选中</span></li>
                            {selTagsList.map(function(obj,idx){
                              if(this.checkIn(obj.value)) return;
                              return(
                                <li key={idx} className="ui-elem-selectable" onClick={()=>{ this.selRow(obj.value,obj.name)}}><span>{obj.name}</span></li>
                              )    
                            },this)}  
                          </ul>
                          {loading ? <div className="fixed-loading-bg"><Loading /></div> : ""}
                      </div>
                      <div className="ui-selection">
                          <ul className="ui-list" >
                    
                            <li className="ui-optgroup-label" ><span>已选中</span></li>
                              {value.map(function(obj,idx){

                                return(
                                  <li key={idx} className="ui-elem-selection" onClick={()=>{ this.removeRow(idx)}}><span>{obj.name}</span></li>
                                ) 
                              },this)}                              
                          </ul>
                      </div>
                  
                </div>
              <Pager all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index}  onSetSelIdx={this.onSetSelIdx} />
          </div>

    );
  }
};
export default regComp(SearchFilterListEle, ['search-filter-list'],{valueType:'Array'});
export const SearchFilterList = SearchFilterListEle;
