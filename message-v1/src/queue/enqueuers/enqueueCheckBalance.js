const kue = require("kue");
let queue = require("../../../messagesIndex");
const uuidv4 = require("uuid/v4");
const brake = require("../../../circuitBreaker");
const logger = require('../../winston/winston')
let isQueueBusy = false;

module.exports = function(req, res) {
  if (isQueueBusy === false) {
    let uniqueId = uuidv4();
    let messObj = req.body;
    messObj.uuid = uniqueId;
    let job = queue
      .create("check balance", {
        messObj
      })
      .ttl(6000)
      .save(function(err) {
        if (!err && !brake.isOpen()) {
          res.send(`MessageId: ${job.data.messObj.uuid}`);
        } else if (brake.isOpen()) {
          res.send(
            `The service is currently experiencing some issues, your request may be delayed! \n MessageId: ${
              job.data.messObj.uuid
            }`
          );
        }
      });
  } else {
    res.send(`The service is down, try again later.`);
  }
};

queue.on("job enqueue", function(id, type) {
  queue.inactiveCount(function(err, total) {
    if (total > 10) {
      logger.warn(`We need some back pressure here, from enqueue ${total}`);
      isQueueBusy = true;
    } else {
      logger.verbose(`Job ${id} got queued of type ${type}`, `${id, type}`);
    }
  });
});

queue.on("job complete", function(id, result) {
  queue.inactiveCount(function(err, total) {
    if (total <= 5) {
      logger.info(`Renabling service... ${total}`);
      isQueueBusy = false;
    } else {
      logger.warn(`We need some back pressure here... ${total}`);
    }
  });
});
