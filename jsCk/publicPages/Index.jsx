/*<div className="p15 ">
              <div className="row">
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">在押车辆：<span className="fs16">{rendData.custody}</span> 辆</div>
                </div>
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">断档车辆：<span className="fs16">{rendData.anything} </span>辆</div>
                </div>
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">贷款总额：<span className="fs16">{rendData.borrow_total} </span>辆</div>
                </div>
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">待收利息：<span className="fs16">{rendData.interest_total} </span>辆</div>
                </div>
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">今日收车：<span className="fs16">{rendData.today_in} </span>辆</div>
                </div>
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">今日赎回：<span className="fs16">{rendData.today_redemption} </span>辆</div>
                </div>
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">今日处置：<span className="fs16">{rendData.today_disposal} </span>辆</div>
                </div>
                <div className="col-md-3 col-sm-4 mb15">
                  <div className="uba1 fuzzy-light-border p10 br2">回收本金：<span className="fs16">{rendData.redemption_capital} </span>辆</div>
                </div>

              </div>
            </div>*/

import React, { Component } from 'react';

import Select from '../../src/Select';
import Form from '../../src/Form';
import FormCtrl from '../../src/FormCtrl';
import Input from '../../src/Input';
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
import Loading from '../../src/Loading';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeSider: false,
      loading: true
    }
    this.leftData = {
      labels: [],
      datasets: []
    }
  }

  componentWillMount() {
    this.getData();
  }
  componentDidMount() {

  }
  setTimeChart = () => {
    setTimeout(() => {
      if (document.getElementById("leftChart")) {
        this.setChart();
      } else {
        this.setTimeChart();
      }
    }, 500)
  }
  setChart = () => {
    var leftCanvas = echarts.init(document.getElementById('leftChart'));

    var option = {
      color: ['#54f9fc', "#22ac38", "#eb6100"],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['在押', '断档', '处置'],
        textStyle: {
          color: "#999"
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', "08月", "09月", "10月", "11月", "12月"],
        axisLine: {
          lineStyle: {
            color: "#999"
          }
        }
      }],
      yAxis: [{
        type: 'value',
        axisLine: {
          lineStyle: {
            color: "#999"
          }
        }
      }],
      series: [{
        name: '访问',

        type: 'bar',
        data: [320, 332, 301, 334, 390, 330, 320, 320, 301, 334, 390, 330]
      }, {
        name: '注册',
        type: 'bar',

        stack: '广告',
        data: [150, 232, 201, 154, 190, 330, 410, 320, 150, 232, 201, 154]
      }, {
        name: '交易',
        type: 'bar',

        data: [862, 1018, 964, 1026, 1679, 1600, 1570, 320, 1018, 964, 1026, 1679],
        markLine: {
          lineStyle: {
            normal: {
              type: 'dashed'
            }
          }
        }
      }]
    };


    // 使用刚指定的配置项和数据显示图表。
    leftCanvas.setOption(option);
    // rightCanvas.setOption(option);
  }
  setLeftData = (data) => {
    let config = [
      {
        name: "在押车辆",
        key: "custody"
      },
      {
        name: "断档车辆",
        key: "anything"
      },
      {
        name: "贷款总额",
        key: "borrow_total"
      },
      {
        name: "待收利息",
        key: "interest_total"
      },
      {
        name: "今日收车",
        key: "today_in"
      },
      {
        name: "今日赎回",
        key: "today_redemption"
      },
      {
        name: "今日处置",
        key: "today_disposal"
      },
      {
        name: "回收本金",
        key: "redemption_capital"
      }
    ]
    this.leftData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: [
            '#fff',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          data: [65, 59, 80, 81, 56, 55, 40],
        }
      ]
    };
    return;
    for (let i in config) {
      this.leftData.labels.push(config[i].name);

      this.leftData.datasets.push({
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,1)",
        data: [data[config[i].key]]
      });
    }
  }
  getData = () => {
    fetch(`/property/statistical.do`, {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == 'SUCCESS') {
          this.setState({
            rendData: data.data,
            loading: false
          }, () => {
            //this.setLeftData(data.data);
            this.setTimeChart();
          })
        }


      });
  }

  getForm = (data) => {
    alert(JSON.stringify(data))
  }
  toggleSider = () => {
    let {closeSider} = this.state;
    this.setState({ closeSider: !closeSider })
  }
  render() {
    const {rendData, loading} = this.state;
    if (loading) {
      return <Loading />
    }
    return (
      <div>
        <div className="mb15">
          <Panel title="总信息" type="default" noWrap={true}>
            <div className="row ">
              <div className="col-md-12 ">
                <div className="pb10" ref="l">
                  <div className="tc fs16 pt20">在押、断档、处置趋势</div>
                  <canvas id="leftChart" width="1200" height="300" ></canvas>
                </div>
              </div>
              {/*  <div className="col-md-6 ">
                <div className="mb20 mt20 ml30 mr30"  ref="r">
                  <canvas   id="rightChart"  height="200" ></canvas>
                </div>
              </div>*/}
            </div>
          </Panel>
        </div>
        <div className="row ">
          <div className="col-md-6 col-lg-4">
            <Panel title={<div><span className="fs18 fb">贷前管理</span><span className="assist-color fs18 ml30">订单金额：{rendData.loan_before}万</span></div>} type="" noWrap={true}>
              <div className="clearfix pt20 pl10 pr10 pb10 state-overview">
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/first" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.first_evaluation}</div>
                      <div className="title fs12">初评</div>
                    </div>
                  </div>
                </div>
                {/*<div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/ddlist.html" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.order_list}</div>
                      <div className="title fs12" >订单列表</div>
                    </div>
                  </div>
                </div>*/}

                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/ddlist.html/whthin" }}>
                  <div className="panel green pointer" >

                    <div className="">

                      <div className="value fs18" >{rendData.query_archives}</div>
                      <div className="title fs12" >查档</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/ddlist.html/inspection" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.check_cat}</div>
                      <div className="title fs12" >验车</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/ddlist.html/final" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.end_audit}</div>
                      <div className="title fs12" >终审</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/ddlist.html/check" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.rean_name_check}</div>
                      <div className="title fs12" >核验</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/ddlist.html/lending" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.lending}</div>
                      <div className="title fs12" >放款</div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
          <div className="col-md-6 col-lg-4">

            <Panel title={<div><span className="fs18 fb">贷中管理</span><span className="assist-color fs18 ml30">资产金额：{rendData.loan_centre}万</span></div>} type="" noWrap={true}>
              <div className="clearfix pt20 pl10 pr10 pb10 state-overview">
               {/* <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/warehouselist" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.out_warehouse}</div>
                      <div className="title fs12" >仓库</div>
                    </div>
                  </div>
                </div>
                */}
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/zclist.html/in" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.mobile_warehouse}</div>
                      <div className="title fs12" >入库</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/zclist.html/out" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.defer}</div>
                      <div className="title fs12" >出库</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/zclist.html/move" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.redemption}</div>
                      <div className="title fs12" >资产交接</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/zclist.html/defer" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.disposal}</div>
                      <div className="title fs12" >收息</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/zclist.html/redemption" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.monitor}</div>
                      <div className="title fs12" >赎回</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/zclist.html/interrupt" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.monitor}</div>
                      <div className="title fs12" >断档</div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
          <div className="col-md-6 col-lg-4">
            <Panel title={<div><span className="fs18 fb">贷后管理</span><span className="assist-color fs18 ml30">待处置：{rendData.loan_after}万</span></div>} type="" noWrap={true}>
              <div className="clearfix pt20 pl10 pr10 pb10 state-overview">
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/zclist.html/dispose" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.out_warehouse}</div>
                      <div className="title fs12" >处置登记</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-6 col-sm-4 " onClick={() => { location.hash = "/khList" }}>
                  <div className="panel green pointer" >

                    <div className="">
                      <div className="value fs18" >{rendData.mobile_warehouse}</div>
                      <div className="title fs12" >客户回访</div>
                    </div>
                  </div>
                </div>


              </div>
            </Panel>
          </div>
        </div>

      </div>
    )
  }
}




export default Index;
