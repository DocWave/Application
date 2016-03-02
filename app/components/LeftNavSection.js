import React from 'react';

// overarching component tag
import LeftNav from 'material-ui/lib/left-nav';

// list elements
import AutoComplete from 'material-ui/lib/auto-complete';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

// icon
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';

module.exports = React.createClass({
  generateDocSets: function() {
    'use strict';
      let docSets = [], counter = 0;
      for (let key in this.props.currentDownloads) {
        docSets.push(
          <ListItem
              key={counter++}
              primaryText={key}
              leftIcon={<ActionGrade/>}
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
            style={{ padding: '0 20' }}
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
