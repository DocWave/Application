module.exports = {
		//Parse will return an array containing the objects that make our sidebar
		parse: function() {
			'use strict'
			let fs = electronRequire('fs');
			let SQL = electronRequire('sql.js');
			let path = require('path');
			let filebuffer = fs.readFile('docStorage/node.docs/documents.sqlite');
			//Create instance of db
			let db = new SQL.Database(filebuffer);

			/*
			  an array of every "type" available in node
			  TODO: create storage for "types" in any docset
			*/
			let nodeColArr = ['chapter', 'class', 'event', 'method', 'module', 'property'];

			//initialize an array for the output
			let result = [];

			/*
			  getObj() pushes objects into results array
			  based on query using each element in colName

			  @param {Array} colName (Sqlite Column name)
			*/
			function getObj(colName) {
				//creates an object that can take sql.js commands based on query
				let stmt = db.prepare(`SELECT TYPE, NAME, LINK FROM docsearch WHERE TYPE='${colName}'`);
				//sets up a structure for the returned object
				stmt.getAsObject({
					':TYPE': {
						':NAME': ':LINK'
					}
				});
				// step returns a boolean based on if the stmt(statement) can return another row
				while (stmt.step()) {
					result.push(stmt.getAsObject());
				}
			}
			//loop through each elem in array and push to array an object with type name and static link
			nodeColArr.forEach(elem => getObj(elem));
			return {
				"result": result,
				"sections": nodeColArr
			};
		}
	}
