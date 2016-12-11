module.exports = {

    entry: './src/client.js',

    devtool: 'cheap-module-eval-source-map',

    output: {
        filename: 'analytics.js',
        path: './static',
    },
}
