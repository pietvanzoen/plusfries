const pkg = require("./package.json");
const restify = require("restify");
const DB = require("./lib/db");

const server = restify.createServer({
  name: pkg.name,
  version: pkg.version
});

const db = new DB();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get("/v1/plus/:url", function(req, res, next) {
  res.send(db.findAll());
  return next();
});

server.listen(8080, function() {
  console.log("%s listening at %s", server.name, server.url); // eslint-disable-line
});
