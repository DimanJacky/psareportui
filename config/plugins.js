'use strict';


const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

const paths = require('./paths');
const isEnvDevelopment = process.env.NODE_ENV !== 'production';
const isEnvProduction = process.env.NODE_ENV === 'production';
const dependencies = paths.appPackageJson.dependencies;
const plugins = [];

// This is necessary to emit hot updates (CSS and Fast Refresh):
if(isEnvDevelopment)
    plugins.push(new webpack.HotModuleReplacementPlugin());

// Watcher doesn't work well if you mistype casing in a path so we use
// a plugin that prints an error when you attempt to do this.
// See https://github.com/facebook/create-react-app/issues/240
if(isEnvDevelopment)
    plugins.push(new CaseSensitivePathsPlugin());

if(isEnvProduction)
    plugins.push(new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }));


plugins.push(new HTMLWebpackPlugin(
    Object.assign(
        {
        },
        {
            filename: 'index.html',
            chunks: ['main'],
            inject: true,
            template: paths.appHtml,
        },
        isEnvProduction
            ? {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                    showErrors: false,
                },
            }
            : undefined
    )
));

plugins.push(new HtmlWebpackTagsPlugin(
    {
        tags: ['config.js'],
        append: false,
        hash: true
    }
));

const NODE_ENV = process.env.NODE_ENV !== 'production' ? '.' +
    (process.env.ENV_PREF ? process.env.ENV_PREF : 'dev') : '';

plugins.push(new Dotenv({
    path: `${paths.dotenv}${NODE_ENV}`
}));


plugins.push(
    new ModuleFederationPlugin({
        name: 'report',
        remotes: {
        },
    }),
);

module.exports = plugins;
