const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        pathinfo: true,  // must be removed at production
        publicPath: "/dist/"
    },

    module: {
        rules: [
            {
                test: /\.styl$/,
                use: ['style-loader','css-loader','stylus-loader']
            }
        ]
    },

    // plugins: [
    //     new webpack.LoaderOptionsPlugin({
    //         test: /\.styl$/,
    //         stylus: {
    //             // You can have multiple stylus configs with other names and use them
    //             // with `stylus-loader?config=otherConfig`.
    //             default: {
    //                 use: [stylus_plugin()],
    //             },
    //             // otherConfig: {
    //             //     use: [other_plugin()],
    //             // },
    //         },
    //     }),
    // ]
};
