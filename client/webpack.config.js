const webpack = require('webpack')

module.exports = {
  entry: [ 'whatwg-fetch', './index.js' ],
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'analytics.js',
    path: '../server/static',
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
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
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],
}
