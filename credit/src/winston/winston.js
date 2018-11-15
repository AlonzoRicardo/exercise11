const wilson = require("winston");
const { timestamp, label, prettyPrint, combine, colorize } = wilson.format;
const logger = wilson.createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(
    label({ label: "CreditService" }),
    timestamp(),
    colorize(),
    prettyPrint()
  ),
  transports: [new wilson.transports.Console({format: wilson.format.simple()})]
});

if (process.env.NODE_ENV === "prod") {
  logger.add(
    new wilson.transports.Console({
      format: wilson.format.simple()
    })
  );
}

module.exports = logger;
