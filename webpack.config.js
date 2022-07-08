const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.(html|css)$/,
                use: 'raw-loader'
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto"
              }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new webpack.DefinePlugin({
          // global app config object
          config: JSON.stringify({
              URL: 'https://back-end-SIGREYD.azurewebsites.net/api'
          })
      })
    ],
    devServer: {
        historyApiFallback: true
    }
}
