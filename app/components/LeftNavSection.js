import React from 'react';

// overarching component tag
import LeftNav from 'material-ui/lib/left-nav';

// Top half of menu
import MenuItem from 'material-ui/lib/menus/menu-item';
import Badge from 'material-ui/lib/badge';

// list elements
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
    ipcRenderer.send('dbparse')
    ipcRenderer.on('dbparse', (event, arg) => {
      console.log(arg);
      this.populateNode(arg)
    });
    return { children: [] }
  },
  populateNode: function(node_titles) {
    var newChildren = node_titles.sections.map(function(section, i) {
      return <ListItem key={i} primaryText={section} leftIcon={<FolderClosed />} />
    })
    this.setState({ children: newChildren })
  },
  render: function () {
    return (
        <LeftNav open={this.props.open}>
						<List subheader="Available">
              <ListItem
                  primaryText="NodeJS"
                  leftIcon={<ActionGrade />}
                  initiallyOpen={true}
                  primaryTogglesNestedList={true}
                  nestedItems={this.state.children}
                />
            </List>
            <Divider />
        </LeftNav>
			)
		}
	})



function formerMenuButtons () {
  return (
    <div>
        <MenuItem onClick={this.switchView}>HTML<Badge badgeContent={32} secondary={true}
        badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
        <MenuItem onClick={this.switchView}>CSS<Badge badgeContent={27} secondary={true}
        badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
        <MenuItem onClick={this.switchView}>JS<Badge badgeContent={45} secondary={true}
        badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
        <MenuItem onClick={this.switchView}>Node<Badge badgeContent={24} secondary={true}
        badgeStyle={{top: 18, right: 0}} ></Badge></MenuItem>
    </div>
  )
}
