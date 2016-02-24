import React from 'react';
import ReactDOM from 'react-dom';

import RightBodySection from './RightBodySection';
import LeftNavSection from './LeftNavSection';
import ListItem from 'material-ui/lib/lists/list-item';

// needed for button clicks to work functionally
//  https://github.com/callemall/material-ui/issues/1011
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin();


var App = React.createClass({
  getInitialState: function() {
    ipcRenderer.send('reqDocset', 'node')
    ipcRenderer.send('reqDocset', 'express')
    ipcRenderer.on('reqDocset', (event, arg) => {
      console.log('ipcRenderer', arg);
      if (arg[0] === 'node') this.populate(arg[1], 'node')
      if (arg[0] === 'express') this.populate(arg[1], 'express')
    });
    return {
      open: true,
      rightBodyWidth: '80%',
      currentFrame: 'welcome.html',
      currentDownloads: {}
    }
  },
  populate: function(newDocSet, nameOfNewDocSet) {
    console.log('populat 1st line: ', newDocSet);
    var that = this;
    //reduce the function into nodeChildren: { section: [ [{TYPE, NAME, LINK}, etc.]], nextSection: []}
    var newHierarchy = newDocSet.reduce(function(sections, current) {
      if (!sections[current.TYPE]) sections[current.TYPE] = [];
      sections[current.TYPE].push(current)
      return sections
    }, {})
    var listItemsArray = []
    var i = 0;
    console.log('preHierarchy', listItemsArray)
    for (var key in newHierarchy) {
      //push a new list item that has all the sections as children
      listItemsArray.push(
        <ListItem
              switchFrame = {that.switchFrame}
              key={i++}
              primaryText={key}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={newHierarchy[key].map(function(curr, j) {
                return  <ListItem
                    key={j}
                    primaryText={curr.NAME}
                    onClick={function() {
                      that.switchFrame(`docStorage/${nameOfNewDocSet}.docs/documents/${curr.LINK}`)
                    }}
                  />
              })}
            />
      )
    }
    console.log('new hierArchy', listItemsArray);
    let newCurrDL = that.state.currentDownloads
    newCurrDL[nameOfNewDocSet] = listItemsArray
    this.setState({ 'currentDownloads': newCurrDL })
  },
  handleToggle: function() {
    // this function is for toggling the sidebar, wherever that may be needed
    let newWidth;
    (this.state.rightBodyWidth === '80%') ? newWidth = '100%' : newWidth = '80%';
    this.setState({open: !this.state.open, rightBodyWidth: newWidth})
  },
  switchFrame: function(newFrame) {
    // this function is for switching the webView frame's src property
    this.setState({currentFrame: newFrame})
  },
  render: function () {
    return (
      <div id="App">
        <LeftNavSection
          open={this.state.open}
          switchFrame={this.switchFrame}
          currentDownloads={this.state.currentDownloads}
           />
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
