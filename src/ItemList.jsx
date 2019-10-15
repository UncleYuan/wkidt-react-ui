import React, { Component, PropTypes } from 'react';


const url=['/','/index.php?g=Borrow&amp;m=User','/index.php?g=Member&amp;m=index&amp;a=jjr_date']
class ItemList extends Component {
	constructor(props) {
	    super(props);
	    this.state={
	    	listData:this.props.listData
	    }
	}


	render(){
		return(
			<div>
				{}
			</div>
			
			
			
		)
	}

}

ItemList.PropTypes = { listData: React.PropTypes.array };
ItemList.defaultProps = { listData:[
	{
	    account:"20000.00",
	    borrow_account_yes: "0.00",
	    borrow_apr: "12.20",
	    borrow_nid: "20160600029",
	    borrow_period: "45",
	    borrow_period_unit: "天",
	    borrow_style: "day",
	    borrow_style_name: "按日计息",
	    release_time: "1466691364",
	    release_time_type: "2",
	    proc:17,
	    repay_status: "0",
	    status: "loaning",
	    status_name: "投标中",
	    tender_account_min: "0.00",
	    tender_yes: 0,
	    title: "测试01",
	    total_count: 200
	}
]};


export default ItemList;