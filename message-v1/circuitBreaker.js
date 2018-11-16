const Brakes = require("brakes");
const logger = require("./src/winston/winston");
const countError = require("./prom/Metrics");

const options = {
  timeout: 1000,
  threshold: 1,
  waitThreshold: 2,
  circuitDuration: 20000,
  statInterval: 60000
};

const brake = new Brakes(options);

brake.on("failure", snapshot => {
  countError();
  logger.error(snapshot);
});

brake.on("circuitClosed", () => {
  logger.debug("CIRCUIT IS CLOSED");
});
brake.on("circuitOpened", () => {
  logger.debug("CIRCUIT IS OPEN");
});

brake.on("snapshot", snapshot => {
  logger.info(snapshot);
});

module.exports = brake;
