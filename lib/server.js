const pkg = require("../package.json");
const restify = require("restify");
const logger = require("./logger")("restify");
const morgan = require("morgan");

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

morgan.token("remote-addr", req => {
  return req.headers["x-forwarded-for"] || req.ip;
});

function createServer() {
  const server = restify.createServer({
    name: pkg.name,
    version: pkg.version,
    ignoreTrailingSlash: true,
    handleUncaughtExceptions: true
  });
  server.use(morgan("short", { stream: loggerStream }));
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());
  return server;
}

module.exports = createServer;
