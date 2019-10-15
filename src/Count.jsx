import React from 'react';

/**
 * count 时间
 * rendHtml 计时器执行时
 * postDataFn 执行时传值
 * endhtml 结束时
 * endFn  结束时回调
 * 
 */

function format(num) {
    if (num.toString().length==2) {
        let array = num.toString();
        var nums2 = [];
        for (var i=0 ; i< array.length ; i++){
            nums2.push(parseInt(array[i]));
        }
        return <div className="inline-block"><em style={{marginRight:'5px'}}>{nums2[0]}</em><em style={{marginRight:'5px'}}>{nums2[1]}</em></div>
    }else{
        return <div className="inline-block"><em style={{marginRight:'5px'}}>0</em><em style={{marginRight:'5px'}}>{num}</em></div>
    }
}

class Count extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Count';
        this.state = {
            start:false,
            count:this.props.count,
            hh:'',
            mm:'',
            ss:'',
            postFn:false,
            endStatus:false
        }
        
    }

    static defaultProps = {
        
    }

    componentWillMount() {
        this.getEndFn();
    }

    componentDidMount() {
        let _this = this;
        
        if (this.state.count) {
            let intervalId;
            intervalId = setInterval( this.setIntervalFn,1000);
            this.setState({intervalId: intervalId})
        }
        
    }
    componentWillUnmount(){
         clearInterval(this.state.intervalId);
    }

    setIntervalFn = ()=>{
       
        if (this.state.count>0) {
            this.setState({
                count:this.state.count-1
            })
            this.postFn();
        }else if (this.state.count<0) {
            this.setState({
                count:this.state.count+1
            })
            this.postFn();
        }

        if (this.state.count == 0) {
            this.getEndFn();
            
        }
        

    }
    
    getEndFn=()=>{
        
        if (this.props.endFn&&this.state.count == 0) {
            this.props.endFn();
            clearInterval(this.state.intervalId);
        }

    }

    postFn = ()=>{
        let hh = Math.abs(parseInt(this.state.count/60/60%24,10));
        let mm = Math.abs(parseInt(this.state.count/60%60, 10));
        let ss = Math.abs(parseInt(this.state.count%60, 10));

        

        if (this.state.count>0) {
            this.setState({
                hh:hh,
                mm:mm,
                ss:ss
            })
            if (this.props.postDataFn) {
                this.props.postDataFn(this.state.hh,this.state.mm,this.state.ss)
                this.setState({
                    postFn:true
                })
            }
        }
    }

    render() {
        let {hh,mm,ss} = this.state;
       
        let html = [];
        let html1 = format(hh)
        let html2 = format(mm)
        let html3 = format(ss)

        if (this.state.count == 0) {
            html.push(this.props.endHtml)
        }else {

            html.push(<div  className='inline-block'>{html1}:{html2}:{html3}</div>)
        }
        return <div className="inline-block" key={this.props.count} >{html}</div>
    }
}

export default Count;
