const path = require("path")
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./dist/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  plugins: [
    new CopyPlugin({
        patterns: [
            { 
                from: path.resolve("src", 'index.html'), 
                to: path.resolve("dist", 'index.html') 
            },
        ],
    }),
],
};
