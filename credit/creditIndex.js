require('dotenv').config()
const http = require("http");
const express = require("express");
const kue = require("kue");
const logger = require('./src/winston/winston')
let queue = kue.createQueue(/* {
  redis: {
    host: "redis"
  }
} */);

module.exports = queue;

const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");

const updateCredit = require("./src/controllers/updateCredit");

const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const creditSchema = {
  type: "object",
  required: ["amount"],
  properties: {
    location: {
      type: "string"
    },
    amount: {
      type: "number"
    }
  }
};

app.post(
  "/credit",
  bodyParser.json(),
  validate({ body: creditSchema }),
  updateCredit
);

app.use(function(err, req, res, next) {
  logger.info(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

require("./src/queue/consumers/checkBalanceConsumer");
require("./src/queue/consumers/rollBackConsumer");
require("./src/queue/enqueuers/enqueueSendMessage");

app.listen(process.env.PORT, function() {
  logger.info(`Credit Container started on PORT ${process.env.PORT}`);
});
