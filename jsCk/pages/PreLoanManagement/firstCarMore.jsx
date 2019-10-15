import React, { Component, creatElement } from 'react';
import Tabs from '../../../src/Tabs';
import Panel from '../../comp/Panel';
import tools from '../../../tools/public_tools';

class CarInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            closeSider: false,
            carData: null,
        }

    }

    componentWillMount() {

    }
    componentWillReceiveProps(nextProps) {

    }
    filterInfo = (data) => {
        let newObj={};
        let objTit={
            model_emission_standard:"排放标准",
            series_group_name:"厂家",
            series_name:"车系名称",
            model_year:"车型年款",
            model_gear:"变速箱类型",
            model_liter:"排量",
            model_name:"车型名称",
            brand_name:"品牌名称",
            model_price:"车型指导价(万)",
            min_reg_year:"最小上牌年份",
            max_reg_year:"最大上牌年份",

            liter:"排量",
            gear_type:"变速箱",
            seat_number:"座位数",
            discharge_standard:"排放标准"
        }
        for(let i in data){
            if(objTit[i]){
                newObj[objTit[i]]=data[i];
            }
        }
        return newObj;
    }
    eachData = (data) => {
        let arr = [];

        let x = 0;
        for (let i in data) {
            arr.push(
                <div key={x} className="col-md-6">
                    <div className="car-row">
                        <h4 className="car-tit">{i}</h4>
                        <p className="car-info">{data[i]||"无"}</p>
                    </div>
                </div>
            )
            x++;
        }
        return arr;
    }
    render() {
        const {carData1} = this.state;
        const {carData,baseInfo} = this.props;
        let showInfo=this.filterInfo(baseInfo);
        return (
            <div className="firstCarMore">
                <Tabs>
                    <div title="基本信息" >
                        <div className="row">
                            {(() => {
                                let arr = [];
                                if (showInfo) {
                   
                                    let x = 0;
                                    for (let i in showInfo) {
                                        arr.push(
                                            <div key={x} className="col-md-6">
                                                <div className="car-row">
                                                    <h4 className="car-tit">{i}</h4>
                                                    <p className="car-info">{showInfo[i]}</p>
                                                </div>
                                            </div>
                                        )
                                        x++;
                                    }
                                }

                                return arr;
                            })()}
                        </div>
                    </div>
                    <div title="详细参数">
                        <div className="pt10 pb10">
                            {(() => {
                                let arr = [];
                                if (carData) {

                                    let x = 0;
                                    for (let i in carData) {
                                        arr.push(
                                            <Panel key={x} title={i} type="info" show={false} noWrap={true}>
                                                <div className="p10">
                                                    <div className="row">{this.eachData(carData[i])}</div>
                                                </div>
                                            </Panel>
                                        )
                                        x++;
                                    }
                                }

                                return arr;
                            })()}
                        </div>
                    </div>
                </Tabs>
            </div>
        )
    }
}




export default CarInfo;
