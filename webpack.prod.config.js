const webpack = require(`webpack`)

module.exports = {

    entry: [
        './src/client/index.js',
        'whatwg-fetch',
    ],

    devtool: 'eval',

    output: {
        filename: 'analytics.js',
        path: './static',
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    ],
}
