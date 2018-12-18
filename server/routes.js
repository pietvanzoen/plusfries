const { version, name } = require("../package.json");
const restify = require("restify");
const Plus = require("./plus-model");
const { hash } = require("./util");
const { getEmbedScript } = require("./embed");
const { decodeLocation, assertOriginMatchesLocation } = require("./middleware");

const THROTTLE_MODE = process.env.THROTTLE_MODE || "ip";
const THROTTLE_RATE = Number(process.env.THROTTLE_RATE) || 0.5;
log.debug(`THROTTLE_MODE=${THROTTLE_MODE}`);
log.debug(`THROTTLE_RATE=${THROTTLE_RATE}`);

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
    restify.plugins.throttle({
      burst: 1,
      rate: THROTTLE_RATE,
      [THROTTLE_MODE]: true
    }),
    decodeLocation,
    assertOriginMatchesLocation,
    function(req, res, next) {
      return Plus.create({
        location: req.body.location
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
