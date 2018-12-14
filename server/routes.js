const { version, name } = require("../package.json");
const restify = require("restify");
const Plus = require("./plus-model");
const { hash } = require("./util");
const { getEmbedScript } = require("./embed");

function createRoutes(server) {
  server.get("/", (req, res, next) => {
    res.send({ version, name });
    return next();
  });

  server.get("/plus/:location", async function(req, res, next) {
    const { count, rows } = await Plus.findAndCountAll({
      where: {
        location: hash(decodeURIComponent(req.params.location))
      }
    });
    res.send({
      count,
      latest: rows[rows.length - 1]
    });
    return next();
  });

  server.post(
    "/plus",
    restify.plugins.throttle({ burst: 10, rate: 1, xff: true }),
    function(req, res, next) {
      return Plus.create({
        location: decodeURIComponent(req.body.location)
      })
        .then(resp => {
          res.send(resp);
          next();
        })
        .catch(err => {
          res.send(err);
          next();
        });
    }
  );

  server.get("/plusfries.js", restify.plugins.gzipResponse(), function(
    req,
    res,
    next
  ) {
    const script = getEmbedScript(req.header("host"));
    res.set("Content-Length", script.length);
    res.set("Content-Type", "application/javascript");
    res.cache({ maxAge: 3600 });
    res.sendRaw(script);
    next();
  });

  server.get("/healthcheck", (req, res, next) => {
    res.send({ ok: true });
    return next();
  });
}

module.exports = createRoutes;
