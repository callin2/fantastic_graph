const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        // main :'./src/main.ts',
        DemoApp:'./src/DemoApp.ts'
    },
    output: {
        filename: "[name].js",
        devtoolLineToLine: true,
        sourceMapFilename: "[file].map",
        path: path.resolve(__dirname, 'dist'),
        pathinfo: true,  // must be removed at production
        publicPath: "/dist/"
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.styl$/,
                use: ['style-loader','css-loader','stylus-loader']
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
};
