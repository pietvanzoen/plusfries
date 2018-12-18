const pkg = require("../package.json");
const restify = require("restify");
const logger = require("./logger")("api");
const morgan = require("morgan");
const corsMiddleware = require("restify-cors-middleware");

const stream = require("stream");
const loggerStream = new stream.Writable({
  write: (chunk, encoding, next) => {
    const str = chunk.toString().trim();
    const status = Number(str.match(/ \d\d\d /)[0]);
    if (status > 499) {
      logger.error(str);
    } else {
      logger.info(str);
    }
    next();
  }
});

function createServer() {
  const server = restify.createServer({
    name: pkg.name,
    version: pkg.version,
    ignoreTrailingSlash: true,
    handleUncaughtExceptions: true
  });
  const cors = corsMiddleware({ origins: ["*"] });
  server.pre(cors.preflight);
  server.use(cors.actual);
  const morganLogger = morgan("short", { stream: loggerStream });
  server.use(morganLogger);
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());

  server.on("after", function(req, res, route, error) {
    if (!error.statusCode || error.statusCode > 499) {
      logger.error(`${error}`, error);
    } else {
      logger.debug(`${error}`);
    }
    morganLogger(req, res, function next() {});
  });

  return server;
}

module.exports = createServer;
