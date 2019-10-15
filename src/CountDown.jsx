import React from 'react';

/**
 * count 时间
 * rendHtml 计时器执行时
 * postDataFn 执行时传值
 * endhtml 结束时
 * endFn  结束时回调
 * 
 */
class CountDown extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'CountDown';
        this.state = {
            start:false,
            count:this.props.count,
            hh:'',
            mm:'',
            ss:'',
            postFn:false,
            endStatus:false
        }
        this.timer = null;
        this.countTimer = null;
    }

    static defaultProps = {
        
    }

    // componentWillMount() {
    //     _this.postFn();
    // }

    intervalStart = ()=>{
        let _this = this;
        if (this.state.count) {

            this.timer = setInterval(function () {
                _this.setIntervalFn();
                _this.postFn();
            },1000);

            // this.countTimer = setInterval(function () {
                 
            // })
        }
        

    }

    componentDidMount() {
        this.intervalStart();
        
    }

    setIntervalFn = ()=>{

        // console.log(this.state.count)
        if (this.state.count>0) {
            this.setState({
                count:this.state.count-1
            })
        }else if (this.state.count <= 0) {
        
            clearTimeout(this.countTimer)
            clearTimeout(this.timer)
            this.getEndFn();
        }

    }
    
    getEndFn=()=>{
        if (this.props.endFn) {
            this.props.endFn();
            this.setState({
                endStatus:true
            })
        }
    }

    postFn = ()=>{
        let hh = Math.abs(parseInt(this.state.count/60/60%24,10));
        let mm = Math.abs(parseInt(this.state.count/60%60, 10));
        let ss = Math.abs(parseInt(this.state.count%60, 10));

        if (hh<10) {hh = '0'+hh}
        if (mm<10) {mm = '0'+mm}
        if (ss<10) {ss = '0'+ss}

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

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        let _this = this;
        let html = [];
        const {hh,mm,ss} = this.state;
        // console.log(this.props.endCount)

        // if (this.state.endStatus) {

        //     html.push(this.props.endHtml)
        // }else{
        //     html.push(this.props.rendHtml)
        // }
        return <span>剩余{hh}小时{mm}分钟</span>
    }
}

export default CountDown;
