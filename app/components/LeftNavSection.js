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

import fs from 'fs';

module.exports = React.createClass({
  generateDocSets: function() {
    'use strict';
      var docSets = [], counter = 0;
      for (let key in this.props.currentDownloads) {
        docSets.push(
          <ListItem
              key={counter++}
              primaryText={key}
              leftIcon={<ActionGrade />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={this.props.currentDownloads[key]}
              switchFrame={this.props.switchFrame}
            />
        )
      }
      return docSets
  },
  render: function () {
    return (
        <LeftNav open={this.props.open}
          switchFrame={this.props.switchFrame}
          liveUpdateLinks={this.props.liveUpdateLinks} >

          <AutoComplete
            floatingLabelText={"Search Documentation"}
            filter={AutoComplete.fuzzyFilter}
            dataSource={this.props.liveUpdateNames}
            onNewRequest={(name, index, dataSource) => {
              this.props.switchFrame(this.props.liveUpdateLinks[index]);
            }}
          />


						<List subheader="Downloaded">
              {this.generateDocSets()}
            </List>

            <Divider />
        </LeftNav>
			)
		}
	})



  // filterUpdate: function(test1, test2) {
  //   console.log('hiiiii hey', this)
  // },
