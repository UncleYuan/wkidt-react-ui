
import React, { Component } from 'react';

import Loading from '../../src/Loading';
import Tabs from '../../src/Tabs';
import Modal from '../../src/Modal';
import Toast from '../../src/Toast';
import ScrollList from '../../src/ScrollList';
import tools from '../../tools/public_tools';
import {Position} from '../../tools/baiduTools';
const newPosition=new Position();
let  id = null;
class Wrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      modalShow:[false,false],
      infoData:{}
    }
    this.first=true;
  }

  componentWillMount() {
    this.getData();
  }
  componentDidUpdate() {
    if(this.first&&!this.state.loading){
      this.first=false;    
    }

  }
  toggleModal=(i)=>{ //切换弹窗显示
    let arr=this.state.modalShow;
    arr[i]=!arr[i]
    this.setState({modalShow:arr})
  }
  
  getData = () => {
   
    try{ id =location.href.match(/[0-9]+.html/)[0].split('.')[0]; }catch(e){}
    if ( id) {
      this.fetchData(id, () => {
        
      });
    } else {
      
    }
  }
  fetchData = (id, callback) => {
  
    fetch('/merchant/' + id + '.do?access_token=' + Token, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        this.setState({infoData:res.data,loading:false})       
    });
  }
  mapOpen=(addr)=>{
    newPosition.getLocation((y,x)=>{
      let addrCode=encodeURIComponent(addr);
      location.href=`/map.html?lat=${y}&lng=${x}&addr=${addrCode}`;
    })
      
  }

  rendScrollHtml=(data)=>{
            return data.map((obj, idx) => {
                return (
                  <div key={idx} className="db-item ">
                    <div className="db-img">
                      <img src={tools.turnImgSize(obj.indexpic[0],250,250)} alt=""/>
                    </div>
                    <div className="db-bottom">
                      <h5 className="db-tit">{obj.name}</h5>
                      <p className="base-color fs11">
                          {obj.oprice}￥
                      </p>
                    </div>
                    
                  </div>
                )
            })
    }
    rendScrollHb=(data)=>{
            return data.map((obj, idx) => {
                return (
                  <div key={idx} className="hb-item ">
                    <div className="hb-img">
                      <img src={obj.ad_img} alt=""/>
                    </div>
                    <div className="hb-bottom">
                      <h5 className="db-tit">{obj.title}</h5>
                    </div>
                    
                  </div>
                )
            })
    }
  render() {
    let {loading, infoData,modalShow} = this.state;
    let html = [];

      try {

        html = JSON.parse(infoData.description).map((obj, idx) => {
          if (obj.type == 'txt') {
            return (
              <div key={idx} style={{ fontSize: obj.fontSize || 12 }} className={' pt5 pb5'}>{obj.text}</div>
            )
          } else if (obj.type == 'img') {
            return (
              <div key={idx}>
                <img src={obj.src} className="pb5 pt5" alt="" style={{ maxWidth: '100%' }} />
              </div>

            )
          }
        })
      } catch (error) {
        html = infoData.description;
    }
    if (loading) {
      return (<Loading></Loading>)
    }

    return (

      <div className="main container " >
        <Modal title="在首页随机获得" show={modalShow[0]} onClose={()=>{ this.toggleModal(0); }}>
           {infoData.is_bonus==1?<ScrollList  
              dataTel={this.rendScrollHb}
              postData={{merchant_id:id}}
              ajaxType={"get"}
              url={`/bonus.do`}
            ></ScrollList>:""}
        </Modal>
        <div className="big-banner-top" style={{ "backgroundImage":'url('+(infoData.image?tools.turnImgSize(infoData.image,640,256):"/images/merchant_bg.jpg")+')' }}>
          <div className="tr pt10 pr10">
            <div className="icon-bg">
              <i onClick={()=> { Toast.show({msg:"商家已经实名认证"}) }} className="iconfont icon-shiming fs16 vm mr5 warn-color" ></i>
              <i onClick={()=>{ console.log(infoData.is_bonus); if(infoData.is_bonus==1){ this.toggleModal(0) } }} className={"iconfont icon-redbag fs16  vm "+(infoData.is_bonus==0?"desalt-color":"warn-color") }>{infoData.is_bonus==0?"":<span className="fs10 vm pl2 warn-color">红包派送中</span>}</i>
            </div>
            
          </div>
        </div>
        <Tabs btnClass="ub-f1 tab-btn" btnBoxClass="ub ">
          <div title="关于我们">
            <div className="ub member-top mt15 mb20 ">
              <div className="head-img mr20 ml20">
                <img className="img" src={tools.turnImgSize(infoData.avatar,100,100)} alt=""/>
              </div>
              <div className="ub-f1">
                <h5 className="fs13">{infoData.name}</h5>
                <p className="desalt-color">
                  <span className="fs10">入驻时间:{infoData.add_time}</span>
                </p>
              </div>
            </div>
            <div className="fs13 ubl2 desalt-border desalt-color ml20 pl10 mb5">
              {infoData.name}简介
            </div>
            <div className="p10">
              {html}
            </div>
          </div>
          <div title="产品服务">
            <ScrollList  
              dataTel={this.rendScrollHtml}
              postData={{merchant_id:id,sort_type:0}}
              ajaxType={"get"}
              url={`/oneyuan/goods.do`}
            ></ScrollList>
          </div>
          <div title="联系我们">
              <div className="ub  p10  ubb1 fuzzy-border ub-ac list-item" onClick={()=>{ this.mapOpen(infoData.address) }}>
                <div className="ub-f1">
                 <span className="desalt-color fs13">{infoData.address}</span>
                </div>
                <div className=" iconfont icon-you vm"></div>
               </div>
               
               <div className="ub  p10  ubb1 fuzzy-border ub-ac list-item" onClick={()=>{ location.href="tel:"+infoData.phone; }}>
                <div className="ub-f1">
                 <span className="desalt-color fs13">联系人:{infoData.contact}</span>
                </div>
                <span className="desalt-color fs11 pr5">{infoData.phone}</span>
                <div className=" iconfont icon-you vm"></div>
               </div>
          </div>
        </Tabs>

      </div>
    )
  }
}




export default Wrap;
