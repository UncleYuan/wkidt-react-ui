
import React, {
  Component,
  PropTypes
} from 'react';
import reqwest from 'reqwest';
import Modal from '../../src/Modal';
import Pager from '../../src/Pager';
import Form from '../../src/Form';
import Loading from '../../src/Loading';
import Toast from '../../src/Toast';
import Process from '../../src/Process';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';

import FormCtrl from '../../src/FormCtrl';
import FileSingle from '../../src/FileSingle';
import Input from '../../src/Input';
import Alert from '../../src/Alert';
import { CheckRadio } from '../../src/CheckRadio';
import { InputGroup } from '../../src/InputGroup';

import { FileGroup } from '../../src/FileGroup';
import FirstCarMore from './PreLoanManagement/firstCarMore';
const carToken = "4d6a9d15e1030e8d39efd548c16226ec";
const FormDataPro =  //审核探客
  [

    {
      "label": "初审额度",
      "value": "",
      "type": "input-group",
      "barHtml": <span className="btn gray-bg">万</span>
    },
    {
      "label": "状态选择",
      "value": [],
      "inline": true,
      "type": "radio",
      "options": [
        {
          name: "通过",
          value: 1
        },
        {
          name: "不通过",
          value: 0
        }
      ]
    },
    {
      "label": "附件查看",
      "value": [],
      "type": "file-group"
    },
    {
      "name": "remarks",
      "label": "备注",
      "value": "",
      "type": "textarea"
    }
  ]

const userInfoProp = [
  {
    "name": "name",
    "label": "姓名",
    "value": "",
    "type": "text"
  }
]


const pagePro = {
  page_count: 0,
  page_index: 1,
  record_count: 0
}
const defaultProps = {
};
class DetailChuPing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //是否加载中， 保留，暂无作用
      modalShow: [false, false], //是否显示编辑表单弹窗
      rendData: [], //列表数据
      selArr: [], //选择列表数组,保留,用于全选
      page: tools.deepCopy(pagePro),
      len: 30, //分页长度
      logList: [],
      selectModelInfoData: null,
      selectModelData: null,
      selectModelData: {},
      searchTxt: "",
      formData: tools.deepCopy(FormDataPro) //表单数据渲染
    };
    this.openContId = ""
  }
  static contextTypes = {
    orderInfo: React.PropTypes.object,
    getOrderState: React.PropTypes.func
  }
  componentWillReceiveProps(nextProps) {


  }

  componentDidMount() {

    this.selectModelInfo();
    this.getBaseInfo();
  }
  getBaseInfo = () => {
    let {orderInfo} = this.context;
    Process.show();


    tools.getJSONP(`https://api.che300.com/service/getCarModelList?seriesId=${orderInfo.series_id}&token=${carToken}`, (data) => {
      Process.Close();
      if (data.status == 1) {
        for (let i in data.model_list) {
          if (data.model_list[i].model_id == orderInfo.model_id) {
            this.setState({ selectModelData: data.model_list[i] });
          }
        }
      }

    })
  }
  selectModelInfo = () => {
    let {orderInfo} = this.context;
    Process.show();

    tools.getJSONP(`https://api.che300.com/service/getModelParameters?modelId=${orderInfo.model_id}&token=${carToken}`, (data) => {
      Process.Close();
      if (data.status == 1) {

        this.setState({
          selectModelInfoData: data.paramters
        });
      }

    })

  }
  render() {
    let {orderInfo} = this.context;
    let {selectModelInfoData, selectModelData} = this.state;

    return (
      <div>

        <div className="wrapper mb15">

          <section className="p15 white-bg">
            <div className="clearfix mb10">


            </div>
            <div className=" clearfix">
              <div className="col-md-6 pb15">
                <div className="fs22 base-color pb15">车辆基本信息</div>
                {selectModelInfoData && selectModelData ? <FirstCarMore carData={selectModelInfoData} baseInfo={selectModelData}></FirstCarMore> : ""}
              </div>
              <div className="col-md-5 pb15 col-md-push-1">
                <div className="fs22 base-color  pb15">初评信息</div>
                <div className="lh1_5">
                  车辆上牌日期：{orderInfo.reg_time} <br />
                  公里数:{orderInfo.mileage} 万公里<br />
                  上牌城市：{orderInfo.city_name}  <br />
                  车辆颜色：{orderInfo.color}  <br />
                  内饰状况：{orderInfo.interior_level}  <br />
                  漆面状况：{orderInfo.paint_level}  <br />
                  工况状况：{orderInfo.working_level}  <br />
                  过户次数：{orderInfo.transfer_count}  <br />
                  车辆类型：{orderInfo.is_full == 1 ? "全款车" : "按揭车"}  <br />
                  <div className="fs20 assist-color">初评价格:{orderInfo.first_limit} </div>
                </div>

              </div>

            </div>
          </section>
        </div>
      </div>

    );
  }
}

export default DetailChuPing;