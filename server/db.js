const Sequelize = require("sequelize");

const logger = require("./logger")("sequelize");

const storage = process.env.DB_STORAGE;
logger.info(`DB_STORAGE=${storage}`);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: msg => logger.debug(msg)
});
module.exports = sequelize;
