const Plus = require("./plus-model");
const { hash } = require("./util");

function createRoutes(server) {
  server.get("/v1/plus/:location", async function(req, res, next) {
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

  server.post("/v1/plus", function(req, res, next) {
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
  });
}

module.exports = createRoutes;