const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    // app: path.resolve(__dirname, 'src/browser/app/app.'),
    start: path.resolve(__dirname, 'src/browser/start/main.tsx'),
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  node: false,
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/browser/start/index.html'),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist/browser/start'),
    compress: true,
    port: 1235,
  },
};
