
import React, {
    Component,
    PropTypes
} from 'react';
import reqwest from 'reqwest';
import Modal from '../src/Modal';
import Pager from '../src/Pager';
import Form from '../src/Form';
import Loading from '../src/Loading';
import Toast from '../src/Toast';
import Process from '../src/Process';
import tools from '../tools/public_tools';
import form_tools from '../tools/form_tools';

import FormCtrl from '../src/FormCtrl';
import FileSingle from '../src/FileSingle';
import Input from '../src/Input';
import TimeSelector from '../src/TimeSelector';
import Alert from '../src/Alert';
import { CheckRadio } from '../src/CheckRadio';

import { TimeSelectInput } from '../src/TimeSelectInput';
import { InputGroup } from '../src/InputGroup';



const FormDataPro =  //审核探客
    [
        {
            "name": "order_id",
            "label": "订单id",
            "value": "",
            "readOnly": true,
            "type": "text"
        },
        {
            "name": "status",
            "label": "设置发货",
            "value": "",
            "type": "radio",
            "checkradioStyle": "btn",
            "inline": true,
            "options": [
                { "name": "不发货", "value": "0" },
                { "name": "发货", "value": "1" }
            ]
        },
        {
            "name": "address_name",
            "label": "收货人姓名",
            "value": "",
            "type": "text",
            "readOnly": true
        },
        {
            "name": "address_phone",
            "label": "收货人电话",
            "value": "",
            "type": "text",
            "readOnly": true
        },
        {
            "name": "address",
            "label": "收货地址",
            "value": "",
            "type": "textarea",
            "readOnly": true
        },
        {
            "name": "kd_name",
            "label": "快递名",
            "value": "",
            "type": "text"
        },
        {
            "name": "kd_number",
            "label": "快递号",
            "value": "",
            "type": "text"
        },
        {
            "name": "kd_time",
            "label": "发快递的时间",

            "type": "time-select-input",
            "format": 'y-m-d-h-i'
        }
    ]



const defaultProps = {
};

class AdsCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //是否加载中， 保留，暂无作用
            modalShow: [false, false], //是否显示编辑表单弹窗
            rendData: [], //列表数据
            selArr: [], //选择列表数组,保留,用于全选
            page: { //分页数据
                page_count: 0, //分页页数
                page_index: 1, //当前页码
                record_count: 0 //共计条数
            },
            len: 30, //分页长度
            logList: [],
            searchTxt: "",
            auditType: '4',
            formData: tools.deepCopy(FormDataPro) //表单数据渲染
        };
        this.openContId = ""
    }
    componentWillReceiveProps(nextProps) {


    }
    componentDidMount() {
        this.upData();

    }
    textChange = (name, val) => {
        let setState = {};
        setState[name] = val;
        this.setState(setState);
        if (name == "len") {
            clearTimeout(this.timer);
            let page = this.state.page;
            page.page_index = 1;
            this.setState({
                page: page
            })
            this.timer = setTimeout(() => {
                this.upData();
            }, 500)
        }
    }
    upData = (callback) => { //更新表单数据
        let {page, len, searchTxt} = this.state;
        this.setState({
            loading: true
        })
        let postData;
        if (this.state.auditType == 'none') {
            postData = { name: searchTxt, page: page.page_index, len }
        } else {
            postData = { name: searchTxt, page: page.page_index, len, status: this.state.auditType }
        }
        fetch('oneyuan/order.do?' + tools.parseParam(postData), {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                if (data.code == "SUCCESS") {
                    this.setState({
                        rendData: data.data,
                        page: data.page,
                        selArr: [],
                        loading: false
                    })
                    if (callback) callback();
                } else if (data.code == "NO_DATA") {
                    this.setState({
                        rendData: [],
                        selArr: [],
                        page: {
                            page_count: 0,
                            page_index: 1,
                            record_count: 0
                        },
                        loading: false
                    })
                }
                if (callback) callback();
            });

    }


    toggleModal = (i) => { //切换弹窗显示
        let arr = this.state.modalShow;
        arr[i] = !arr[i]
        this.setState({ modalShow: arr })
    }


    onSetSelIdx = (idx) => { //选择分页回调
        let page = this.state.page;
        page.page_index = idx;
        this.setState({
            page: page
        });
        this.upData();
    }
    validChecked = (id) => {
        return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
    }
    validCheckedAll = () => {
        let rendData = this.state.rendData;
        for (let i in rendData) {
            if (tools.indexOf(this.state.selArr, rendData[i].id) < 0) {
                return false;
            }
        }
        return true;
    }
    toggleChecked = (id) => {
        let selArr = this.state.selArr;
        if (tools.indexOf(selArr, id) >= 0) {
            selArr = tools.removeArr(selArr, id);
        } else {
            selArr.push(id);
        }
        this.setState({
            selArr: selArr
        });
    }
    toggleCheckedAll = () => {

        let newArr = [];

        if (this.state.selArr.length == 0) {
            for (let i in this.state.rendData) {
                newArr.push(this.state.rendData[i].id);
            }
        }
        this.setState({
            selArr: newArr
        });
    }




    sureDelItem = (id) => {

        let {page} = this.state;

        fetch('/ads/ads_manage_delete.do', {
            method: "DELETE",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam({
                ids: id instanceof Array ? id.join(',') : id
            })
        }).then(response => response.json())
            .then((data) => {
                Modal.close();
                if (data.code == "SUCCESS") {
                    page.page_index = 1;
                    this.setState({
                        page
                    })
                    this.upData();
                }
                Toast.show({
                    msg: data.info
                })
            });
    }
    removeItem = (id) => { //删除数据
        id = id != "all" ? id : this.state.selArr;
        if (id.length == 0) {
            Alert.show({
                cont: "请选择删除对象"
            })
            return;
        }
        Modal.show({
            child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的广告？</div>,
            conf: {
                footer: (
                    <a href="javascript:;" onClick={() => {
                        this.sureDelItem(id)
                    } } className="btn btn-info">确定删除</a>)
            }

        })


    }
    openLogs = (id) => {
        this.openContId = id;
        this.toggleModal(0)
        fetch('/ads/ads_audit_record.do?' + tools.parseParam({ ads_id: id }), {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                if (data.code == "SUCCESS") {
                    this.setState({ logList: data.data })
                } else {
                    this.setState({ logList: [] })
                }
            });
    }
    openSh = (obj) => {
        this.toggleModal(1);
        let formData = tools.deepCopy(FormDataPro)

        // formData[0].value = obj.id;
        for (let i in obj) {
            if ('order_id,address_name,address_phone,address'.indexOf(i) >= 0) {
                obj[i] = obj[i];
            }
            formData = form_tools.setArrObjVal(formData, i, obj[i])
        }

        this.setState({ 
            formData: formData || [] ,
            id:obj.id
        })
    }
    subSh = (data) => {
       
        Process.show();
        fetch(`oneyuan/order/fahuo.do`, {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam({
                status: data.status[0],
                ids: this.state.id,
                kd_name: data.kd_name,
                kd_number: data.kd_number,
                kd_time: data.kd_time
            })
        }).then(response => response.json())
            .then((data) => {
                Process.Close();
                Toast.show({ msg: data.info });
                this.toggleModal(1);
            });
    }
    rendlogs = () => {
        let {logList} = this.state;
        return (
            <div className="table-responsive fixed-loading">
                <table className="table mt20 table-striped ">
                    <thead>
                        <tr>
                            <th>记录表id</th>
                            <th>广告id</th>
                            <th>管理员</th>
                            <th>审核记录的时间</th>
                            <th>备注</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            if (logList.length == 0) {
                                return (<tr><td className="tc" >暂无记录</td></tr>)
                            }
                            return logList.map(function (obj, idx) {
                                return (<tr key={idx}>
                                    <td>{obj.id}</td>
                                    <td>{obj.ads_id}</td>
                                    <td>
                                        {obj.admin_name}
                                    </td>
                                    <td>{obj.add_time}</td>
                                    <td>{obj.remark}</td>
                                    <td>{obj.ads_audit_status}</td>
                                </tr>);
                            }, this)
                        })()}
                    </tbody>
                </table>
            </div>

        )
    }
    handleAuditType = (num) => {
        this.setState({
            auditType: num,
            rendData:[]
        }, () => {
            this.upData();
        });
    }
    handleAds = (id, status) => {
        let num = status == 0 ? 1 : 3;
        fetch(`/ads/ads_manage_down.do?` + tools.parseParam({ id: id, status: num }), {
            method: "get",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            // body: tools.parseParam({
            //   status: num,
            //   remarks: data.remarks,
            //   id: id
            // })
        }).then(response => response.json())
            .then((data) => {
                Process.Close();
                Toast.show({ msg: data.info });
                // this.toggleModal(1);
            });
    }
    render() {
        let {rendData, loading, formData, modalShow, page, len, auditType} = this.state;

        let cont = rendData.map(function (obj, idx) {
            return (<tr key={idx}>
                <td>
                    <input name="select" checked={this.validChecked(obj.id)} onClick={() => { this.toggleChecked(obj.id) } } className="select-box" type="checkbox" />
                </td>
                <td>{obj.id}</td>
                <td>{obj.name.substr(0, 10)}</td>
                <td>{obj.order_id}</td>
                <td>{obj.nickname}</td>
                <td>{obj.phone}</td>
                <td>{obj.gon_umber}</td>
                <td>{obj.pay_money}</td>
                <td>{obj.addtime}</td>
                <td>{obj.award_code}</td>
                <td>{obj.award_code_status}</td>

                <td>

                    <div className="btn-group mb15">
                        <a href={"#/oneyuan/order/details/" + obj.id} className="btn btn-sm btn-info">订单详细</a>
                        <a href={"#/oneyuan/order/saidanlist/" + obj.l_id} className="btn btn-sm btn-default">晒单列表</a>
                        {auditType == '3'||auditType == '6'  ? <a href={"#/oneyuan/order/saidan/add/" + obj.l_id + '/' + obj.vip_id} className="btn btn-sm btn-warn">添加晒单</a> : ""}
                        {auditType == '5' ? <button className="btn btn-warn" onClick={() => { this.openSh(obj) } } type="button">设置发货</button>:""}
                    </div>
                </td>
            </tr>);
        }, this)
        let LoadCont = loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
        return (
            <div>

                <div className="wrapper">
                    <section className="panel">

                        <div className="panel-body">
                            <div className="row">
                                <div className=" col-md-9">
                                    <div className="btn-group mb15">

                                        <div className="inline-block  fs12 desalt-color  pb5  ml30  mr30">状态:</div>
                                        <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "none")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "none" ? "btn-info" : "")}>所有状态</a>
                                        <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "2")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "2" ? "btn-info" : "")}>未中奖订单</a>
                                        <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "1")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "1" ? "btn-info" : "")}>中奖订单</a>
                                        
                                        <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "4")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "4" ? "btn-info" : "")}>中奖未发货</a>
                                        <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "5")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "5" ? "btn-info" : "")}>中奖待发货</a>
                                        <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "3")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "3" ? "btn-info" : "")}>中奖已发货</a>
                                        
                                        <a style={{ 'cursor': 'pointer' }} onClick={this.handleAuditType.bind(this, "6")} className={"btn fs11 ml10 mr10 mb5 " + (this.state.auditType == "6" ? "btn-info" : "")}>中奖已收货</a>
                                    </div>
                                </div>
                                <div className=" col-md-3 pb10">
                                    <InputGroup placeholder="请在这里输入搜索商品名字" value={this.state.searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => { this.upData() } } type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) } }></InputGroup>

                                </div>
                            </div>

                            <div id="column-table">
                                <Modal title="查看审核记录" maxWidth="1000" show={modalShow[0]} onClose={() => { this.toggleModal(0) } }>
                                    {this.rendlogs()}
                                </Modal>
                                <Modal title="设置订单" sizeClass="sm" maxWidth="1000" show={modalShow[1]} onClose={() => { this.toggleModal(1) } }>
                                    {modalShow[1] ? <Form formStyle="ver" formRendData={formData} onSubForm={this.subSh} /> : ""}
                                </Modal>
                                <div className="table-responsive fixed-loading">
                                    <table className="table mt20 table-striped ">
                                        <thead>

                                            <tr>
                                                <th>
                                                    <input name="select" checked={this.validCheckedAll()} onClick={() => { this.toggleCheckedAll() } } className="select-box" value="all" type="checkbox" />
                                                </th>
                                                <th>id</th>
                                                <th>商品名</th>
                                                <th>订单id</th>
                                                <th>用户昵称</th>
                                                <th>手机号码</th>
                                                <th>购买次数</th>
                                                <th>付款金额</th>
                                                <th>添加时间</th>
                                                <th>中奖号</th>
                                                <th>状态</th>

                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cont}
                                        </tbody>
                                    </table>

                                    {LoadCont}

                                </div>
                                <div className="pb15">
                                    <div className="row">
                                        <div className="col-md-9 col-lg-10 pb10">
                                            <Pager className=" " all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index} onSetSelIdx={this.onSetSelIdx} />
                                        </div>
                                        <div className="col-md-3  col-lg-2">
                                            <InputGroup value={len} barHtml={<span className="btn gray-bg fs12">每页条数</span>} onValueChange={(val) => { this.textChange('len', val) } }></InputGroup>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

        );
    }
}

AdsCont.defaultProps = defaultProps;
module.exports = AdsCont;