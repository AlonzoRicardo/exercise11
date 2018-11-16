var initTracer = require('jaeger-client').initTracer;
var PrometheusMetricsFactory = require('jaeger-client').PrometheusMetricsFactory;
var promClient = require('prom-client');
 
var config = {
  serviceName: 'message'
};
var namespace = config.serviceName;
var metrics = new PrometheusMetricsFactory(promClient, namespace);
var options = {
  metrics: metrics,
};
var tracer = initTracer(config, options);

module.exports = tracer