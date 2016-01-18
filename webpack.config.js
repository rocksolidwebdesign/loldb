var webpack = require('webpack');
var port = process.env.npm_package_config_port || 3000;

module.exports = {
  //devtool: 'source-map',
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:'+port,
    'webpack/hot/only-dev-server',
    './scripts/app/main.js'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    root: __dirname+'/scripts',
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded" },
      { test: /\.jsx$/, loaders: ['react-hot', 'jsx?harmony'] },
      { test: /\.js$/, loaders: ['react-hot', 'jsx?harmony'] }
    ]
  },
  output: {
    path: __dirname+'/public/app',
    filename: 'bundle.js',
    publicPath: '/app/'
  }
};
