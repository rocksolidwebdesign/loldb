var fs, path, express, bodyParser, WebpackDevServer, webpack, config;

WebpackDevServer = require("webpack-dev-server");
webpack = require("webpack");
config = require("./webpack.config");

fs = require('fs');
path = require('path');
express = require('express');
bodyParser = require('body-parser');

app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.get('/api/abilities', function(req, res) {
  var abilities = JSON.parse(fs.readFileSync('db/abilities.json'));

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(abilities));
});

app.get('/api/champions', function(req, res) {
  var champions = JSON.parse(fs.readFileSync('db/4.18.1/champion.json'));

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(champions));
});

app.get('/api/items', function(req, res) {
  var items = JSON.parse(fs.readFileSync('db/4.18.1/item.json'));

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(items));
});

app.listen(3001);

console.log('API started: http://localhost:3001/api/');

var port = process.env.npm_package_config_port || 3000;

new WebpackDevServer(webpack(config), {
  contentBase: 'public',
  publicPath: config.output.publicPath,
  hot: true,
  quiet: false,
  headers: { "X-Custom-Header": "yes" },
  stats: { colors: true }
}).listen(port, "localhost", function(err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Server started: http://localhost:'+port+'/');
});
