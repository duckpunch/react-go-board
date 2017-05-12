const path = require('path');

module.exports = {
    entry: [
        './src/index'
    ],
    output: {
        library: 'react-go-board',
        libraryTarget: 'umd',
        filename: path.join(__dirname, './lib/index.js')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["es2015", "stage-3", "react"]
                }
            }
        ]
    }
};
