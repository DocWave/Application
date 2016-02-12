'use strict'
let fs = require('fs');
let SQL = require('sql.js');
let filebuffer = fs.readFileSync('/Users/Fox/Documents/Programming/Doc-tor/docStorage/node.docs/documents.sqlite');

// Load the db
let db = new SQL.Database(filebuffer);
let nodeColArr = ['chapter', 'class', 'event', 'method', 'module', 'property'];
let result = [];
function parseSQL(colNameArr){

  function getObj(colName){
    let stmt = db.prepare(`SELECT TYPE, NAME, LINK FROM docsearch WHERE TYPE='${colName}'`);
    stmt.getAsObject(':TYPE',':NAME',':LINK');
    while(stmt.step()) {
      result.push(stmt.getAsObject());
    }
  }
  colNameArr.forEach(elem => getObj(elem));
  return result;
}

parseSQL(nodeColArr);
