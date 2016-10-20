import path from 'path'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import merge from 'webpack-merge'

import development from './dev.config'
import production from './prod.config'

import 'babel-polyfill'

const TARGET = process.env.npm_lifecycle_event

const PATHS = {
    app: path.join(__dirname, '../../frontend'),
    build: path.join(__dirname, '../../public')
}

process.env.BABEL_ENV = TARGET

const common = {
    entry: [
        PATHS.app
    ],

    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['', '.jsx', '.js', '.json', '.scss'],
        modulesDirectories: ['node_modules', PATHS.app]
    },

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loaders: ['eslint'],
                include: [
                    path.resolve(__dirname, '../../frontend')
                ]
            }
        ],

        loaders: [{
            test: /bootstrap-sass\/assets\/javascripts\//,
            loader: 'imports?jQuery=jquery',
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff',
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff2',
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/octet-stream',
        }, {
            test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-otf',
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file',
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=image/svg+xml',
        }, {
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
        }, {
            test: /\.png$/,
            loader: 'file?name=[name].[ext]',
        }, {
            test: /\.jpg$/,
            loader: 'file?name=[name].[ext]',
        }],

        postcss: (webpack) => {
            return [
                autoprefixer({
                    browsers: ['last 2 versions']
                }),
                postcssImport({
                    addDependencyTo: webpack
                })
            ]
        }
    }
}

const NODE_ENV = process.env.NODE_ENV

let config
if(NODE_ENV === 'development' || !NODE_ENV) {
    config = merge(development, common)
} else {
    config = merge(production, common)
}

export default config