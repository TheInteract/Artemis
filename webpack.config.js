const webpack = require('webpack')

module.exports = {

    entry: [
        './src/client/index.js',
        'whatwg-fetch',
    ],

    devtool: 'eval-source-map',

    output: {
        filename: 'analytics.js',
        path: './static',
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
                exclude: [/node_modules/],
            },
        ],
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
    ],
}
