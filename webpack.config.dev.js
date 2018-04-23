module.exports = {
    entry: './src/dev.js',
    output: {
        filename: './dev-index.js'
    },
    devServer: {
        publicPath: '/static/',
        contentBase: './dev/',
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
