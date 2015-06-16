var express = require('express'),
  path = require('path'),
  config = require('./config'),
  favicon = require('serve-favicon'),
  app = express(),
  cookieParser = require('cookie-parser'),
  couchbase = require('couchbase')
  uuid = require('uuid');


var cluster = new couchbase.Cluster(exports.COUCHBASE_ADDRESS);
var bucket = cluster.openBucket('g_analytics');

app.use(cookieParser('KEYBOARDCAT'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get("/", function(req, res){
  var theCookie = req.cookies._ia;
  var myData = {};
  
  if (!theCookie) {
    res.cookie('_ia', uuid.v4());
  }
  
  myData.user = theCookie;
    
  for (var key in req.headers) {
    myData[key] = req.headers[key];
  }

  bucket.insert(uuid.v4(), myData, function(err, res) {});
  res.status(200).send();
});

app.listen(process.env.PORT || config.PORT);