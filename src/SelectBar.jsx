import React from 'react';
import Loading from './Loading';

class SelectBar extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SelectBar';
        this.state = {
        	loading:true,
        	tabNum:false,
        	show:false,
        	rendData:[],
        	choose:false,
        	chooseHtml:[],
        	getDataParam:'',
        	clickState:1,
        	urlId:'',
        	group:'',
        	brand_id:'',
        	bseries_id:'',
        	getDataUrl:this.props.getDataUrl,
        	getDataArrName:this.props.getDataArrName,
        	getFinalName:this.props.getFinalName,
        	getFinalId:this.props.getFinalId,
        	inputValue:'',
        	keyDown:'',
        	data:{

        	}
        }
    }

    componentWillReceiveProps(nextProps) {

    	if (nextProps!=this.props) {
           
            this.getDataFn()
    		this.setState({
    			show:nextProps.showState

    		})
    	}

    }


    getDataFn(id){
    	let {getDataType} = this.props;
    	let {getDataParam,
            urlId,
            getDataUrl,
            getDataArrName,
            getFinalName} = this.state;
    	let url = getDataUrl[0];
    	let idd = id?id:urlId;
    	let uid = url+id;
    	let goUrl = id?uid:url
    	let name = getDataArrName[0];
    	let rendName = getFinalName[0];
    	this.setState({
    		rendData:[]
    	})
    	
    	
     	if (getDataType == 'jsonp') {

    		$.ajax({
    			type:"get",
    			url:goUrl,
    			jsonp:'callback',
    			dataType:getDataType,
    			success:(result)=>{
    				
    				if (result.status == 1) {
    					this.setState({
    						loading:false,
    						rendData:result[name],
    						initial:result.initial,
    						rendName:rendName
    					})
	    				
    				}
    			}
    		})
    	}else if (getDataType=='none') {

    	}

    }

    chooseFn=(obj,rendName,rendId)=>{
        console.log(rendName)
    	let {getDataType} = this.props;
    	let {record,
            rendData,
            nowRecord,
            clickState,
            getDataUrl,
            getDataArrName,
            getFinalName,
            getFinalId} = this.state;
    	let id = getFinalId.shift();
    	getFinalId.push(id)
    	let url = getDataUrl.shift();
    	getDataUrl.push(url)
    	let name = getDataArrName.shift();
    	getDataArrName.push(name);
    	let rName = getFinalName.shift();
    	getFinalName.push(rName)

    	
    	this.setState({
    		loading:true,
    		choose:false,
    		tabNum:'',
    		getDataParam:obj[id],
    		clickState:clickState+1,
    		urlId:obj[id],
    		inputValue:''
    	})
		
    	if (getDataUrl.length>0) {
			this.getDataFn(obj[id]);

    	}
    	this.postDataFn(obj,rendName);

    	
    }



    backFn =()=>{
    	let { clickState 
            ,getDataUrl,
            getDataArrName,
            getFinalName,
            getFinalId} = this.state;
    	let {getDataType} = this.props;

    	let url = getDataUrl.pop();
    	getDataUrl.unshift(url)
    	let name = getDataArrName.pop();
    	getDataArrName.unshift(name);
    	let rendName = getFinalName.pop();
    	getFinalName.unshift(rendName)
    	let id = getFinalId.pop();
    	getFinalId.unshift(id)

    	getDataUrl= this.props.getDataUrl;

    	this.setState({
    		loading:true,
    		rendName:rendName,
    		clickState:clickState-1
    	})
    	this.getDataFn();
    }

    postDataFn=(obj)=>{
    	let {getDataType,
            getId,
            getName,
            getGroup,
            getBrand,
            getSeries,
            getBrandName,
            getSeriesName,
            min_reg_year,
            max_reg_year} = this.props;
    	let {clickState,
            show,
            getDataUrl,
            getDataArrName,
            getFinalName} = this.state;
    	
    	let data = {};
    	data.name = obj[getName];
    	data.group =obj[getGroup];
    	data.brand_id = obj[getBrand]
    	data.bseries_id = obj[getSeries]
    	data.model_id = obj[getId];
    	data.brand_name= obj[getBrandName];
    	data.series_name = obj[getSeriesName];
    	data.min_reg_year = obj[min_reg_year];
    	data.max_reg_year = obj[max_reg_year];
    	data.show = true;
        
		if (clickState==getDataUrl.length) {
			data.show = false;
			data.postDataState = true
			
		    this.setState({
		    	choose:false,
		    	clickState:1,
		    })
		    
			if (this.props.postData) {
				this.props.postData(data);
			}
		}else if (this.props.postData){
			this.props.postData(data);
		}
    	
    }

    onCloseFn=()=>{

    	let data ={}
    	let {getDataType,getFinalId} = this.props;
    	let {clickState,getDataUrl,getDataArrName,getFinalName} = this.state;

    	data.show = false;
    	this.setState({
    		choose:false,
			clickState:1,
			rendName:'',
			urlId:''
    	})

     	if (clickState==2) {
     		let url = getDataUrl.pop();
     		getDataUrl.unshift(url)
     		let name = getDataArrName.pop();
     		getDataArrName.unshift(name);
     		let rendName = getFinalName.pop();
     		getFinalName.unshift(rendName)
     		let id = getFinalId.pop();
     		getFinalId.unshift(id)
     	}else if (clickState==3){
     		let id = getFinalId.shift();
     		getFinalId.push(id)
     		let url = getDataUrl.shift();
     		getDataUrl.push(url)
     		let name = getDataArrName.shift();
     		getDataArrName.push(name);
     		let rendName = getFinalName.shift();
     		getFinalName.push(rendName)
     	}
    	if (this.props.postData) {
    		this.props.postData(data);
    	}
    }

    onChange = (event)=>{
    	this.setState({
    		inputValue:event.target.value,
    		keyDown:event.target.value.toUpperCase()
    	})
    }

    render() {
    	let {loading,
            tabNum,
            show,
            rendData,
            choose,
            rendName,
            clickState,
            showSelect,
            keyDown,
            inputValue} = this.state;
    	let {getDataType,
            getDataUrl,
            getDataArrName,
            getFinalName} = this.props;
    	let rendDataHtml = [];
    	let _this = this;
    

    	if (rendData.length>0) {

    		rendDataHtml = rendData.map((obj,idx)=>{
    			if (keyDown!=''&&obj.initial) {
    				if (keyDown==obj.initial.toUpperCase()||inputValue==obj[rendName]) {
    					return(
    						<div
							    key={idx}
							    onClick={_this.chooseFn.bind(this,obj,obj[rendName])}
							    className="white-bg pb10 pt10 pl20 fs12 ubb1 fuzzy-border"
							    >
							    {obj[rendName]}
    						</div>)
    						
    				}
    			}else{
    				return(<div
    					    key={idx}
    					    onClick={_this.chooseFn.bind(this,obj,obj[rendName])}
    					    className="white-bg pb10 pt10 pl20 fs12 ubb1 fuzzy-border"
    					    >
    					    {obj[rendName]}
    					</div>)
    			}
    			
    		})
    	}

    	if (loading) {
    		return(<div ><Loading/></div>)
    	}
        return <div  style={!isNaN(tabNum)?{"display": "block",overflow:'auto',height:'600px'}:{"display": "none"}}>

        		<div  className=" pt10 pb10  pb05 ub ub-ac ub-pc">
        			{clickState>1&&clickState!==3?<span onClick={this.backFn} className="fs14 base-color confirm">返回</span>:''}
        			{/*<div className="tc fs15">{rendData.title?rendData.title:'请选择品牌'}</div>*/}
        		</div>

        		<div className="oya ub ub-fv ub-ver"  style={!choose?{"display": "block"}:{"display": "none"}} >
        			{this.props.children}
        			{rendDataHtml}
        			
        		</div>
        </div>;
    }
}

export default SelectBar;
