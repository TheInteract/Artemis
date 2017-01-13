const webpack = require(`webpack`)

module.exports = {

    entry: [
        './src/client/index.js',
    ],

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
                query: {
                    babelrc: false,
                    presets: [
                        ['es2015', { modules: false }],
                    ],
                },
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                COLLECTOR_BASE: JSON.stringify('http://35.186.212.151/'),
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    ],
}
