const pkg = require("../package.json");
const restify = require("restify");
const Logger = require("bunyan");

function createServer() {
  const server = restify.createServer({
    name: pkg.name,
    version: pkg.version,
    handleUncaughtExceptions: true,
    log: new Logger.createLogger({
      name: "restify",
      serializers: {
        req: Logger.stdSerializers.req
      }
    })
  });
  server.pre(function(request, response, next) {
    request.log.info({ req: request }, "REQUEST");
    next();
  });
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());
  return server;
}

module.exports = createServer;
