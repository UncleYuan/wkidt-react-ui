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

const FormDataPro =  //审核探客
	[
		{
			"name": "id",
			"label": "会员id",
			"value": "",
			"readOnly": true,
			"type": "text"
		},
		{
			"name": "real_name",
			"label": "会员实名",
			"value": "",
			"readOnly": true,
			"type": "text"
		},
		{
			"name": "id_card",
			"label": "会员身份证号",
			"value": "",
			"readOnly": true,
			"type": "text"
		},

		{
			"name": "remark",
			"label": "备注",
			"value": "",
			"type": "textarea"
		},
		{
			"name": "status",
			"label": "实名认证审核状态",
			"value": "",
			"type": "radio",
			"checkradioStyle": "btn",
			"inline": true,
			"options": [
				{ "name": "通过", "value": "1" },
				{ "name": "不通过", "value": "2" }
			]
		}

	]

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
		fetch('/member/member_list.do?' + tools.parseParam(postData), {
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
	turnFreeze = (id, state, idx) => {

		fetch(`/merchant/ban/${id}/${state}.do`, {
			method: "post",
			credentials: 'same-origin',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then(response => response.json())
			.then((data) => {
				Toast.show({ msg: data.info })
				if (data.code == 'SUCCESS') {
					let {rendData} = this.state;
					rendData[idx].is_lock = state;
					this.setState({
						rendData
					})

				}
			});
	}

	openBan = (uid, idx) => {
		Modal.show({
			title: <div className="fs20">禁用商家</div>,
			child: <div className="fs20 tc">请选择禁用商家选项</div>,
			conf: {
				footer: (
					<div className>
						<a href="javascript:;" onClick={() => { this.turnFreeze(uid, "1", idx); Modal.close(); } } className="btn btn-info">禁止会员登录</a>
						<a href="javascript:;" onClick={() => { this.turnFreeze(uid, "2", idx); Modal.close(); } } className="btn btn-warn">禁止会员登录和禁用会员内容</a>
					</div>
				)
			}
		})
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
					<td>{obj.uid}</td>
					<td>{obj.nickname}</td>
					<td>{obj.phone}</td>
					<td>{obj.group_id}</td>
					<td>{obj.group_name}</td>
					<td>{obj.open_id}</td>
					<td>{obj.invite_uid}</td>
					<td>
						{/*	<div className="btn-group mb15">

							<button className="btn btn-warn" onClick={() => { this.openSh(obj.uid) } } type="button">实名认证审核</button>
						</div>*/}
						<div className="btn-group">
							<a href="javascript:;" onClick={() => { obj.is_lock == "0" ? this.openBan(obj.uid, idx) : this.turnFreeze(obj.uid, 0, idx) } } className="btn btn-sm btn-default">{obj.is_lock == "0" ? "禁用" : "解禁"}会员</a>
						</div>
					</td>
				</tr>
			);
		}, this)

		const LoadCont = this.state.loading ? <div className="fixed-loading-bg"><Loading /></div> : "";
		return (
			<div>

				<div className="wrapper">
					<section className="panel">
						<header className="panel-heading">会员列表</header>

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
								<Modal title="审核探客" sizeClass="sm" maxWidth="1000" show={modalShow[1]} onClose={() => { this.toggleModal(1) } }>
									{modalShow[1] ? <Form formStyle="ver" formRendData={formData} onSubForm={this.subSh} /> : ""}
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
												<th>记录id</th>
												<th>昵称</th>
												<th>手机号码</th>
												<th>用户组ID</th>
												<th>用户组名称</th>
												<th>微信公众平台ID</th>
												<th>邀请人UID</th>
												<th>操作</th>
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