const kue = require("kue");
let queue = require('../../../messagesIndex');
const logger = require('../../winston/winston')
module.exports = function(messageParams) {
  let job3 = queue
    .create("roll back", {
      jobWithAproval: messageParams
    })
    .ttl(6000)
    .save(function(err) {
      if (!err) logger.info(`saved in queue job: ${job3.id}, ${job3.type}`);
    });
};
