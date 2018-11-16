require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./src/winston/winston");
const { countError } = require("./prom/Metrics");


const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");

const kue = require("kue");
let queue = kue.createQueue({
  redis: {
    host: "redis"
  }
});
module.exports = queue;

const getMessages = require("./src/controllers/getMessages");
const getMessageStatusById = require("./src/controllers/getMessageStatusById");
const { getHostName, getApiVersion } = require("./src/utils");
const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

require("./src/queue/consumers/sendConsumer");
require("./src/queue/enqueuers/enqueueRollBack");
const enqueue = require("./src/queue/enqueuers/enqueueCheckBalance");

  app.use(function(req, res, next) {
    countError();
    next();
  })


//End Points
app.post(
  "/messages",
  bodyParser.json(),
  validate({ body: messageSchema }),
  enqueue
);

app.get("/messages/:id/status", getMessageStatusById);

app.get("/messages", getMessages);

app.get("/hostname", getHostName);

app.get("/version", getApiVersion);

const Prometheus = require("prom-client");

Prometheus.collectDefaultMetrics();

function sendMetrics(req, res) {
  res.set("Content-Type", Prometheus.register.contentType);
  res.end(Prometheus.register.metrics());
}

app.get("/metrics", sendMetrics);

app.use(function(err, req, res, next) {
  logger.info(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, function() {
  logger.info("Message App started on PORT 9007");
});
