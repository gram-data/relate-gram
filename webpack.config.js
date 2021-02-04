const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const mode = slsw.lib.webpack.isLocal ? "development" : "production"

module.exports = {
  entry: slsw.lib.entries,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
              configFile: "tsconfig.webpack.json"
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    plugins: [new TsconfigPathsPlugin({/* options: see below */})],
  },
  target: 'node',
  mode,
  externals: [
      nodeExternals(),
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
