import React, {
    Component,
    PropTypes
} from 'react';

import Modal from '../src/Modal';
import Pager from '../src/Pager';
import Form from '../src/Form';
import Loading from '../src/Loading';
import Toast from '../src/Toast';
import Process from '../src/Process';
import tools from '../tools/public_tools';
import form_tools from '../tools/form_tools';
/*import RenderForm from '../src/RenderForm';*/
import FormCtrl from '../src/FormCtrl';
import Input from '../src/Input';
import Select from '../src/Select';
import Alert from '../src/Alert';
import { CheckRadio } from '../src/CheckRadio';

function transform(obj) {
    var arr = [];
    for (var item in obj) {
        arr.push(obj[item]);
    }
    return arr;
}

const formData = [
    {
        "name": "name",
        "label": "菜单名称",
        "value": "",
        "type": "text"
    },
    {
        "name": "resource_id",
        "label": "关联的菜单资源",
        "value": "",
        "type": "select-single",
        "options": []
    },
    {
        "name": "parent_id",
        "label": "父级菜单",
        "value": "",
        "type": "select-single",
        "options": []
    },
    {
        "name": "remark",
        "label": "备注",
        "value": "",
        "type": "textarea"
    },
    {
        "name": "listorder",
        "label": "排序",
        "value": "",
        "type": "text"
    }
]

const typeTree = function (result, parent_id) {
    var rtn = [];
    var i;
    for (i in result) {
        if (result[i].parent_id == parent_id) {
            result[i].children = typeTree(result, result[i].id);
            rtn.push(result[i]);
        }
    }
    return rtn;
}


const formData1 = [
    {
        "name": "value",
        "label": "字段值",
        "value": "",
        "type": "text"
    }, {
        "name": "text",
        "label": "字段文本",
        "value": "",
        "type": "text"
    }
]

