/**
 * External dependencies.
 */
const path = require('path');

module.exports = {
  entry: './src/index.js',  // Entry point for Webpack
  output: {
    filename: 'bundle.js',   // Output bundle file
    path: path.resolve(__dirname, 'dist'),  // Output directory
    publicPath: '/',  // Base path for all assets
  },
  mode: 'development',  // Set mode to development
  devtool: 'source-map', // Enable source maps for easier debugging
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),  // Serve from 'dist' folder
    },
    compress: true,  // Enable gzip compression
    port: 8080,  // The port on which the server will run
    open: true,  // Open browser after server starts
    hot: true,   // Enable hot module replacement (HMR)
  },
  module: {
    rules: [
      {
        test: /\.js$/,    // Apply this rule to .js files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Optionally use Babel to transpile modern JS
        },
      },
    ],
  },
};