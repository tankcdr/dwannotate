'use strict';

var http=require('http');

var port=(process.env.PORT || 3000);

http.createServer(function (req, res) {
  res.statusCode=200;
  res.end('Bridge is up and running on port '+port+'!');
}).listen(port);
