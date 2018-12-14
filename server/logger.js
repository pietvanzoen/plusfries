const log = require("loglevel");
require("colors");

const LEVEL_STRING = {
  trace: "TRACE".white,
  debug: "DEBUG".cyan,
  info: "INFO ".blue,
  warn: "WARN ".yellow,
  error: "ERROR".red
};

log.setLevel(process.env.LOG_LEVEL);

module.exports = function createLogger(name) {
  const logger = log.getLogger(name);
  const originalFactory = logger.methodFactory;
  logger.methodFactory = (methodName, logLevel, loggerName) => {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    return function(message, ...rest) {
      rawMethod(
        `${LEVEL_STRING[methodName]} [${loggerName.white}] ${message}`,
        ...rest
      );
    };
  };
  logger.setLevel(logger.getLevel());
  return logger;
};
