let client = require('prom-client');
//let gauge = new client.Gauge({name: 'Request_ratio', help: 'metric_help'});
let b = new client.Histogram('metric_name', 'metric_help', {
    buckets: [ 0.10, 5, 15, 50, 100, 500 ]
});

module.exports = () => {
    b()
    gauge.inc(1, new Date())
}