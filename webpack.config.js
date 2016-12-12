const webpack = require('webpack')

module.exports = {

    entry: [
        './src/client/index.js',
    ],

    devtool: 'cheap-module-source-map',

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
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
    ],
}
