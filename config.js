module.exports = {
    app: {
        port: 8083,
        env: 'dev',
        hostname: 'http://localhost:8083',
        uploadDir: __dirname + '/public/uploads',
        emailTplDir: __dirname + '/emailTpl/'
    }
}