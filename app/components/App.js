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
  requestDocSet: function(docSet) {
    ipcRenderer.send('reqDocset', docSet)
  },
  getInitialState: function() {
    //this.requestDocSet('mdn_javascript')

    ipcRenderer.on('reqDocset', (event, arg) => {
      console.log('ipcRenderer', arg);
      if (arg[1] === typeof 'string') {
        // error-handling below is currently not working, will investigate later
        console.log('error:! ', arg[1])
      } else {
        this.populate(arg[1], arg[0])
      }
    });
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
  },
  populate: function(newDocSet, nameOfNewDocSet) {
    var that = this;
    //reduce the function into nodeChildren: { section: [ [{TYPE, NAME, LINK}, etc.]], nextSection: []}
    var newHierarchy = newDocSet.reduce(function(sections, current) {
      if (!sections[current.TYPE]) sections[current.TYPE] = [];
      sections[current.TYPE].push(current)
      return sections
    }, {})
    var listItemsArray = []
    var i = 0;
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
                var currNames = that.state.liveUpdateNames;
                var currLinks = that.state.liveUpdateLinks;
                currNames.push(curr.NAME)
                currLinks.push(`docStorage/${nameOfNewDocSet}.docs/documents/${curr.LINK}`)
                that.setState({
                  liveUpdateNames: currNames,
                  liveUpdateLinks: currLinks
                })

                // fuzzyFilterArray.push(curr.NAME, curr.LINK)

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
    var currFrame = this.state.currentFrame

    console.log(`switching from ${currFrame} to ${newFrame}`);

    var cI = currFrame.indexOf('#')
    var nI = newFrame.indexOf('#')
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
