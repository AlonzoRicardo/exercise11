const Message = require("../models/message");
const saveMessageTransaction = require("../transactions/saveMessage");
const rollBack = require("../queue/enqueuers/enqueueRollBack");
const logger = require('../winston/winston')

module.exports = function(messageParams, cb) {
  const MessageModel = Message();
  let message = new MessageModel(messageParams);
  if (message.status == "OK") {
    saveMessageTransaction(messageParams, cb);
  } else if (message.status == "ERROR") {
    logger.info('Enters rollback procedure!');
    rollBack(messageParams);
    cb();
  }
};
