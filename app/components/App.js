import React from 'react';
import ReactDOM from 'react-dom';

import LeftNavSection from './LeftNavSection';
import RightBodySection from './RightBodySection';

var App = React.createClass({
  getInitialState: function() {
    return {
      open: true,
      rightBodyWidth: '80%',
      currentTab: 'a'
    }
  },
  switchTab: function(newTab) {
    // this function is for changing tabs
    this.setState({ currentTab: newTab })
  },
  handleToggle: function() {
    // this function is for toggling the sidebar, wherever that may be needed
    let newWidth, newIcon;
    (this.state.rightBodyWidth === '80%') ? newWidth = '100%' : newWidth = '80%';
    this.setState({open: !this.state.open, rightBodyWidth: newWidth})
  },
  render: function () {
    return (
      <div id="App">
        <LeftNavSection open={this.state.open}/>
        <RightBodySection
            switchTab={this.switchTab}
            rightBodyWidth={this.state.rightBodyWidth}
            currentTab={this.state.currentTab}
            toggleSideBar={this.handleToggle}
            />
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));
