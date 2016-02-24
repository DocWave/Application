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

//import parseDB from './parseDB.js'
// var sqlParser = {
// 		//Parse will return an array containing the objects that make our sidebar
// 		parse: function() {
// 			'use strict'
// 			let fs = electronRequire('fs');
// 			let SQL = electronRequire('sql.js');
//       // fs.readdir( './app/docStorage', (err, file) => {console.log(err, file)}     )
//       let filebuffer = fs.readFileSync(__dirname + './app/docStorage/node.docs/documents.sqlite');
// 			//Create instance of db
// 			let db = new SQL.Database(filebuffer);
//
// 			/*
// 			  an array of every "type" available in node
// 			  TODO: create storage for "types" in any docset
// 			*/
// 			let nodeColArr = ['chapter', 'class', 'event', 'method', 'module', 'property'];
//
// 			//initialize an array for the output
// 			let result = [];
//
// 			/*
// 			  getObj() pushes objects into results array
// 			  based on query using each element in colName
//
// 			  @param {Array} colName (Sqlite Column name)
// 			*/
// 			function getObj(colName) {
// 				//creates an object that can take sql.js commands based on query
// 				let stmt = db.prepare(`SELECT TYPE, NAME, LINK FROM docsearch WHERE TYPE='${colName}'`);
// 				//sets up a structure for the returned object
// 				stmt.getAsObject({
// 					':TYPE': {
// 						':NAME': ':LINK'
// 					}
// 				});
// 				// step returns a boolean based on if the stmt(statement) can return another row
// 				while (stmt.step()) {
// 					result.push(stmt.getAsObject());
// 				}
// 			}
// 			//loop through each elem in array and push to array an object with type name and static link
// 			nodeColArr.forEach(elem => getObj(elem));
// 			return {
// 				"result": result,
// 				"sections": nodeColArr
// 			};
// 		}
// 	}


module.exports = React.createClass({
  getInitialState: function() {
    this.populateNode(sqlParser.parse())
    // our initial state is empty
    return { nodeChildren: [] }
  },
  populateNode: function(node_titles) {
    var that = this;
    //reduce the function into nodeChildren: { section: [ [{TYPE, NAME, LINK}, etc.]], nextSection: []}
    var newHierarchy = node_titles.result.reduce(function(sections, current) {
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
              switchFrame = {this.props.switchFrame}
              key={i++}
              primaryText={key}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={newHierarchy[key].map(function(curr, j) {
                return  <ListItem
                    key={j}
                    primaryText={curr.NAME}
                    onClick={function() {
                      that.props.switchFrame(`docStorage/node.docs/documents/${curr.LINK}`)
                    }}
                  />
              })}
            />
      )
    }
    this.setState({ nodeChildren: listItemsArray })
  },
  render: function () {
    return (
        <LeftNav open={this.props.open}
          switchFrame={this.props.switchFrame} >
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
                  switchFrame={this.props.switchFrame}
                />
            </List>
            <Divider />
        </LeftNav>
			)
		}
	})
