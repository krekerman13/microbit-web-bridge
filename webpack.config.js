var path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

var config = {
    mode: 'production',
    devtool: "inline-source-map",
    entry: './src/WebBridge.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      filename: 'javascripts/WebBridge.bundle.js'
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    module: {
        rules: [
          // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
          { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
          { test: /\.pug$/, loader: 'pug-loader' },
          { test: /\.(png|jpg)$/, loader: 'url-loader'},
          { test: /\.json$/, loader: 'json-loader'}
        ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          favicon: './images/favicon.ico',
          template: './templates/index.pug',
        }),
        new MiniCssExtractPlugin({ 
          filename: './stylesheets/styles.css' 
        }),
    ]
}

module.exports = (env, argv) => {

    if (argv.mode === 'development') {
        config.plugins.push(
            new CopyPlugin([
                { from: './images', to: 'images' },
                { from: './translations/translations_local.json', to: 'translations.json' },
              ]),
        )
    }
  
    if (argv.mode === 'production') {
        config.plugins.push(
            new CopyPlugin([
                { from: './images', to: 'images' },
                { from: './translations/translations_staging.json', to: 'translations.json' }, // XXX TODO Replace for prod in other branch
              ]),
        )
    }
  
    return config;
  };