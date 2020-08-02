module.exports = {
  mode: 'development',
  optimization: {
    minimize: false
  },
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'MyReact.createElement' }]
            ]
          }
        }
      }
    ]
  }
}