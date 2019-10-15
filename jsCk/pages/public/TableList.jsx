import React, { Component, creatElement } from 'react';

import Select from '../../../src/Select';
import Loading from '../../../src/Loading';
import Pager from '../../../src/Pager';
import tools from '../../../tools/public_tools';
let pageProp = {
    page_count: 0,
    page_index: 1,
    record_count: 0
}
class TableList extends Component {
    constructor(props) {
        super(props);
        this.state = {

            listData: [],
            modalShow: [false, false],
            loading: true,
            page: tools.deepCopy(pageProp),
            len: 30,
            selArr: [],
        }
    }
    static defaultProps = {
        fetchData: {},
        url: "",
        headTitArr: [],
        upDataTime:false,
        rendHtml: function (data) {

        }
    }
    componentWillMount() {
        this.getData();

    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.upDataTime!=this.props.upDataTime){
            this.getData();
        }
    }


    getData = () => {
        let { fetchData, url } = this.props;
        let { page, len } = this.state;
        let newFetchData = tools.deepCopy(fetchData);
        newFetchData.p = page.page_index;
        newFetchData.len = len;
        fetch(`${url}?` + tools.parseParam(newFetchData), {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                if (data.code == "SUCCESS") {
                    this.setState({ loading: false, listData: data.data, page: data.page })
                } else if (data.code == "NO_DATA") {
                    this.setState({ loading: false, listData: [], page: tools.deepCopy(pageProp) })
                }

            });
    }
    onSetSelIdx = (idx) => { //选择分页回调
        let { page } = this.state;
        page.page_index = idx;
        this.setState({
            page: page
        });
        this.getData();
    }

    render() {
        const { loading, listData, modalShow, page, len } = this.state;
        const { rendHtml, headTitArr } = this.props;
        let LoadCont = null;
        if (loading) {
            LoadCont = loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
        }
        return (
            <div>
                <table className="table mt20 table-striped ">
                    <tbody>
                        <tr className="table-head-tr">
                            {headTitArr.map((obj, idx) => {
                                return (<th key={idx}>{obj}</th>)
                            })}
                        </tr>
                        {listData.map((obj, idx) => {
                            return rendHtml(obj, idx);
                        })}
                    </tbody>
                </table>
                {LoadCont}
                <div className="p10">
                    <Pager className="" all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index} onSetSelIdx={this.onSetSelIdx} />
                </div>
            </div>
        )
    }
}
export default TableList;
