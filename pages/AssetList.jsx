import React, {
	Component,
	PropTypes
} from 'react';
import Modal from '../src/Modal';
import Pager from '../src/Pager';

import Loading from '../src/Loading';

import CheckRadio from '../src/CheckRadio';
import { TimeSelectInput } from '../src/TimeSelectInput';
import { InputGroup } from '../src/InputGroup';
import tools from '../tools/public_tools';


import Form from '../src/Form';

import Toast from '../src/Toast';
import Process from '../src/Process';

import form_tools from '../tools/form_tools';

import FormCtrl from '../src/FormCtrl';
import FileSingle from '../src/FileSingle';
import Input from '../src/Input';
import Alert from '../src/Alert';


const deepCopy = tools.deepCopy;


class MainCont extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'MainCont';
		this.state = {
			loading: true,
			rendData: [],
			selArr: [],
			easy_time: "",
			start_time: "",
			end_time: "",
			setTime: false,
			page: {
				page_count: 0,
				page_index: 1,
				record_count: 0
			},
			len: 10,
			searchTxt: "",
			modalShow: [false, false]

		}
		this.timer = null;
	}
	componentDidMount() {
		this.upData();

	}

	textChange(name, val) {
		let setState = {};
		setState[name] = val;
		this.setState(setState, () => {
			if (name == "len") {
				let {page} = this.state;
				page.page_index = 1;
				this.setState({
					page: page
				})
				this.upData();
			}
		});

	}

	upData(callback) { //更新表单数据
		let _this = this;
		let {page, len, type, easy_time, start_time, end_time, searchTxt, setTime} = this.state;
		let postData = {
			page: page.page_index,
			len,
			type,
			easy_time,
			start_time,
			end_time,
			keyword: searchTxt
		}
		if (setTime) {
			if (!start_time || !end_time) {
				return;
			} else {
				delete postData.easy_time;
			}
		}
		if (typeof (postData.easy_time) != "undefined") {
			delete postData.start_time;
			delete postData.end_time;
		}
		fetch('/asset/asset_log.do?' + tools.parseParam(postData), {
			method: "get",
			credentials: 'same-origin'
		}).then(response => response.json())
			.then((data) => {
				data.data = data.data ? data.data : [];
				if (data.code == 'SUCCESS') {
					_this.setState({
						rendData: data.data,
						page: data.page,
						loading: false
					})
					if (callback) callback();
				} else if (data.code == 'NO_DATA') {
					_this.setState({
						loading: false,
						listData: [],
						page: {
							page_count: 0,
							page_index: 1,
							record_count: 0
						}
					})
				}
			});


	}


	toggleModal = (i) => { //切换弹窗显示
		let arr = this.state.modalShow;
		arr[i] = !arr[i]
		this.setState({ modalShow: arr })
	}
	toggleTable() {
		this.setState({
			showTable: !this.state.showTable
		})
	}

	onSetSelIdx = (idx) => { //选择分页回调
		let page = this.state.page;
		page.page_index = idx;
		this.setState({
			page: page
		});
		this.upData();
	}
	validChecked(id) {
		return tools.indexOf(this.state.selArr, id) >= 0 ? true : false;
	}
	validCheckedAll() {
		let rendData = this.state.rendData;
		for (let i in rendData) {
			if (tools.indexOf(this.state.selArr, rendData[i].id) < 0) {
				return false;
			}
		}
		return true;
	}
	toggleChecked(id) {
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

	toggleCheckedAll() {
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

	setEasyTime(val) {
		this.setTimeTurn(false)
		this.setState({ easy_time: val });
		setTimeout(() => {
			this.upData();
		}, 100)
	}

	setTimeTurn(status) {
		let setData = {
			setTime: status
		};
		if (status) {
			setData['easy_time'] = ""
		}
		this.setState(setData);
	}
	changeDate = (name, date) => {
		let setData = {}
		setData[name] = date;
		this.setState(setData);
		setTimeout(() => {
			this.upData();
		}, 100)
	}
	openSh = (id) => {
		this.toggleModal(1);
		let formData = tools.deepCopy(FormDataPro)
		formData[0].value = id;
		this.setState({ formData: formData || [] })
	}
	subSh = (data) => {
		Process.show();
		fetch(`/member/realname_audit/${data.id}.do`, {
			method: "put",
			credentials: 'same-origin',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: tools.parseParam({
				id: data.id,
				real_name: data.real_name,
				id_card: data.id_card,
				remark: data.remark,
				status: data.status[0]

			})
		}).then(response => response.json())
			.then((data) => {
				Process.Close();
				Toast.show({ msg: data.info });
				this.toggleModal(1);
			});
	}
	render() {
		const {modalShow, formData} = this.state;
		const cont = this.state.rendData.map((obj, idx) => {
			let date = new Date(obj.add_time / 1000);
			let Y = date.getFullYear() + '-';
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			let D = date.getDate() + ' ';
			let h = date.getHours() + ':';
			let m = date.getMinutes() + ':';
			let s = date.getSeconds();
			return (
				<tr key={idx}>
					<td>
						<input
							name="select"
							checked={this.validChecked.bind(this, obj.id)()}
							onClick={this.toggleChecked.bind(this, obj.id)}
							className="select-box"
							type="checkbox"
							/>
					</td>
					<td>{obj.id}</td>
					<td>{obj.nid}</td>
					<td>{obj.uid}</td>
					<td><span className="base-color fs16">{obj.symbol}{obj.amount}</span></td>
					<td>{obj.total+" = "+obj.balance+" + "+obj.frost}</td>
					<td>{obj.type_name}</td>
	
					<td>
						{obj.add_time}
					</td>
					<td>
						{obj.remark}
					</td>
				</tr>
			);
		}, this)

		const LoadCont = this.state.loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
		return (
			<div>

				<div className="wrapper">
					<section className="panel">
						<header className="panel-heading">资金记录</header>

						<div className="panel-body">
							<div className="row mt15">
								<div className="col-md-9  ">
									<div className=" mb15 fs11">

										<div className="inline-block  fs12 desalt-color  pb5    mr30">起止时间:</div>
										<a style={{ 'cursor': 'pointer' }} onClick={this.setEasyTime.bind(this, "")} className={"btn fs11 mr10 mb5 " + (this.state.easy_time == "" && !this.state.setTime ? "btn-info" : "")}>不限制</a>
										<a style={{ 'cursor': 'pointer' }} onClick={this.setEasyTime.bind(this, "1 week")} className={"btn fs11 mr10 mb5 " + (this.state.easy_time == "1 week" ? "btn-info" : "")}>最近1周</a>
										<a style={{ 'cursor': 'pointer' }} onClick={this.setEasyTime.bind(this, "1 month")} className={"btn fs11 mr10 mb5 " + (this.state.easy_time == "1 month" ? "btn-info" : "")}>最近1个月</a>
										<a style={{ 'cursor': 'pointer' }} onClick={this.setEasyTime.bind(this, "3 month")} className={"btn fs11 mr10 mb5 " + (this.state.easy_time == "3 month" ? "btn-info" : "")}>3个月</a>
										<a style={{ 'cursor': 'pointer' }} onClick={this.setEasyTime.bind(this, "6 month")} className={"btn fs11 mr10 mb5 " + (this.state.easy_time == "6 month" ? "btn-info" : "")}>6个月</a>
										<a style={{ 'cursor': 'pointer' }} onClick={this.setEasyTime.bind(this, "1 year")} className={"btn fs11 mr10 mb5 " + (this.state.easy_time == "1 year" ? "btn-info" : "")}>1年</a>
										<a style={{ 'cursor': 'pointer' }} onClick={this.setTimeTurn.bind(this, true)} className={"btn fs11 mr10 mb5 " + (this.state.setTime ? "btn-info" : "")}>指定时间</a>

										<div className={this.state.setTime ? "block mt10" : "none mt10"}>
											<div className="inline-block w160 br5 vm oh mr10">
												<TimeSelectInput
													name="start_time"
													format="y-m-d"
													value={this.state.start_time}
													onValueChange={(val) => { this.changeDate('start_time', val) } }
													>

												</TimeSelectInput>
												<i className="iconfont icon-rili desalt-color"></i>
											</div>
											<span className="desalt-color">到</span>
											<div className="inline-block w160 br5 vm  oh ml10">
												<TimeSelectInput
													format="y-m-d"
													name="end_time"
													value={this.state.end_time}
													onValueChange={(val) => { this.changeDate('end_time', val) } }
													>
												</TimeSelectInput>
												<i className="iconfont icon-rili desalt-color"></i>
											</div>
										</div>
									</div>
								</div>
								<div className=" col-md-3 mb10">
									<InputGroup placeholder="请在这里输入搜索的内容" value={this.state.searchTxt} barHtml={<button className="btn btn-info fs12" onClick={() => { this.upData() } } type="button">搜索</button>} onValueChange={(val) => { this.textChange("searchTxt", val) } }></InputGroup>
								</div>
							</div>
							<div className="mt10">
								
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
												<th>记录id</th>
												<th>记录流水号</th>
												<th>用户名</th>
												<th>操作金额</th>
												<th>用户资金(总金额=可用+冻结)</th>
												<th>操作类型名称</th>
							
												<th>操作时间</th>
												<th>备注</th>
											</tr>
										</thead>
										<tbody>
											{cont}
										</tbody>
									</table>

									{LoadCont}
								</div>
								<div className="pb15 pt15">
									<div className="row">
										<div className="col-sm-9 col-lg-10">
											<Pager className="mb15"
												all_num={this.state.page.record_count}
												all_page_num={this.state.page.page_count}
												sel_index={this.state.page.page_index}
												onSetSelIdx={this.onSetSelIdx} />
										</div>
										<div className="col-sm-3  col-lg-2">
											<InputGroup value={this.state.len} barHtml={<span className="btn gray-bg fs12">每页条数</span>} onValueChange={(val) => { this.textChange('len', val) } }></InputGroup>

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

module.exports = MainCont;