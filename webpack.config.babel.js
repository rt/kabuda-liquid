var path = require('path');

var libraryName = 'KABUDA';

var plugins = [], outputFile;

outputFile = libraryName + '.js';

export default () => (
    {
        mode: 'production',
        entry: __dirname + '/src/index.js',
        devtool: 'source-map',
        output: {
            path: __dirname + '/dist',
            filename: outputFile,
            library: libraryName,
            libraryTarget: 'umd',
            globalObject: 'this'
        },
        externals: {
            XMLHttpRequest: 'XMLHttpRequest'
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: 'babel-loader'
                }
            ]
        }
    }
);

