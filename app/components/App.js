import React from 'react';
import ReactDOM from 'react-dom';

import LeftNavSection from './LeftNavSection';
import RightBodySection from './RightBodySection';

import Tab from 'material-ui/lib/tabs/tab';



var App = React.createClass({
  getInitialState: function() {
    var that = this;
    return {
      open: true,
      rightBodyWidth: '80%',
      currentFrame: 'welcome.html',
      currentTab: 'a',
      currentTabs: [
        <Tab label={'leaTab'} value={'a'} onClick={ function() {
          return that.switchTab('a') } } />,
        <Tab label={'cruzTab'} value={'b'} onClick={ function() {
          return that.switchTab('b') } } />,
        <Tab label={'danTab'} value={'c'} onClick={ function() {
          return that.switchTab('c') } } />]
    }
  },
  switchTab: function(newTab) {
    // this function is for changing tabs
    this.setState({ currentTab: newTab })
  },
  createTab: function(label, value) {
    var currArray = this.state.currentTabs
    currArray.push(<Tab label={label} value={value} onClick={ function() {
      return that.switchTab(value) } } />)
    this.setState({ currentTabs: currArray })
  },
  handleToggle: function() {
    // this function is for toggling the sidebar, wherever that may be needed
    let newWidth;
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
            currentFrame={this.state.currentFrame}
            currentTabs={this.state.currentTabs}
            />
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));
