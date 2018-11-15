const Brakes = require("brakes");
const logger = require('./src/winston/winston')
const options = {
  timeout: 1000,
  threshold: 1,
  waitThreshold: 2,
  circuitDuration: 20000,
  statInterval: 60000
};

const brake = new Brakes(options);

brake.on("failure", snapshot => {
  logger.log({
    level: "error",
    message: snapshot
  });
});

brake.on("circuitClosed", () => {
  logger.log({
    level: "debug",
    message: 'CIRCUIT IS CLOSED'
  });
});
brake.on("circuitOpened", () => {
  logger.log({
    level: "debug",
    message: 'CIRCUIT IS OPEN'
  });
});

brake.on("snapshot", snapshot => {
  logger.log({
    level: "info",
    message: snapshot
  });
});

module.exports = brake

