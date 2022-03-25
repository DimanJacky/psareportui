const path = require('path');
const postcssNormalize = require('postcss-normalize');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const paths = require('./paths');
const sassResources = require('./sassResources');
const plugins = require('./plugins');

const isEnvDevelopment = process.env.NODE_ENV !== 'production';
const isEnvProduction = process.env.NODE_ENV === 'production';


module.exports = {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    entry: paths.appIndexJs,
    // devServer: {
    //     contentBase: paths.appBuild,
    //     publicPath: paths.appPublic,
    //     overlay: true,
    //     hot: true,
    //     host: process.env.HOST,
    //     port: process.env.PORT
    // },
    output: {
        filename: isEnvProduction
            ? '[name].[contenthash:8].js'
            : isEnvDevelopment && '[name].bundle.js',
        chunkFilename: isEnvProduction
            ? '[name].[contenthash:8].chunk.js'
            : isEnvDevelopment && '[name].chunk.js',
        // The build folder.
        path: paths.appBuild,
        publicPath: isEnvProduction ? '/report/' : '/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [paths.appSrc, 'node_modules'],
    },
    optimization: {
        minimize: isEnvProduction,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ],
                        // cacheDirectory: true,
                        // cacheCompression: false,
                        compact: isEnvProduction,
                    }
                },
                // include: paths.appSrc,
                exclude: /node_modules/
            },
            {
                test: /\.(scss)$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            // url: false,
                            // importLoaders: 3,
                            sourceMap: isEnvDevelopment,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent,
                                exportLocalsConvention: 'camelCase'
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('postcss-preset-env')({
                                        autoprefixer: {},
                                        stage: 3,
                                    }),
                                    postcssNormalize(),
                                ],
                                sourceMap: isEnvDevelopment,
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isEnvDevelopment
                        }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: sassResources
                        }
                    }
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name]-[hash:4].[ext]',
                        }
                    }
                ]
            },
            // {
            //     test: /.(ttf|otf|eot|woff(2)?)(\?[#a-z0-9]+)?$/,
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: 'fonts/[name]-[hash:4].[ext]',
            //         },
            //     },
            // },
        ],
    },
    plugins
};
