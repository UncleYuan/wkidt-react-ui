/** 
* @fileOverview react Modal组件封装 
* @author <a href="">pan</a> 
* @version 0.1 
*/
/** 
* @author pan 

* @description react PicLightBox组件封装  
* @since version 0.2 
* @param  Props {String} show             设置modal显示隐藏,如果从父级传参，需配合onClose修改状态
* @param  Props {String} title            标题  
* @param  Props {Function} onClose        当窗口关闭时的事件回调
* @param  Props {String} showClass        modal显示时，添加的样式
* @param  Props {String} hideClass        modal隐藏时，添加的样式
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import tools from '../tools/public_tools';
import Modal from './Modal';
import DragBox from './DragBox';
class PicLightBox extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      idx: props.idx,
      imgCenterNum: 0,
      ...this.state
    }
  }
  static defaultProps = {
    show: false,
    title: "新窗口",
    showClass: 'fadeInUp',
    hideClass: 'fadeOutUp',
    infoList: [],
    imgList: [],
    onClose: function () { },
    onSelectImg: function () { }
  };
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.idx != this.props.idx && nextProps.idx != this.state.idx) {
      this.setState({ idx: nextProps.idx });
    }
  }
  selectIdx = (i) => {

    this.setState({ idx: i });
    this.props.onSelectImg(i);
  }
  render() {
    let { show, idx } = this.state;
    let { showClass, title, infoList, imgList } = this.props;
    let docBody = document.body;
    let style = { display: show ? "block" : "none" };

    let bgClass = show ? "in" : "";
    let dialogClass = show ? showClass : "hide";

    let h = docBody.offsetHeight < docBody.scrollHeight ? docBody.scrollHeight : docBody.offsetHeight;
    h = document.documentElement.clientHeight;
    let height = { height: h };
    let maxSize = { "maxHeight": (h * 0.8-100) + "px", "maxWidth": window.innerWidth * 0.9 + "px" };
    let isHaveImgList = imgList.length > 1;
    let oSetLeft = document.body.offsetWidth / 2 - ((idx) * 100) - 50;

    return (
      <div className={"pic-light-box " + (isHaveImgList ? "" : "no-img-list")} style={style}>
        <div className={"light-box-bg " + bgClass} style={height} onClick={this.closeModal}></div>
        <div className="light-box-tit"><i className="close" onClick={this.closeModal}>×</i>{title}</div>

        {idx < imgList.length - 1 ? <a href="javascript:;" onClick={() => { this.selectIdx(idx + 1); }} className="right-btn turn-btn iconfont"></a> : null}
        {idx > 0 ? <a href="javascript:;" onClick={() => { this.selectIdx(idx - 1); }} className="left-btn turn-btn iconfont"></a> : null}


        <div className="img-dialog-wrap">
          {imgList[idx] ? <div className="showImg-box"><a href={imgList[idx]} target="_BLANK" className="iconfont icon-jia"></a>{infoList[idx] ? <div className="img-info">{infoList[idx]}</div> : null}<img style={maxSize} className="showImg" src={imgList[idx]} alt="" /></div> : "未选中图片"}
        </div>
        <div className="img-scroll-list">
          {isHaveImgList ? <div className="select-box"></div> : null}
          <div className="img-scroll-in" style={{ "transform": "translateX(" + oSetLeft + "px)" }}>
            {isHaveImgList && imgList.map((o, i) => {
              return (
                <div key={i} onClick={(event) => { this.selectIdx(i, event); }} className={"img-box " + (idx == i ? "active" : "")} >
                  <img src={o} alt={infoList[idx] ? infoList[idx] : null} title={infoList[idx] ? infoList[idx] : null} className="img-item" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}


var containerDOM = null;
var config = {};
var doc = document;
PicLightBox.show = function (opt = { conf: {} }) {
  let conf = opt.conf ? opt.conf : {};
  conf.show = true;
  conf.onClose = () => {
    PicLightBox.close();
  }
  config = conf;
  if (!containerDOM) {
    containerDOM = doc.createElement('div');
    doc.body.appendChild(containerDOM);
  }
  ReactDOM.render(React.createElement(PicLightBox, conf), containerDOM);

};
PicLightBox.close = function () {
  config.show = false;
  ReactDOM.render(React.createElement(PicLightBox, config), containerDOM);
  setTimeout(function () {
    ReactDOM.render(<div />, containerDOM);
  }, 500)
};
export default PicLightBox;


