require("dotenv-safe").config();

const db = require("./server/db");
const Plus = require("./server/plus-model");
const { PORT } = process.env;

const server = require("./server/server")();
const logger = require("./server/logger")("app");
logger.setLevel("TRACE");

require("./server/routes")(server);

db.authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.");
    return Plus.sync();
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
