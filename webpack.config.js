const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src/index.ts"),

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")]
            }
        ]
    },

    resolve: {
        extensions: [".js", ".ts"]
    },

    output: {
        publicPath: "dist",
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },

    devtool: "eval-source-map",

    devServer: {
        host: "0.0.0.0",
        port: 5050, //port that we're using for local host (localhost:5050) 8080 (default) broke everything
        static: path.resolve(__dirname, "dist"), //tells webpack to serve from the dist folder
        hot: true,
        devMiddleware: {
            publicPath: "/",
        }
    },

    mode: "development",
}
