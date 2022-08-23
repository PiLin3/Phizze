const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    "main": "./src/scripts/main.js",
    "searchResults": "./src/scripts/searchResults.js",
    "simulations/kinematics/index": "./src/simulations/kinematics/index.js",
    "simulations/pressure/index": "./src/simulations/pressure/index.js",
    "simulations/resistance/index": "./src/simulations/resistance/index.js",
    "simulations/voltage/index": "./src/simulations/voltage/index.js",
    "resources/density/index": "./src/resources/density/index.js",
    "resources/resistivity/index": "./src/resources/resistivity/index.js",
    "visualizations/atoms/index": "./src/visualizations/atoms/index.js",
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
      filename: "pages/searchResults.html",
      template: "./src/pages/searchResults.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "searchResults"],
    }),
    new HtmlWebpackPlugin({
      filename: "simulations/kinematics/index.html",
      template: "./src/simulations/kinematics/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "simulations/kinematics/index"],
    }),
    new HtmlWebpackPlugin({
      filename: "simulations/pressure/index.html",
      template: "./src/simulations/pressure/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "simulations/pressure/index"],
    }),
    new HtmlWebpackPlugin({
      filename: "simulations/resistance/index.html",
      template: "./src/simulations/resistance/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "simulations/resistance/index"],
    }),
    new HtmlWebpackPlugin({
      filename: "simulations/voltage/index.html",
      template: "./src/simulations/voltage/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "simulations/voltage/index"],
    }),
    new HtmlWebpackPlugin({
      filename: "resources/density/index.html",
      template: "./src/resources/density/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "resources/density/index"],
    }),
    new HtmlWebpackPlugin({
      filename: "resources/resistivity/index.html",
      template: "./src/resources/resistivity/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "resources/resistivity/index"],
    }),
    new HtmlWebpackPlugin({
      filename: "visualizations/atoms/index.html",
      template: "./src/visualizations/atoms/index.html",
      inject: 'body',
      scriptLoading: 'blocking',
      chunks: ["main", "visualizations/atoms/index"],
    }),
  ],
}