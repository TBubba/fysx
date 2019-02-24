const path = require('path');

/**
 * Notes:
 * "__dirname" is the folder of this config file, not necessarily the current working directory
 */

module.exports = {
  entry: path.resolve(__dirname, 'index.ts'),
  output: {
    filename: 'bundle.js',
    path: __dirname,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
      },
    ]
  },
  devServer: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
    ],
    contentBase: __dirname,
    open: true,
  }
};

