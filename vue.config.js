const fs = require('fs');

module.exports = {
  devServer: {
    port: 8080,
    https: true,
    host: '0.0.0.0',
    key: fs.readFileSync('./certs/localhost-key.pem'),
    cert: fs.readFileSync('./certs/localhost.pem'),
    hotOnly: false,
    public: 'https://localhost:8080/'
  },
  transpileDependencies: [
    'vuetify'
  ]
}
