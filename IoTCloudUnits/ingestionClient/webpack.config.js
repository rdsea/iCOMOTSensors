var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ingestionClient.js',
    },
    plugins: [
        new webpack.BannerPlugin({banner:'#!/usr/bin/env node', raw: true }),
    ],
    module: {
        loaders:[
            {
                test: /\.js/,
                loader: 'babel-loader',
                query:{
                    presets: ['es2015','stage-1'],
                }
            }
        ]
    },
    stats:{
        colors: true,
    },
    devtool: 'source-map',
    target: 'node',
    externals: nodeModules,
}