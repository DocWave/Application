import React from 'react';
import ReactDOM from 'react-dom';

import LeftNavSection from './LeftNavSection';
import RightBodySection from './RightBodySection';

import Tab from 'material-ui/lib/tabs/tab';
import ActionFlightTakeoff from 'material-ui/lib/svg-icons/action/flight-takeoff';
import OffIcon from 'material-ui/lib/svg-icons/content/clear';
import IconButton from 'material-ui/lib/icon-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';

// needed for button clicks to work functionally
//  https://github.com/callemall/material-ui/issues/1011
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin();


var App = React.createClass({
  getInitialState: function() {
    var that = this;
    return {
      open: true,
      rightBodyWidth: '80%',
      currentFrame: 'welcome.html',
      currentTab: 'a',
      currentTabs: [ <Tab
          icon={<OffIcon />}
          label={'leaTab'}
          value={'a'}
          inkBarStyle={{backgroundColor:"#FFC107", color:'#000'}}
          onClick={ function() {
          return that.switchTab('a') } } />,
        <Tab
          icon={<OffIcon />}
          label={'cruzTab'}
          value={'b'}
          inkBarStyle={{backgroundColor:"#FFC107", color:'#000'}}
          onClick={ function() {
          return that.switchTab('b') } } />,
        <Tab
          icon={<OffIcon />}
          label={'danTab'}
          value={'c'}
          inkBarStyle={{backgroundColor:"#FFC107", color:'#000'}}
          onClick={ function() {
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
