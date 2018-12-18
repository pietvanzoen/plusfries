const { version, name } = require("../package.json");
const restify = require("restify");
const Plus = require("./plus-model");
const { hash } = require("./util");
const { getEmbedScript } = require("./embed");
const {
  catchAsyncErrors,
  decodeLocation,
  assertOriginMatchesLocation
} = require("./middleware");
const log = require("./logger")("routes");

const THROTTLE_MODE = process.env.THROTTLE_MODE || "ip";
const THROTTLE_RATE = Number(process.env.THROTTLE_RATE) || 0.5;
log.debug(`THROTTLE_MODE=${THROTTLE_MODE}`);
log.debug(`THROTTLE_RATE=${THROTTLE_RATE}`);

function createRoutes(server) {
  server.get("/", (req, res, next) => {
    res.send({ version, name });
    return next();
  });

  server.get(
    "/plus/:location",
    decodeLocation,
    catchAsyncErrors(async function(req, res, next) {
      const { location } = req.params;
      log.debug(`Fetching count for ${location}`);
      const { count, rows } = await Plus.findAndCountAll({
        where: { location: hash(location) }
      });
      res.send({
        count,
        latest: rows[rows.length - 1]
      });
      next();
    })
  );

  server.post(
    "/plus",
    restify.plugins.throttle({
      burst: 1,
      rate: THROTTLE_RATE,
      [THROTTLE_MODE]: true
    }),
    decodeLocation,
    assertOriginMatchesLocation,
    catchAsyncErrors(async function(req, res, next) {
      log.debug(`Creating upvote for ${req.body.location}`);
      res.send(201, await Plus.create({ location: req.body.location }));
      next();
    })
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
    next();
  });
}

module.exports = createRoutes;
