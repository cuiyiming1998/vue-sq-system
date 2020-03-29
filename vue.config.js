module.exports = {
    devServer: {
        port: '8080',
        proxy: {
            '/api': {
            target: 'http://localhost:3000',
            ws: true,
            changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}