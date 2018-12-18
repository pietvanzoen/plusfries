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
  if (req.body.location) {
    req.body.location = decodeURIComponent(req.body.location);
  }
  if (req.params.location) {
    req.params.location = decodeURIComponent(req.params.location);
  }
  next();
}

function catchAsyncErrors(callback) {
  return async function errorHandler(req, res, next) {
    try {
      await callback(req, res, next);
    } catch (e) {
      let err = e;
      if (!(err instanceof errs.HttpError)) {
        err = new errs.InternalServerError(
          err,
          "There was an error processing this request"
        );
      }
      next(err);
    }
  };
}

module.exports = {
  assertOriginMatchesLocation,
  decodeLocation,
  catchAsyncErrors
};
