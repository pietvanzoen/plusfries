const fs = require("fs");
const log = require("./logger")("embed");

const cache = {};
log.debug("Precaching plusfries.js script");
const script = fs.readFileSync("./public/plusfries.js").toString();

module.exports = {
  getEmbedScript(host) {
    if (cache[host]) {
      log.debug("Using script cache for " + host);
      return cache[host];
    }
    log.debug("Building script for " + host);
    cache[host] = script.replace("%PLUSFRIES_HOST%", host);
    return cache[host];
  }
};
