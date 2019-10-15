import React,{Component} from 'react';
import reqwest from 'reqwest';

const newMenuData=[
  
]
class Sider extends Component {
    constructor(props) {
        super(props);
        this.state = {
          openMenuId:parseInt(this.props.openMenuId),
          menuData:props.menuData,
          show:true
        }
  }
  static defaultProps= {

        menuData:[],
        openMenuId:false
  }
 
  componentWillReceiveProps(nextProps){
    if(nextProps.openMenuId!=this.state.openMenuId){
      this.setState({openMenuId:nextProps.openMenuId});
    }
    if(JSON.stringify(nextProps.menuData)!=JSON.stringify(this.props.menuData)){
      this.setState({menuData:nextProps.menuData});
    }
  }
  toggleMenu=(level)=>{
    let {menuData}=this.state;
    if(level){
      let len=level.length;
      let selVal=menuData;
      for(let i=0;i< len;i++){
        if(i==0){
          selVal=selVal[parseInt(level[i])];
        }else{
          selVal=selVal.children[parseInt(level[i])];
        }
        
      }
      selVal.open=selVal.open?false:true;
      this.setState({menuData});
    }
    
  }
  getChildHtml=(obj,level)=>{
    let childrenHtml=[];

    if(obj.children&&obj.children.length>0){
      for(let i in obj.children){
        let newlevel=level.slice(0);
        newlevel.push(i);
        let openClass=obj.children[i].open?"open":"";
        childrenHtml.push(
          <li key={i} className={"menu-li "+openClass} >
            <a href={obj.children[i].url?"#/"+obj.children[i].url:'javascript:;'}>{obj.children[i].children.length>0?<i className={"iconfont icon-"+obj.children[i].icon}  onClick={()=>{ this.toggleMenu(newlevel);}} ></i>:""}
              <span  onClick={()=>{  if(obj.children[i].click)obj.children[i].click(obj.children[i].id)  }}>{obj.children[i].agent_name}</span>
            </a>
            {obj.children[i].children&&obj.children[i].children.length>0?this.getChildHtml(obj.children[i],newlevel):""}
          </li>
        );
      }
    }
    return (<ul className="sub-menu-list">
              {childrenHtml}
            </ul>);
  }
  render () {
    let {menuData}=this.state;
    let newArr=menuData.concat(newMenuData);
    return (

      <div className="left-side sticky-left-side"  style={{overflow:"hidden", outline:"none"}}>
        

        
        <div className="left-side-inner">

            <div className="sider-top-head"></div>

            <ul className="nav nav-pills nav-stacked custom-nav">
              {newArr.map(function(obj,idx){
                
                let liClass=obj.children.length>0?"menu-list":"";
                liClass=menuData[idx].open?liClass+" nav-active":liClass;
                return (
                    <li key={idx} className={liClass} >
                      <a href={obj.children.length==0?"#"+obj.url:"javascript:;"}  onClick={()=>{ if(obj.children.length>0){this.toggleMenu([idx]); } }}><i className={"iconfont icon-"+obj.icon}></i><span>{obj.agent_name}</span></a>
                      {this.getChildHtml(obj,[idx])}
                    </li>
                  )
              },this)}
                
                
            </ul>


        </div>
    </div>
   
    );
  }
}

export default  Sider;


