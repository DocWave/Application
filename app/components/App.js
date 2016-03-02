import React from 'react';
import ReactDOM from 'react-dom';

import RightBodySection from './RightBodySection';
import LeftNavSection from './LeftNavSection';
import ListItem from 'material-ui/lib/lists/list-item';

// needed for button clicks to work functionally
//  https://github.com/callemall/material-ui/issues/1011
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin();


let App = React.createClass({
  requestDocSet: function(docSet) {
    ipcRenderer.send('reqDocset', docSet)
  },
  getInitialState: function() {
    // when we received our docset, handle errors and then populate sidebar
    ipcRenderer.on('reqDocset', (event, arg) => {
      console.log('ipcRenderer', arg);
      if (arg[1] === typeof 'string') {
        // error-handling below is currently not working, will investigate later
        console.log('error:! ', arg[1])
      } else {
        this.populate(arg[1], arg[0])
      }
    });
    // app state: whether the sidebars open, the current docSets, and livesearch arrays
    return {
      open: true,
      rightBodyWidth: '80%',
      currentFrame: 'welcome.html',
      currentDownloads: {},
      liveUpdateNames: [],
      liveUpdateLinks: [],
    }
  },
  componentDidMount: function() {
    // test requests for docSets
    this.requestDocSet('node')
    this.requestDocSet('mdn_javascript')
    this.requestDocSet('mdn_html')
    this.requestDocSet('mdn_css')
    this.requestDocSet('express')
  },
  populate: function(newDocSet, nameOfNewDocSet) {
    let that = this;
    //reduce the function into nodeChildren: { section: [ [{TYPE, NAME, LINK}, etc.]], nextSection: []}
    let newHierarchy = newDocSet.reduce(function(sections, current) {
      if (!sections[current.TYPE]) sections[current.TYPE] = [];
      sections[current.TYPE].push(current)
      return sections
    }, {});
    let listItemsArray = []
    let i = 0;
    let currNames = that.state.liveUpdateNames;
    let currLinks = that.state.liveUpdateLinks;
    for (let key in newHierarchy) {
      //push a new list item that has all the sections as children
      listItemsArray[listItemsArray.length] = (
        <ListItem
              switchFrame = {that.switchFrame}
              key={i++}
              primaryText={key}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={newHierarchy[key].map(function(curr, j) {
                // needed for live searching
                currNames[currNames.length] = curr.NAME
                currLinks[currLinks.length] = `docStorage/${nameOfNewDocSet}.docs/documents/${curr.LINK}`
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
    let newCurrDL = that.state.currentDownloads
    newCurrDL[nameOfNewDocSet] = listItemsArray
    this.setState({
      currentDownloads: newCurrDL,
      liveUpdateNames: currNames,
      liveUpdateLinks: currLinks })
  },
  handleToggle: function() {
    // this function is for toggling the sidebar, wherever that may be needed
    let newWidth;
    (this.state.rightBodyWidth === '80%') ? newWidth = '100%' : newWidth = '80%';
    this.setState({open: !this.state.open, rightBodyWidth: newWidth})
  },
  switchFrame: function(newFrame) {
    // this function is for switching the webView frame's src property
    let currFrame = this.state.currentFrame
    console.log(`switching from ${currFrame} to ${newFrame}`);
    let cI = currFrame.indexOf('#')
    let nI = newFrame.indexOf('#')
    // checks if it's still the same page
    if (currFrame.slice(0, cI) === newFrame.slice(0, nI)) {
      this.setState({currentFrame: newFrame})
    } else {
      this.setState({currentFrame: newFrame})
    }
  },
  render: function () {
    return (
      <div id="App">
        <LeftNavSection
          open={this.state.open}
          switchFrame={this.switchFrame}
          currentDownloads={this.state.currentDownloads}
          liveUpdateNames={this.state.liveUpdateNames}
          liveUpdateLinks={this.state.liveUpdateLinks}
           />
        <RightBodySection
            rightBodyWidth={this.state.rightBodyWidth}
            toggleSideBar={this.handleToggle}
            currentFrame={this.state.currentFrame}
            switchFrame={this.switchFrame}
            />
      </div>
    )
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));
