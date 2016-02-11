'use strict'
let fs = require('fs');
let SQL = require('sql.js');

let filebuffer = fs.readFileSync('docStorage/node.docs/documents.sqlite');

var sqlparser = {

    // Load the db
    parse: function(){
        let db = new SQL.Database(filebuffer);
        let nodeColArr = ['chapter', 'class', 'event', 'method', 'module', 'property'];
          let result = [];
          function getObj(colName){
            let stmt = db.prepare(`SELECT TYPE, NAME, LINK FROM docsearch WHERE TYPE='${colName}'`);
            stmt.getAsObject({':TYPE':{':NAME' : ':LINK'}});
            while(stmt.step()) {
              result.push(stmt.getAsObject());
            }

          }
          // getObj('event')

          nodeColArr.forEach(elem => getObj(elem));
          // console.log( result);
          return result;
        }
}
module.exports = sqlparser;
 // parseSQL(nodeColArr);
