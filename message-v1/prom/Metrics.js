var client = require('prom-client');
//Error Ratio
var error_Gauge = new client.Gauge({name: 'Error_Gauge', help: 'Error_Gauge'});
let count = 0;
//var error_Gauge = new client.Gauge({name: 'Error_Gauge', help: 'Error_Gauge'});

setInterval(() => {
    error_Gauge.set(count, new Date()); // Set to 10
    count = 0;
}, 2000);

function countError () {
    count++
    //error_Gauge.inc(1, /* moment().format('YYYY-MM-DD HH:mm') */)
}

module.exports = {
    countError
}
