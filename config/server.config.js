const path = require('path')

module.exports = {
  // used by webpack-dev-server to proxy requests
  WEBPACK_PROXY: 'http://localhost:3333/',
  // used by koa static server
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  BUILD_DIR: path.resolve(__dirname, '../build'),
  // used by koa api server
  API_PORT: process.env.API_PORT || 3333
}
