import React, { Component, creatElement } from 'react';

import Select from '../../src/Select';
import Loading from '../../src/Loading';
import Form from '../../src/Form';
import FormCtrl from '../../src/FormCtrl';
import FormSub from '../../src/FormSub';
import Input from '../../src/Input';
import InputGroup from '../../src/InputGroup';
import CheckRadio from '../../src/CheckRadio';
import Modal from '../../src/Modal';
import FileSingle from '../../src/FileSingle';
import FileGroup from '../../src/FileGroup';
import Cascader from '../../src/Cascader';
import TimeSelector from '../../src/TimeSelector';
import TimeSelectInput from '../../src/TimeSelectInput';
import SetMobileCont from '../../src/SetMobileCont';
import Panel from '../comp/Panel';
import Tags from '../../src/Tags';
import tools from '../../tools/public_tools';
import Process from '../../src/Process';
import Toast from '../../src/Toast';
import form_tools from '../../tools/form_tools';





class ZcdetailsAuditlog extends Component {
    constructor(props) {
        super(props);
        this.state = {

            filesData: [],
            modalShow: [false, false],
            loading: true,
            page: {
                page_count: 0,
                page_index: 1,
                record_count: 0
            },
            len: 30,
            selArr: [],
        }
        this.editType = "add";
        this.editId = null;
        this.disabledForm = false;
    }
    static defaultProps = {
        hiddenTitle: false
    }
    componentWillMount() {
        this.getData();

    }
    componentWillReceiveProps(nextProps) {
    }


    getData = () => {
        let { data_id, model, step, add_id } = this.props;

        let { page, len } = this.state;

        fetch(`/property/auditlog.do?` + tools.parseParam({ data_id: data_id, model: model, steps: step, batch_id: add_id }), {
            method: "get",
            credentials: 'same-origin'
        }).then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data.code == "SUCCESS") {
                    this.setState({ loading: false, selArr: [], filesData: data.data })
                } else if (data.code == "NO_DATA") {
                    this.setState({ loading: false, selArr: [], filesData: [] })
                }

            });
    }

    toggleModal = (i) => { //切换弹窗显示
        let arr = this.state.modalShow;
        arr[i] = !arr[i]
        this.setState({ modalShow: arr })
    }

    render() {
        const { loading, filesData, modalShow } = this.state;
        const { hiddenTitle } = this.props;
        if (loading) {
            return (
                <Loading />
            )
        }
        return (
            <div className="mb15">
                <div className="wrapper">
                    <section className="p15 white-bg">
                        <div>

                            {!hiddenTitle ? <div className="clearfix mb10"><h4 className="fs20 desalt-color" >操作记录</h4></div> : ""}

                            <div>

                                <div className="table-responsive fixed-loading">
                                    <table className="table table-striped ">
                                        <tbody>
                                            <tr className="table-head-tr">
                                                <td>记录id</td>
                                                <td>时间</td>
                                                <td>操作用户</td>
                                                <td>操作说明</td>
                                                <td>备注</td>
                                            </tr>
                                            {filesData.map((obj, idx) => {
                                                return (
                                                    <tr key={idx} >
                                                        <td>{obj.id}</td>
                                                        <td>{obj.add_time}</td>
                                                        <td>{obj.user_name}</td>
                                                        <td>{obj.title}</td>
                                                        <td>{obj.remark}</td>
                                                    </tr>
                                                );
                                            })}


                                        </tbody>
                                    </table>


                                </div>

                            </div>
                        </div>
                    </section>
                </div>
            </div>

        )
    }
}




export default ZcdetailsAuditlog;
