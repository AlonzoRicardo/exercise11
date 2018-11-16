const getMessages = require("../clients/getMessages");


module.exports = function(req, res) {
  const span = tracer.startSpan("http_request");
  span.log({ event: "request_end" });
  getMessages().then(messages => {
    span.finish();
    res.json(messages);
  });
};
