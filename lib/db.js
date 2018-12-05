const Sequelize = require("sequelize");

const logger = require("bunyan").createLogger({
  name: "sequelize",
  level: "debug"
});

const storage = process.env.DB_STORAGE || "./plusfries.db";
logger.info(`DB_STORAGE=${storage}`);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: msg => logger.debug(msg)
});
module.exports = sequelize;
