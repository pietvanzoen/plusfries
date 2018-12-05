const bunyan = require("bunyan");

module.exports = new bunyan.createLogger({
  name: "app"
});
