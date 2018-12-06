const restify = require("restify");
const Plus = require("./plus-model");
const { hash } = require("./util");

function createRoutes(server) {
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
    restify.plugins.throttle({ burst: 10, rate: 1, ip: true }),
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

  server.get(
    "/plusfries.js",
    restify.plugins.serveStatic({
      directory: "./public/",
      file: "plusfries.js"
    })
  );

  server.get("/healthcheck", (req, res, next) => {
    res.send({ ok: true });
    return next();
  });
}

module.exports = createRoutes;
