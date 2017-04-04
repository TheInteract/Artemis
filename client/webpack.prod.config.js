const webpack = require(`webpack`)
const path = require('path')

module.exports = {
  entry: [
    'whatwg-fetch',
    './index.js'
  ],
  output: {
    filename: 'analytics.js',
    path: path.resolve(__dirname, '../server/static'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [ /node_modules/ ],
        query: {
          babelrc: false,
          presets: [ [ 'es2015', { modules: false } ] ],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        COLLECTOR_BASE: JSON.stringify('http://localhost:3000/'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
}
