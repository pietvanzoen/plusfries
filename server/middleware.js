const url = require("url");
const log = require("./logger")("middleware");
const errs = require("restify-errors");
const { isURL } = require('validator');
const { BadRequestError } = require('restify-errors');
const assert = require('assert-plus');
const get = require('lodash/get');

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

const sourceOptions = ['body', 'params'];
function validateURL(source, prop) {
  assert.string(source, 'source');
  assert.string(prop, 'prop');
  if (!sourceOptions.includes(source)) {
    throw new TypeError(`source must be one of ${sourceOptions.join(', ')}`);
  }
  return (req, res, next) => {
    const value = get(req, `${source}.${prop}`);
    if (!value) {
      return next(new BadRequestError(`${prop} is required`));
    }
    if (!isURL(value)) {
      return next(new BadRequestError(`'${value}' is not a valid URL`));
    }
    next();
  }
}

function decodeLocation(req, res, next) {
  if (req.body && req.body.location) {
    req.body.location = decodeURIComponent(req.body.location);
  }
  if (req.params && req.params.location) {
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
  catchAsyncErrors,
  validateURL
};
