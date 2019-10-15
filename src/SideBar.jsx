import React from 'react';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SideBar';
        this.state = {
        	showSide:this.props.showSide,
        	rightPosition:this.props.rightPosition,
        	duration:2000
        }
        this.timer = null;
        this.hidetimer = null;
    }

    static defaultProps = {
    	rightPosition:-80
    }


    componentWillReceiveProps(nextProps) {
    	if (nextProps.showSide!=this.props.showSide) {
    		this.setState({showSide:nextProps.showSide});
    	}

    }

    componentDidUpdate (){

    	if (this.state.showSide) {
    		this.showSide();
    	}


    }



    componentWillUnmount(){
    	
    }

    showSide=()=>{
    	const { rightPosition  } = this.state;
    	let _this = this;

    	
		this.timer = setInterval(function () {
			_this.sideShowFn();
			
		},10)
    	
		
    }

    hideSide=()=>{
    	let { rightPosition,showSide } = this.state;
    	let _this = this;
    	this.setState({
    		showSide:!showSide
    	})
    	this.hidetimer = setInterval(function () {
    		_this.sideHideFn();
    		
    	},10)
    	
    }

    
    sideShowFn=()=>{
    	let { rightPosition ,showSide} = this.state;
    	clearInterval(this.timer)
    	if (showSide) {
    		if (rightPosition<0) {
    			rightPosition = rightPosition+5
    			this.setState({
    				rightPosition:rightPosition
    			
    			})
    		}
    	}
    }

    sideHideFn=()=>{
    	let { rightPosition} = this.state;
    	
    	clearInterval(this.hidetimer)
    	this.sideHideEnd();
    	if ( rightPosition>=0 ) {
    		rightPosition = rightPosition-80
    		this.setState({
    			rightPosition:rightPosition,
    		})
    	}
    }

    sideShowEnd(){
    	
    }
    sideHideEnd(){
    	this.props.sideHideEnd(this.state.showSide)
    }

    getPropsShow(){
    	if (this.props.getPropsShow) {
    		this.props.getPropsShow();
    		
    	}
    	
    	
    }

    getPropsHide(){
    	if (this.props.getPropsHide) {
    		this.props.getPropsHide();
    		
    	}
    	this.sideHideFn();
    }


    render() {
    	let { showSide, rightPosition} = this.state;

    	let BgStyle = {
    		display:showSide?'block':'none'
    	}
        let sideStyle = {display:showSide?'block':'none'}

        return (
        		<div style={this.props.style?this.props.style:sideStyle}>
    				<div className={showSide?"fadeInRight sidebar oya ub-ver":" sidebar oya ub-ver"} style={{overflowX: 'hidden'}} >
    					{this.props.children}
    				</div>
    				<div className={showSide?"in sidebar-bg":"sidebar-bg "}style={BgStyle}></div>
        	    </div>
        	);
    }
}


export default SideBar;
