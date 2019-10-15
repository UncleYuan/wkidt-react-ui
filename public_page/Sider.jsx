import React,{Component} from 'react';
import reqwest from 'reqwest';
var MenuData=[
  {tit:"首页",icon:"home",url:"/admin/index",children:[]},
  {tit:"内容管理",icon:"xia",children:[
    {tit:"栏目管理",url:"/admin/article_type_list"},
    {tit:"文章管理",url:"/admin/article_list"}
  ]},
  {tit:"退出系统",icon:"sign-in",url:"/admin/logout",children:[]},
]
const newMenuData=[
  
]
class Sider extends Component {
    constructor(props) {
        super(props);
        this.state = {
          openMenuId:parseInt(this.props.openMenuId),
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
  }
  toggleMenu=(idx)=>{
   
    let setIdx=this.state.openMenuId;
    if(setIdx==idx){
      setIdx=false;
    }else{
      setIdx=idx;
    }
    this.setState({openMenuId:setIdx});
   
  }

  handlePost=(name)=>{
    
    if(this.props.handlePost){
      this.props.handlePost(name);
    }
  }
  
  render () {
    let {menuData}=this.props;
    let newArr=menuData.concat(newMenuData);

    return (

      <div className="left-side sticky-left-side"  style={{overflow:"hidden", outline:"none"}}>
        

        
        <div className="left-side-inner">

            <div className="sider-top-head"></div>

            <ul className="nav nav-pills nav-stacked custom-nav">
              {newArr.map(function(obj,idx){
                let childrenHtml=[];
                if(obj.children.length>0){
                  for(let i in obj.children){
                    childrenHtml.push(<li key={i}><a href={obj.children[i].url?"#/"+obj.children[i].url:'javascript:;' } onClick={this.handlePost.bind(this,obj.children[i].name)}>{obj.children[i].name}</a></li>);
                  }
                }
                let liClass=obj.children.length>0?"menu-list":"";
                liClass=idx===this.state.openMenuId?liClass+" nav-active":liClass;
                return (
                    <li key={idx} className={liClass} onClick={this.toggleMenu.bind(this,idx)}>
                      <a href={childrenHtml.length==0?"#"+obj.url:"javascript:;"}><i className={"iconfont icon-"+obj.icon} ></i><span>{obj.name}</span></a>
                      <ul className="sub-menu-list">
                        {childrenHtml}
                      </ul>
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


