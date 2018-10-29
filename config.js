module.exports = {
    app: {
        port: 3333,
        env: 'dev',
        hostname: 'http://localhost:3333',
        uploadDir: __dirname + '/public/uploads',
        emailTplDir: __dirname + '/emailTpl/'
    }
}