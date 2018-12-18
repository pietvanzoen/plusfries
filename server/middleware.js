const url = require("url");
const log = require("./logger")("middleware");
const errs = require("restify-errors");

function assertOriginMatchesLocation(req, res, next) {
  const origin = url.parse(req.header("origin") || "");
  const location = url.parse(req.body.location);
  if (origin.host !== location.host) {
    log.debug(
      `Origin '${origin.host}' did not match host for URL '${location.href}'`
    );
    return next(
      new errs.ForbiddenError("Cross origin upvoting is not allowed.")
    );
  }
  next();
}

function decodeLocation(req, res, next) {
  req.body.location = decodeURIComponent(req.body.location);
  next();
}

module.exports = {
  assertOriginMatchesLocation,
  decodeLocation
};
