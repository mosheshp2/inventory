const os = require('os'),
      request = require('request'),
      pretty = require('pretty-byte');

console.log(process.argv);

const machine_id = process.argv.length > 2 && process.argv[2] || 3;
// take config from execution command

const serverUrl = process.argv.length > 3 && process.argv[3] || 'http://localhost:3000/api/machine/';

const intervalTime = 5000;
var lastState = {    memStr: null, cpuStr: null};

const intervalPtr = setInterval(() => {

    console.log('agent runs');
    let memStr = `${pretty(os.freemem())} / ${pretty(os.totalmem())}`;
    let cpuStr = os.cpus().length + ' x ' + os.cpus()[0].model;
    if(lastState.cpuStr != cpuStr || lastState.memStr != memStr){
        console.log(lastState);
        lastState = { cpuStr: cpuStr, memStr: memStr };

        let url = serverUrl + machine_id;
        console.log(`posting to ${url}, ${memStr}`);
        request({
            method: 'POST',
            url: url
            body: {
                status: 2,
                hardware_cfg: cpuStr + ' ' + memStr,
                software_cfg: os.type()
            },
            json: true
        },
        function callback(err, httpResponse, body) {
            err && console.log(err);
            console.log(body || '(response has empty body)');

        });
    }
}, intervalTime);
request('http://localhost:3000/api/machines', function(err,res,data){
    err && console.log(err);
    console.log(data);
});

