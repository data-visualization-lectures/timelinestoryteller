(function () {

  "use strict";

  var express = require('express');
  var app = express();
  var path = require('path');
  var server = require('http').createServer(app);
  var serverPort = process.env.PORT || 8000;

  // If this isn't production, add in the webpack middleware
  if(process.env.NODE_ENV !== "production") {
    var webpack = require("webpack");
    var webpackMiddleware = require("webpack-dev-middleware");
    var config = require("./webpack.config");
    config.devtool = "eval";
    config.output.filename = "js/timelinestoryteller.js";
    config.output.path = path.join(__dirname, 'public'),
    app.use(webpackMiddleware(webpack(config)));
  }

  app.use(express.static(path.join(__dirname, 'public')));

  server.listen(serverPort, function() {
    console.log('Server started on port %s', serverPort);
  });

})();
