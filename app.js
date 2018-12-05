const db = require("./lib/db");
const Plus = require("./lib/plus-model");

const server = require("./lib/server")();
const logger = require("./lib/logger");

require("./lib/routes")(server);

db.authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.");
    Plus.sync();
    server.listen(8080, function() {
      logger.info("%s listening at %s", server.name, server.url); // eslint-disable-line
    });
  })
  .catch(err => {
    logger.error("Unable to connect to the database:", err);
    process.exit(1);
  });
