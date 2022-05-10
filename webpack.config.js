const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config={
  entry: {
     index: './src/index.js'

},
devtool:'source-map',
output: {
    path: path.resolve(__dirname, 'dist'),
},
devServer: {
    open: true,
    host: 'localhost',
},
plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        templateContent: ()=>{
            return new Promise ((resolve)=>resolve(
        `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
                <title>Webpack App</title>
            </head>
            <body>
               
            </body>
            
        </html>
        `,)
            )
        },
        chunks:['index'],
        inject: 'body',
        minify: false,
    }),
   
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
],
module: {
    rules: [
              {
            test: /\.css$/i,
            use: ['style-loader','css-loader','sass-loader'],
        },
        {
            test: /\.s[ac]ss$/i,
            use: [ 'css-loader', 'sass-loader','style-loader'],
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
            type: 'asset',
        },

        // Add your rules for custom modules here
        // Learn more about loaders from https://webpack.js.org/loaders/
    ],
},
resolve: {
    extensions: ['.tsx', '.ts', '.js'],
},
}




module.exports = ()=>{
  if (isProduction) {
    config.mode = 'production';
    
    config.plugins.push(new MiniCssExtractPlugin());
    
    
} else {
    config.mode = 'development';
}
return config;
};