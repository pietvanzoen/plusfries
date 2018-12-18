const fs = require("fs");
const log = require("./logger")("embed");
const url = require("url");

const cache = {};
log.debug("Precaching plusfries.js script");
const script = fs.readFileSync("./public/plusfries.js").toString();

module.exports = {
  getEmbedScriptForUrl(apiUrl) {
    if (cache[apiUrl]) {
      log.debug("Using script cache for " + apiUrl);
      return cache[apiUrl];
    }
    log.debug("Building script for " + apiUrl);
    cache[apiUrl] = script.replace("%PLUSFRIES_URL%", apiUrl);
    return cache[apiUrl];
  },

  getUrlFromRequest(req) {
    const protocol = req.header("X-Forwarded-Proto") || "http";
    const host = req.header("Host");
    return url.format({ protocol, host });
  }
};
