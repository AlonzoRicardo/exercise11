const queue = require("../../../creditIndex");
const logger = require('../../winston/winston')

module.exports = (job, enoughBalance) => {
  let isThereBalance = enoughBalance;
  let job2 = queue
    .create("save&send", {
      job: job.data.messObj,
      isThereBalance
    })
    .ttl(6000)
    .save(function(err) {
      logger.verbose(`queue entry number: ${job2.id}`);
    });
};