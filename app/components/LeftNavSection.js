import React from 'react';

// overarching component tag
import LeftNav from 'material-ui/lib/left-nav';

// Top half of menu
import MenuItem from 'material-ui/lib/menus/menu-item';
import Badge from 'material-ui/lib/badge';

// list elements
import AutoComplete from 'material-ui/lib/auto-complete';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

// icons
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications';
import ContentDrafts from 'material-ui/lib/svg-icons/content/drafts';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import ContentInbox from 'material-ui/lib/svg-icons/content/inbox';
import ContentSend from 'material-ui/lib/svg-icons/content/send';
import FolderClosed from 'material-ui/lib/svg-icons/file/folder';
import Checkbox from 'material-ui/lib/checkbox';


module.exports = React.createClass({
  getInitialState: function() {
    //sending request to main.js to parse out the SQL-lite file
    ipcRenderer.send('dbparse')
    ipcRenderer.on('dbparse', (event, arg) => {
      console.log(Object.keys(arg));
      // when the parsed data comes back, let's pass it into the populateNode fn
      this.populateNode(arg)
    });
    // our initial state is empty
    return { nodeChildren: [] }
  },
  populateNode: function(node_titles) {
    //reduce the function into nodeChildren: { section: [ [{TYPE, NAME, LINK}, etc.]], nextSection: []}
    var newHierarchy = node_titles.result.reduce(function(sections, current) {
      if (!sections[current.TYPE]) sections[current.TYPE] = [];
      sections[current.TYPE].push(current)
      return sections
    }, {})
    // console.log(newHierarchy); //pseudo-test: Works!

    var listItemsArray = []
    var i = 0;
    // for each section
    for (var key in newHierarchy) {
      //push a new list item that has all the sections as children
      listItemsArray.push(
        <ListItem
              key={i++}
              primaryText={key}
              initiallyOpen={false}
              nestedItems={newHierarchy[key].map(function(curr, j) {
                return  <ListItem
                    key={j}
                    primaryText={curr.NAME}
                    NAME={curr.NAME}
                    LINK={curr.LINK}
                    TYPE={curr.TYPE}
                  />
              })}
            />
      )
    }
    this.setState({ nodeChildren: listItemsArray })
  },
  render: function () {
    return (
        <LeftNav open={this.props.open}>
              <AutoComplete
                floatingLabelText={"Documentation"}
                filter={AutoComplete.fuzzyFilter}
                dataSource={['Dan', 'Lea', 'Cruz']}
              />
						<List subheader="Downloaded">
              <ListItem
                  primaryText="NodeJS"
                  leftIcon={<ActionGrade />}
                  initiallyOpen={false}
                  primaryTogglesNestedList={true}
                  nestedItems={this.state.nodeChildren}
                />
            </List>
            <Divider />
        </LeftNav>
			)
		}
	})


// I dont think we're gonna use these, keepin the syntax just in case though
// function formerMenuButtons () {
//   return (
//     <div>
//         <MenuItem onClick={this.switchView}>HTML<Badge badgeContent={32} secondary={true}
//         badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
//         <MenuItem onClick={this.switchView}>CSS<Badge badgeContent={27} secondary={true}
//         badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
//         <MenuItem onClick={this.switchView}>JS<Badge badgeContent={45} secondary={true}
//         badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
//         <MenuItem onClick={this.switchView}>Node<Badge badgeContent={24} secondary={true}
//         badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
//     </div>
//   )
// }
