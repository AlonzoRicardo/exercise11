const database = require("../database");
const Message = require("../models/message");
const { cleanClone } = require("../utils");
const logger = require("../winston/winston");

function saveMessageReplica(replica, retries) {
  if (retries > 0) {
    replica.markModified("body");
    return replica
      .save()
      .then(doc => {
        logger.log({
          level: info,
          message: `Message replicated successfully, ${doc}`
        });
        return doc;
      })
      .catch(err => {

        logger.warn("Error while saving message replica", err);
        logger.warn("Retrying...");
        return saveMessageReplica(replica, retries - 1);
      });
  }
}

function saveMessageTransaction(newValue) {
  const MessagePrimary = Message();
  const MessageReplica = Message("replica");

  let message = new MessagePrimary(newValue);

  return message
    .save()
    .then(doc => {
      logger.log({level: info, message: `Message saved successfully: ${doc}`});
      return cleanClone(doc);
    })
    .then(clone => {
      let replica = new MessageReplica(clone);
      saveMessageReplica(replica, 3);
      return clone;
    })
    .catch(err => {
      logger.error(`Error while saving message: ${err}`);
      throw err;
    });
}

module.exports = function(messageParams, cb) {
  saveMessageTransaction(messageParams)
    .then(() => cb())
    .catch(err => {
      cb(undefined, err);
    });
};
