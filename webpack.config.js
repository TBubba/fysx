const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, './dist'),
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
};
