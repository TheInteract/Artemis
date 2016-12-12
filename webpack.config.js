module.exports = {

    entry: [
        './src/client/index.js',
        'whatwg-fetch',
    ],

    devtool: 'inline-source-map',

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
}
