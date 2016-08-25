const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';

const dist = 'dist/';
const distServePath = dist + pkg.name + '-' + pkg.version + '/';

const output = {
  path: path.join(__dirname, '/' + distServePath + '/src/'),
  publicPath: pkg.version + '/src/',
  filename: '[name].js'
};

const baseConfig = {
  entry: {
    app: ['babel-polyfill', './src/app.js']
  },

  output,

  resolve: {
    alias: {
      bootstrap: 'bootstrap/js',
      'backbone-modelbinder': 'backbone.modelbinder',
      backboneLocalstorage: 'backbone.localstorage/backbone.localStorage'
    },
    modulesDirectories: ['node_modules'],
    root: [
      path.resolve('./src')
    ],
    extensions: ['', '.js']
  },

  externals: ['express'],

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    new webpack.NoErrorsPlugin(),

    new webpack.optimize.DedupePlugin(),

    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]), // saves ~100k from build

    new ProgressBarPlugin()
  ],

  node: {
    fs: 'empty',
    net: 'empty'
  }
};

const developmentConfig = Object.assign({}, baseConfig, {
  debug: true,
  devtool: 'cheap-module-source-map',
  cache: true
});

const productionConfig = Object.assign({}, baseConfig, {
  debug: false,
  plugins: [
    ...baseConfig.plugins,

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unused: true
      },
      sourceMap: false,
      minimize: true,
      mangle: true
    })
  ]
});

module.exports = nodeEnv === 'production' ? productionConfig : developmentConfig;
