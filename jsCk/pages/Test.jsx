import React from 'react'

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
export default React.createClass({
  getInitialState: function () {
    return { show: false }
    //console.log(this.props);
  },
  addItem: function () {
    this.setState({ show: !this.state.show });
  },
  render: function () {
    //console.log(this.state);
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="example" component="div" transitionEnterTimeout={5000} transitionLeaveTimeout={3000}>
        
         
          <div > {this.state.show ?"21312312321": 'asdadasdas'}</div> 
        </ReactCSSTransitionGroup>
        <button onClick={this.addItem}>增加</button>
      </div>
    );
  }
})