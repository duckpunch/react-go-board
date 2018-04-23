module.exports = {
    entry: [
        './src/index'
    ],
    output: {
        library: 'react-go-board',
        libraryTarget: 'umd',
        filename: './lib/index.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["env", "react"]
                }
            }
        ]
    }
};
