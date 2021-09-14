const rules = require('./webpack.rules');

module.exports = {
  entry: './src/background.ts',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.css', '.json'],
  },
};
