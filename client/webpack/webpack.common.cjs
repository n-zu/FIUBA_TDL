const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

module.exports = {
  entry: {
    index: ["./src/index.ts"],
  },
  output: {
    path: path.resolve(__dirname, "../docs"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    sourceMapFilename: "[name].js.map",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new ResolveTypeScriptPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$|\.jsx?$/,
        include: path.join(__dirname, "../src"),
        loader: "ts-loader",
      },
      {
        test: /\.tsx?$|\.jsx?$/,
        include: path.join(__dirname, "../../common"),
        loader: "ts-loader",
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          filename: "[name].bundle.js",
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      gameName: "Boxstov",
      template: "src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
  ],
};
