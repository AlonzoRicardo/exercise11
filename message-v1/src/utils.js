const debug = require("debug")("util");
const os = require("os");
const hostname = os.hostname();
const logger = require('./winston/winston')

function cleanClone(document) {
  const copy = Object.assign({}, document._doc);
  delete copy._id;
  delete copy.__v;
  return copy;
}

function getHostName(req, res) {
  logger.info("Health Check 200");
  res.send(hostname);
}

function getApiVersion(req, res) {
  res.send(`service-v1 / ${hostname}`);
}

module.exports = {
  cleanClone,
  getHostName,
  getApiVersion
};
