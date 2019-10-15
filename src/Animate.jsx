import React from 'react';


class Animate extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'CountDown';
        this.state = {
            move:false,
            leave:false,
            hide:false,
            state:this.props.state
        }
    }
    static defaultProps = {
        inTime:400,
        outTime:400,
        inEndFn:function(){},
        outEndFn:function(){},
        inStartFn:function(){},
        outStartFn:function(){},
        inClass:'in',
        outClass:'out',
        hideClass:'hide',
        tagName:'div',
        className:'animate-tag',
        state:"none"
    }
    componentDidMount() {
        this.play(this.state.state);
    }
    componentWillReceiveProps(nextProps) {
    
        if(nextProps.state!=this.state.state){
            this.play(nextProps.state);
        }
    }
    play=(state)=>{
        switch(state){
            case "move":
                this.move();
                break;
            case "leave":
                this.leave();
                break;
            case "none":
                break;
        }
    }
    move=()=>{
        let {inEndFn,inTime,inStartFn}=this.props;
        inStartFn();
        this.setState({move:true,leave:false,hide:false});
        setTimeout(()=>{
            inEndFn();
        },inTime);
    }
    leave=()=>{
        let {outEndFn,outTime,outStartFn}=this.props;
        outStartFn();
        this.setState({move:false,leave:true,hide:false});
        setTimeout(()=>{
            this.setState({move:false,leave:false,hide:false});
            outEndFn();
        },outTime)
    }
    checkClassName=()=>{
        let {move,leave,hide}=this.state;
        let {className,inClass,outClass}=this.props;
        if(move){
            className=className+" "+inClass
        }else if(leave){
            className=className+" "+outClass
        }
        return className;
    }
    render() {
        let _this = this;
        return React.createElement(
            this.props.tagName, 
            {
                className: this.checkClassName()
            },
            this.props.children
        );
    }
}

export default Animate;
