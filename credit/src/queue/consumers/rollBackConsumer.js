let queue = require('../../../creditIndex')
const updateCreditTransaction = require("../../transactions/updateCredit");
const Message = require("../../models/message");
const logger = require('../../winston/winston')

function rollBackCredit(job, done) {
  const MessageModel = Message();
  let message = new MessageModel(job.data.jobWithAproval);

  return updateCreditTransaction(
    {
      amount: { $gte: 1 },
      location: message.location.name
    },
    {
      $inc: { amount: +message.location.cost }
    },
    function(doc, error) {
      if (error) {
        done(error)
        return error;
      } else {
        done()
        logger.info("ROLLBACK SUCCESFUL!");
      }
    }
  );
}

queue.process("roll back", function(job, done) {
  rollBackCredit(job, done);
});
