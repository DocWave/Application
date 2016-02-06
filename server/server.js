'use strict';

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const path = require( 'path' );
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'./../public')));
/////////////////////////////////////////////////
//// Handle requests to our main page
/////////////////////////////////////////////////
app.get('/' , function(req, res){
  console.log("Our website homepage!");
  res.sendFile(path.join(__dirname,'/../public/index.html'));
});
/////////////////////////////////////////////////
//// Handle requests for data
/////////////////////////////////////////////////
app.get('/html', function(req,res){
  res.sendFile(path.join(__dirname, '/../index.html'));
  console.log("send full html back to client");
});

app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});
