import React from 'react';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ItemModal';
        this.state={
            show:false
        }
        this.toggleShow = this.toggleShow.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.show!=this.state.show) {
            this.setState({
                show:nextProps.show
            })
        }
    }

    toggleShow(){
        this.setState({
            show:!this.state.show
        })
    }

    getHtml(){
        if (this.props.dataTel) {
            return this.props.dataTel()
        }
    }

    render() {
        let style = {display:this.state.show?'block':'none'};
        let bgClass = this.state.show?' item-in':'';
        let h = document.body.offsetHeight < document.body.scrollHeight?document.body.scrollHeight:document.body.offsetHeight;
        let height = {height:h};
        return <div className="item-modal"  style={style}>
                <div className="item-modal-body">
                    {this.getHtml()}
                </div>
                <div className={"item-modal-backdrop"+bgClass} style={height}></div>
            </div>;
    }
}

// ItemModal.defaultProps = {
//     show:this.props.show
// }

export default ItemModal;
