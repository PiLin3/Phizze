const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    "scripts/main": "./src/scripts/index.js",
    "pages/search-results/searchResults": "./src/pages/search-results/searchResults.js",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(svg|png|jpeg|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: "imgs/[name]-[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: 'body',
      chunks: ["scripts/main"],
    }),
    new HtmlWebpackPlugin({
      title: "Search Results",
      filename: "pages/search-results/searchResults.html",
      template: "./src/pages/search-results/searchResults.html",
      inject: 'body',
      chunks: ["scripts/main", "pages/search-results/searchResults"],
    }),
  ],
}