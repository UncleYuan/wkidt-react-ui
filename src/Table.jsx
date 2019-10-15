import React, { Component, PropTypes } from 'react';

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static defaultProps = {
        configuration:[{name:'标题',key:'title'},]
    }


    componentWillMount() {

    }


    renderTd = () => {
        let cont = rendData.map(function (obj, idx) {
            return (
            <tr key={idx}>
                <td>
                    <input name="select" checked={this.validChecked(obj.id)} onClick={() => { this.toggleChecked(obj.id) } } className="select-box" type="checkbox" />
                </td>
                <td>{obj.id}</td>
                <td>{obj.title}</td>
                <td>{obj.sub_title}</td>
                <td><img className="w40 h40 br_100 mr10 vm" src={obj.avatar || "/admin/images/head.png"} alt="" />{obj.nickname}</td>
                <td>{obj.shop_name}</td>
                <td>{obj.views}</td>
                <td>{obj.loves}</td>

                <td>{obj.is_recommend == 0 ? "未推荐" : "推荐"}</td>
                <td>

                    <div className="btn-group mb15">
                        {/*<a href={"#/oneyuan/details/edit/" + obj.id} className="btn btn-sm btn-info">进店有米详情</a>*/}
                        <a href="javascript:;" className="btn btn-warn btn-sm " onClick={this.handleAds.bind(this, obj.id, obj.is_recommend)}>{obj.is_recommend == 0 ? "开启" : "关闭"}</a>

                    </div>
                </td>
            </tr>);
        }, this)
    }

    renderTh = (configuration) => {

        return configuration.map((th, index) => {
            return (

                <thead>
                    <tr>
                        <th>
                            <input name="select" checked={this.validCheckedAll()} onClick={() => { this.toggleCheckedAll() } } className="select-box" value="all" type="checkbox" />
                        </th>
                        <th>id</th>
                        <th>标题</th>
                        <th>子标题</th>
                        <th>昵称</th>
                        <th>商店名</th>
                        <th>查看次数</th>
                        <th>喜欢人数</th>
                        <th>状态</th>
                        <th>推荐</th>
                    </tr>
                </thead>
            )
            
        })

    }


    render() {

        return (
            <table className="table mt20 table-striped ">

                <tbody>
                    {cont}
                </tbody>
            </table>
        );
    }
}

Table.propTypes = {
    configuration: PropTypes.array.isRequired
};

export default Table;