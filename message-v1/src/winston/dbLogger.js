const wilson = require("winston");
const { timestamp, label, prettyPrint, combine } = wilson.format;
const dbLogger = wilson.createLogger({
  level: "info",
  format: combine(
    label({ label: "MessagesDB" }),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new wilson.transports.Console()
    //new wilson.transports.File({ filename: 'error.log', level: 'error' }),
    //new wilson.transports.File({ filename: 'combined.log' })
  ]
});

/* if (process.env.NODE_ENV !== "dev") {
  dbLogger.add(
    new wilson.transports.Console({
      format: wilson.format.simple()
    })
  );
} */

module.exports = dbLogger;