class MenuList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalShow: false,
            rendData: [],
            selArr: [],
            exArr: [],
            formData: tools.deepCopy(formData), //表单数据渲染
            options: [],
            parentId: [],
            resourceData: []
        };
        this.formType = "add";//表单当前类型，添加（add）还是编辑（edit）

    }


    componentWillMount() {
        this.upData();
        this.getResouceData();
    }


    upData = (callback) => { //更新表单数据
        var parent_id = 0;
        this.setState({ loading: true })
        fetch('/system/my-menu.do?' + tools.parseParam(parent_id), {
            method: "get",
            credentials: 'same-origin',
        }).then(response => response.json())
            .then((data) => {
                fetch('/system/menu.do?' + tools.parseParam({ parent_id: 0 }), {
                    method: "get",
                    credentials: 'same-origin',
                }).then(response => response.json()).then((res) => {
                    this.setState({
                        allParentMenu: res.data.data,
                        loading: false
                    })
                })
                let exArr = typeTree(data.data.data, 0);
                this.setState({
                    rendData: transform(data.data.data),
                    exArr: exArr
                })
                if (callback) callback();

            });

    }

    getResouceData() {
        fetch('/system/resource.do?' + tools.parseParam({ type: '1' }), {
            method: "get",
            credentials: 'same-origin',
        }).then(response => response.json()).then((result) => {
            const resourceData = result.data;
            let resourceList = [];
            for (let i = 0; i < resourceData.length; i++) {
                let resourceObj = {};
                resourceObj.name = resourceData[i].name;
                resourceObj.value = resourceData[i].id;
                resourceList.push(resourceObj);
            }
            this.setState({
                resourceData: resourceData,
                resourceList: resourceList
            })
        })

    }


    componentWillReceiveProps(nextProps) {


    }
    componentDidMount() {
        // this.upData();

    }


    eidtColumn = (item) => { //编辑数据

        let nowData = tools.deepCopy(formData);
        let obj = {
            "value": Number(item.id),
            "name": 'id',
            "type": "text",
            "style": { display: 'none' }
        }
        nowData.push(obj)

        for (var i = 0; i < nowData.length; i++) {
            var element = nowData[i];
            if (element.name == 'name') {
                element.value = item.name;
            } else if (element.name == 'remark') {
                element.value = item.remark;
            } else if (element.name == 'listorder') {
                element.value = item.listorder;
            }
        }

        // 获取所有菜单
        const parentData = this.state.allParentMenu;
        let parentId = [];
        let resourceId;
        for (let i = 0; i < parentData.length; i++) {
            let parentObj = {};
            parentObj.value = parentData[i].id;
            parentObj.name = parentData[i].name;
            parentId.push(parentObj);
            if (parentData[i].id == item.id) {
                resourceId = parentData[i].resource_id
            }
        }

        for (let k = 0; k < nowData.length; k++) {
            let element = nowData[k];

            if (element.name == 'parent_id') {
                // nowData[k].options = this.state.parentId;
                nowData[k].options = parentId;

                nowData[k].value = [item.parent_id]
                nowData[k].options.unshift({ name: '顶层菜单', value: 0 })
            }

            if (element.name == 'resource_id') {


                nowData[k].options = this.state.resourceList;
                nowData[k].value = [resourceId]

            }

        }

        this.formType = "eidt";
        this.setState({
            formData: nowData
        })
        this.toggleModal();
    }

    addColumn = () => { //添加数据
        let nowData = tools.deepCopy(formData);
        this.formType = "add";
        // 父级菜单
        let parentId = [];
        let parentData = this.state.allParentMenu;
        for (let i = 0; i < parentData.length; i++) {
            let parentObj = {};
            parentObj.value = parentData[i].id;
            parentObj.name = parentData[i].name;
            parentId.push(parentObj);

        }
        parentId.unshift({ name: '顶层菜单', value: 0 })

        for (let k = 0; k < nowData.length; k++) {
            let element = nowData[k];
            if (element.name == 'parent_id') {
                nowData[k].options = this.state.parentId;
                nowData[k].options = parentId;
            }

            if (element.name == 'resource_id') {
                nowData[k].options = this.state.resourceList;
            }

        }


        this.setState({
            formData: nowData,
            modalShow: !this.state.modalShow
        })

    }

    addChild = (item) => {
        this.formType = "add";

        let nowData = tools.deepCopy(formData);
        let parentId = [];
        let parentObj = {};
        parentObj.name = item.name;
        parentObj.value = item.id;
        parentId.push(parentObj)
        for (let k = 0; k < nowData.length; k++) {
            let element = nowData[k];
            if (element.name == 'parent_id') {
                nowData[k].value = [item.id];
                nowData[k].options = this.state.parentId;
                nowData[k].options = parentId;
            }

            if (element.name == 'resource_id') {
                nowData[k].options = this.state.resourceList;
            }

        }

        this.setState({
            formData: nowData,
            modalShow: !this.state.modalShow
        })

    }



    toggleModal = () => { //切换弹窗显示
        this.setState({
            modalShow: !this.state.modalShow
        })
    }
    toggleTable = () => {
        this.setState({
            showTable: !this.state.showTable
        })
    }

    // addColumn = () => { //添加数据
    //     this.formType = "add";
    //     this.setState({
    //         formData: formData,
    //         modalShow: !this.state.modalShow
    //     })
    // }

    validChecked = (id) => {
        return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
    }

    showTable = (obj) => {
        let {page1, len1, showTable} = this.state;
        fetch('/system/dictionary/' + obj.id + '/table.do' + tools.parseParam({ page: page1.page_index, len: len1 }), {
            method: "get",
            credentials: 'same-origin',
        }).then(response => response.json()).then((result) => {
            let rendData1 = result.data;
            this.setState({
                keyValueObj: obj,
                rendData1: rendData1,
                showTable: !showTable,
            })
            if (result.code == 'SUCCESS') {
                this.setState({
                    page1: result.page
                })
            } else if (result.code == 'NO_DATA') {
                Toast.show({ msg: result.info })
            }
        })

    }

    setEidtForm = (data) => { //保存表单

        let url = "";
        let {formData, page} = this.state;
        if (this.formType == "add") {

            url = "/system/menu.do";

        } else {
            url = "/system/menu/" + data.id + ".do";
        }

        let obj = {};
        for (let i in data) {
            obj[i] = data[i]
        }
        obj.parent_id = data.parent_id[0];
        obj.resource_id = data.resource_id[0];

        delete data.type;
        fetch(url, {
            method: this.formType == "add" ? "post" : "put",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam(obj)
        }).then(response => response.json()).then((data) => {
            Toast.show({ msg: data.info });
            if (data.code != "SUCCESS") {
                this.setState({
                    formData: formData
                })
            } else {
                this.toggleModal();

                if (this.formType == "add") {

                    page.page_index = 1;
                    this.setState({
                        page: page,
                        formData: []
                    });
                }
                this.upData(function () {

                });
            }
        })


    }

    // setEidtForm=(data)=>{  //保存表单
    //  let _this = this;
    //  let url="";
    //  if(this.formType=="add"){
    //    url = '/system/menu.do';
    //  }
    //  if (this.formType=='eidt') {
    //    if (data.parent_id =='') {
    //      alert('请选择父级菜单')
    //    }else if (data.resource_id=='') {
    //      alert('请选择关联的菜单资源')
    //    }else{
    //      url = '/system/menu/'+ data.id +'.do';
    //    }

    //  }

    //  delete data.type;
    //  $.ajax({
    //    url:url,
    //    type:this.formType=="add"?"post":"put",
    //    data:data,
    //    success:function(data){
    //      alert(data.info);
    //      if(data.code!="SUCCESS"){
    //        _this.setState({formData:_this.state.formData})
    //      }else{
    //        _this.toggleModal();

    //        if(_this.formType=="add"){
    //          _this.setState({formData:[]});
    //        }
    //        _this.upData();
    //      }
    //    }
    //  })
    // }

    onSetSelIdx = (idx) => { //选择分页回调
        let {page} = this.state;
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
        let {rendData, selArr} = this.state;
        for (let i in rendData) {
            if (tools.indexOf(selArr, rendData[i].id) < 0) {
                return false;
            }
        }
        return true;
    }
    toggleChecked = (id) => {
        let {selArr} = this.state;
        if (tools.indexOf(selArr, id) >= 0) {
            selArr = tools.removeArr(selArr, id);
        } else {
            selArr.push(id);
        }
        this.setState({
            selArr
        });
    }
    toggleCheckedAll = () => {

        let newArr = [];
        let {selArr, rendData} = this.state;
        if (selArr.length == 0) {
            for (let i in rendData) {
                newArr.push(rendData[i].id);
            }
        }
        this.setState({
            selArr: newArr
        });
    }
    sureDelItem = (id) => {
        let {page} = this.state;
        fetch('/system/menu.do', {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam({ id: id })
        }).then(response => response.json()).then((data) => {
            if (data.code == "SUCCESS") {
                Modal.close();
                page.page_index = 1;
                this.setState({ page: page })
                this.upData();
            }
            Toast.show({ msg: data.info })
        })

    }
    removeItem = (id) => { //删除数据
        let {selArr} = this.state;
        id = id != "all" ? id : selArr;

        if (id.length == 0) {
            Modal.show({
                child: "请选择删除对象"
            })
            return;
        }

        Modal.show({
            child: <div className="fs14 ">确认是否要删除id为 <span className="base-color">{typeof (id) != "string" ? id.join(',') : id}</span> 的菜单？</div>,
            conf: {
                footer: (
                    <a href="javascript:;" onClick={() => {
                        this.sureDelItem(id)
                    } } className="btn btn-info">确定删除</a>)
            }

        })
    }

    getKeyValuePage = (obj) => {
        let {page1, len1} = this.state;
        this.setState({
            loading: true
        })
        fetch('/system/dictionary/' + obj.id + '/table.do' + tools.parseParam({ page: page1.page_index, len: len1 }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tools.parseParam({ id: id })
        }).then(response => response.json()).then((result) => {
            let rendData1 = result.data;
            this.setState({
                rendData1: rendData1,
                loading: false
            })
            if (result.code == "SUCCESS") {
                this.setState({
                    page1: result.page
                })
            }
        })
    }

    typeInitHtml(arr, l) {

        l = parseInt(l);
        var li = [];
        var txt = '';
        var addChild = "";
        for (var x = 0; x < l; x++) {
            if (x == 0) {
                txt += '├';
            }
            txt += '──';
        }
        for (var i = 0; i < arr.length; i++) {
            addChild = <a key={i}
                className="btn btn-sm btn-default"
                href="javascript:;"
                onClick={this.addChild.bind(this, arr[i])}>增加子菜单</a>;

            arr[i].parent_id = arr[i].parent_id == 0 ? arr[i].id : arr[i].parent_id;
            if (arr[i].children.length > 0) {
                li.push(
                    <tr key={i} data-lv={l}>
                        <td>
                            <input name="select"
                                checked={this.validChecked.bind(this, arr[i].id)()}
                                onClick={this.toggleChecked.bind(this, arr[i].id)}
                                className="select-box"
                                type="checkbox" />
                        </td>
                        <td>{arr[i].id}</td>
                        <td>{txt + " "}{arr[i].name}</td>
                        <td>{arr[i].remark}</td>
                        <td>{arr[i].url}</td>
                        <td>
                            <div className="btn-group mb15">
                                <a className="btn btn-sm btn-info"
                                    href="javascript:;"
                                    onClick={this.eidtColumn.bind(this, arr[i])}>编辑</a>
                                {addChild}
                                <button className="btn btn-sm btn-default"
                                    href="javascript:;"
                                    onClick={this.removeItem.bind(this, arr[i].id)} >删除</button>
                            </div>
                        </td>
                    </tr>,
                    this.typeInitHtml(arr[i].children, l + 1)
                );
            } else {
                txt = txt.replace('├─', '└─');
                li.push(
                    <tr key={i} data-lv={l}>
                        <td>
                            <input name="select"
                                checked={this.validChecked.bind(this, arr[i].id)()}
                                onChange={this.toggleChecked.bind(this, arr[i].id)}
                                className="select-box"
                                type="checkbox" />
                        </td>
                        <td>{arr[i].id}</td>
                        <td>{txt + " "}{arr[i].name}</td>
                        <td>{arr[i].remark}</td>
                        <td>{arr[i].url}</td>
                        <td>

                            <div className="btn-group m15">
                                <a className="btn btn-sm btn-info"
                                    href="javascript:;"
                                    onClick={this.eidtColumn.bind(this, arr[i])} >编辑</a>
                                {addChild}
                                <button className="btn btn-sm btn-default"
                                    href="javascript:;"
                                    onClick={this.removeItem.bind(this, arr[i].id)} >删除</button>
                            </div>

                        </td>
                    </tr>
                );
            }
        }
        return li;
    }

    render() {
        let {rendData, page} = this.state;
        var _this = this;
        var LoadCont = this.state.loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
        return (
            <div>

                <div className="wrapper">
                    <section className="panel">

                        <div className="panel-body">
                            <div className="btn-group mb15">
                                <a href="javascript:;" onClick={this.addColumn} className="btn btn-info">添加菜单</a>

                                <button className="btn btn-default" onClick={this.removeItem.bind(this, "all")} type="button">删除所选资源</button>
                            </div>
                            <div id="column-table">
                                <Modal
                                    title="编辑资源"
                                    maxWidth="1000"
                                    show={this.state.modalShow}
                                    onClose={this.toggleModal.bind(this)}
                                    name="eidtModal"
                                    sizeClass="sm"
                                    >

                                    <Form
                                        formStyle="ver"
                                        formRendData={this.state.formData}
                                        onSubForm={this.setEidtForm}
                                        />

                                </Modal>

                                <div className="table-responsive fixed-loading">
                                    <table className="table mt20 table-striped ">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input
                                                        name="select"
                                                        checked={this.validCheckedAll.bind(this)()}
                                                        onClick={this.toggleCheckedAll.bind(this)}
                                                        className="select-box"
                                                        value="all"
                                                        type="checkbox"
                                                        />
                                                </th>
                                                <th>菜单id</th>
                                                <th>菜单名</th>
                                                <th>备注</th>
                                                <th>页面地址</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.typeInitHtml(this.state.exArr, 0)}
                                        </tbody>
                                    </table>

                                    {LoadCont}

                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

        );
    }
}


module.exports = MenuList;