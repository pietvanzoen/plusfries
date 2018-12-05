const logger = require("bunyan").createLogger({
  name: "sequelize",
  level: "debug"
});
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./plusfries.db",
  logging: msg => logger.debug(msg)
});
module.exports = sequelize;
