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
class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    static defaultProps = {
        fetchData: {},
        url: "",
        headTitArr: [],
        rendHtml: function (data) {

        }
    }
    componentWillMount() {
       
    }
    componentWillReceiveProps(nextProps) {
    }


    render() {

        const {rendHtml, headTitArr} = this.props;
        let LoadCont = null;
        return (
            <div>
                <table className="table mt20 table-striped ">
                    <thead>

                        <tr>
                            {headTitArr.map((obj, idx) => {

                                return (<th key={idx}>{obj}</th>)
                            })}

                        </tr>
                    </thead>
                    <tbody>
                        {listData.map((obj, idx) => {
                            return rendHtml(obj, idx);
                        })}


                    </tbody>
                </table>
                {LoadCont}
                <div className="p10">
                    <Pager className=" " all_num={page.record_count} all_page_num={page.page_count} sel_index={page.page_index} onSetSelIdx={this.onSetSelIdx} />
                </div>

            </div>
        )
    }
}




export default Review;
