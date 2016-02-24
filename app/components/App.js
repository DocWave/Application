import React from 'react';
import ReactDOM from 'react-dom';

import Colors from 'material-ui/lib/styles/colors';

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
    return {
      open: true,
      rightBodyWidth: '80%',
      currentFrame: 'welcome.html',
    }
  },
  handleToggle: function() {
    // this function is for toggling the sidebar, wherever that may be needed
    let newWidth;
    (this.state.rightBodyWidth === '80%') ? newWidth = '100%' : newWidth = '80%';
    this.setState({open: !this.state.open, rightBodyWidth: newWidth})
  },
  switchFrame: function(newFrame) {
    console.log('youre trying to switch frame', newFrame);
    this.setState({currentFrame: newFrame})
  },
  render: function () {
    return (
      <div id="App">
        <LeftNavSection open={this.state.open} switchFrame={this.switchFrame}/>
        <RightBodySection
            rightBodyWidth={this.state.rightBodyWidth}
            toggleSideBar={this.handleToggle}
            currentFrame={this.state.currentFrame}
            />
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));
