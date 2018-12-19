require("dotenv-safe").config();

const db = require("./server/db");
const Location = require("./server/location-model");
const { PORT, LOG_LEVEL } = process.env;

const server = require("./server/server")();
const logger = require("./server/logger")("app");
logger.setLevel(LOG_LEVEL);
logger[LOG_LEVEL.toLowerCase()](`LOG_LEVEL=${LOG_LEVEL}`);

require("./server/routes")(server);

db.authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.");
    return Location.sync();
  })
  .then(() => {
    server.listen(PORT, function() {
      logger.info("%s listening at %s", server.name, server.url); // eslint-disable-line
    });
  })
  .catch(err => {
    logger.error("Unable to connect to the database:", err);
    process.exit(1);
  });
