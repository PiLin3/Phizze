const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    "main": "./src/scripts/main.js",
    "searchResults": "./src/scripts/searchResults.js",
    "simulations/kinematics/index": "./src/simulations/kinematics/index.js",
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
      {
        test: /\.(glb|gltf)$/,
        use: [{
          loader: 'file-loader',
          options:
          {
            outputPath: 'simulations/assets/',
          },
        }],
    },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      title: "Search Results",
      filename: "pages/searchResults.html",
      template: "./src/pages/searchResults.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "searchResults"],
    }),
    new HtmlWebpackPlugin({
      title: "Kinematics-Velocity/acceleration/displacement Simulator",
      filename: "simulations/kinematics/index.html",
      template: "./src/simulations/kinematics/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "simulations/kinematics/index"],
    }),
  ],
}