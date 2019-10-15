import React from 'react';

class Linkage extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Linkage';
        this.state = {
            firstItem:[],
        	secondItem:[],
        	thirdItem:[],
            firstName:'',
            secondName:'',
            thirdName:'',
            province:this.props.province,
            city:this.props.city,
            area:this.props.area
            
        }

    }

    componentWillMount() {
        this.getProvince();
    	
    }

    getProvince=()=>{
        let {firstItem} = this.state;
        $.post('/Member/Public/getProvince',(result)=>{
            if (result.code == 'SUCCESS') {
                firstItem = result.data;
                this.setState({
                    firstItem:firstItem
                })
            }
        },'json')
    }

    getCity=(cityId)=>{
       $.post('/Member/Public/getProvince',{province_id:cityId},(result)=>{
           
           this.setState({
               secondItem:result.code == 'SUCCESS'?result.data:[]
           })
       },'json') 
    }

    getArea=(areaId)=>{
        $.post('/Member/Public/getProvince',{city_id:areaId},(result)=>{
            
            this.setState({
                thirdItem:result.code == 'SUCCESS'?result.data:[]
            })
        },'json')
    }



    componentWillReceiveProps(nextProps) {
        console.log(nextProps)

        const {province,city,area} = nextProps;
        // if (province!=undefined) {
        //     this.getProvince();
        //     const {firstItem,secondItem} = this.state;
        //     this.setState({
        //         firstName:province,
        //         secondName:city,
        //         thirdName:area,
        //         secondItem:[],
        //         thirdItem:[],
        //     })
        //     for (let i = 0; i < firstItem.length; i++) {
        //         if (firstItem[i].name==province) {
        //             $.post('/Member/Public/getProvince',{province_id:firstItem[i].id},(result)=>{
        //                 if (result.code == 'SUCCESS') {
        //                     let sItem = result.data;
        //                     this.setState({
        //                         secondItem:sItem
        //                     },()=>{
        //                         for (let k = 0; k < sItem.length; k++) {
        //                             if (sItem[k].name==city) {
        //                                 this.getArea(sItem[k].id);
        //                                 let obj = {
        //                                     addressObj:{
        //                                         province_id:firstItem[i].id,
        //                                         city_id:sItem[k].id,
        //                                         area_id:'',
        //                                     },
        //                                 }
        //                                 this.props.handlePostData(obj)
        //                             }
        //                         }
        //                     })
        //                 }
        //             })
        //        }

        //     }

        // }

        if (province=='') {
            this.setState({
                firstName:'',
                secondName:'',
                thirdName:'',
                secondItem:[],
                thirdItem:[],
            })
        }
        

    }



    handleFirstChange = (e)=>{
        const target = e.target || e.srcElement;
        const firstObj = target.value;
        const firstArr = firstObj.split(',');
        const firstId = firstArr[0];
        const firstName = firstArr[1];
        this.setState({
            firstName:firstName,
            firstId:firstId,
            secondItem:[],
            thirdItem:[],
            secondName:'',
            thirdName:''
        },()=>{
            this.handlePostData();
        })
        
        this.getCity(firstId);
    }



    handleSecondChange = (e)=>{
        const target = e.target || e.srcElement;
        const secondObj = target.value;
        const secondArr = secondObj.split(',');
        const secondId = secondArr[0];
        const secondName = secondArr[1];
        this.setState({
            secondName:secondName,
            secondId:secondId,
            thirdItem:[],
            thirdName:''

        },()=>{
            this.handlePostData();
        })

       this.getArea(secondId)
      

    }


    handleThirdChange=(e)=>{
        const target = e.target || e.srcElement;
        const thirdObj = target.value;
        const thirdArr = thirdObj.split(',');
        const thirdId = thirdArr[0];
        const thirdName = thirdArr[1];
        this.setState({
            thirdName:thirdName,
            thirdId:thirdId,
        },()=>{
            this.handlePostData();
        })
    }


    handlePostData=()=>{
        const {firstName,secondName,thirdName,firstId,secondId,thirdId} = this.state;
        const str = firstName+secondName+thirdName
        let obj={
            addressObj:{
                province_id:firstId,
                city_id:secondId,
                area_id:thirdId,
            },
            nameObj:{
                province:firstName,
                city:secondName,
                area:thirdName
            }
            
        }

        if (this.props.handlePostData) {
            this.props.handlePostData(obj)
        }
    }

    render() {
        return (
        	<div className="form-wrap clearfix">
				<div className="tit">*所在省市：</div>
				<div className="cont">
					<select
						type="select"
						name={this.props.first}
						className="mr10 w200"
						ref="first" 
						onChange={this.handleFirstChange.bind(this)}
                        value={this.state.firstName}
						>
					<option value="" className="desalt-color">{this.state.firstName!=''?this.state.firstName:"选择所在省份"}</option>
					{this.state.firstItem.map(function (obj,i) {
					  return(
					    <option key={i} value={[obj.id,obj.name]}>{obj.name}</option>
					  ); 
					})}
					</select>
					<select
						type="select"
						onChange={this.handleSecondChange.bind(this)}
                        className="mr10 w200"
						name={this.props.second}
						ref="second" 
						placeholder={this.props.secondPlaceholder}
						>
					<option value="" className="desalt-color">{this.state.secondName!=''?this.state.secondName:"选择所在城市"}</option>
					{this.state.secondItem.map(function (obj,i) {
					  return(
					    <option key={i} value={[obj.id,obj.name]}>{obj.name}</option>
					  ); 
					})}
					</select>
                    <select
                        type="select"
                        onChange={this.handleThirdChange.bind(this)}
                        className="mr10 w200"
                        name={this.props.third}
                        ref="third" 
                        placeholder={this.props.thirdPlaceholder}
                        >
                    <option value="" className="desalt-color">{this.state.thirdName!=''?this.state.thirdName:"选择所在城区"}</option>
                    {this.state.thirdItem.map(function (obj,i) {
                      return(
                        <option key={i} value={[obj.id,obj.name]} >{obj.name}</option>
                      ); 
                    })}
                    </select>
				</div>
				
			</div>
        	)
    }
}


module.exports = Linkage;