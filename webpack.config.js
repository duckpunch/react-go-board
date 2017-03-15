module.exports = {
    entry: [
        './src/index'
    ],
    output: {
        filename: './lib/stuff.js'
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
