const wilson = require("winston");
const { timestamp, label, prettyPrint, combine, colorize } = wilson.format;
const dbLogger = wilson.createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(
    label({ label: "MessagesDB" }),
    timestamp(),
    colorize(),
    prettyPrint()
  ),
  transports: [
    new wilson.transports.Console({format: wilson.format.simple()})
  ]
});

 if (process.env.NODE_ENV === "prod") {
  dbLogger.add(
    new wilson.transports.Console()
  );
} 

module.exports = dbLogger;
