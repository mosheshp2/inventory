	
	
const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  WebSocketServer = require('websocket').server;

app.use(bodyParser.json());



app.get('/', (req, res) => res.sendFile(__dirname + '/app/index.html'));

app.use(express.static(__dirname + '/app'));

var machinesList = [
    {machine_id: 0, type_id: 4, machine_name: 'Avi laptop', status: 2, hardware_cfg: '500GB SSD 16 GB DDR4 Intel i7 7600', software_cfg:'some sw'},
    {machine_id: 1, type_id: 2, machine_name: 'Burg laptop', status: 3, hardware_cfg: '200GB SSD 6 GB DDR3 Intel i3 7200', software_cfg:'some sw'},
    {machine_id: 2, type_id: 3, machine_name: 'Ave desktop', status: 1, hardware_cfg: '128GB SSD 8 GB DDR3 AMD Xeon 600', software_cfg:'some sw'},
    {machine_id: 3, type_id: 1, machine_name: 'John tablet', status: 0, hardware_cfg: '64GB SSD 2GB DDR3 ARM x64', software_cfg:'some sw'}
];



app.get('/api/machine', function(req, res){
	// todo: connect to mysql, query data...
	var page_num = req.params && req.params.page || 0;
	var page_size = req.params && req.params.size || 50;

	//query pages with pagination 
	res.send(machinesList);

});

app.post('/api/machine/:machine_id',function(req, res){
	// implement save mechanism
	var machineId = req.params.machine_id;
	if(!machineId ){
		res.status(500).send('error, please provide machine_id');
	}
	var machines = machinesList.filter(function(item){
		return item.machine_id == machineId;
	});

	if(machines && machines.length > 0){
		// update only existing fields...
		machines[0].status = req.body.status || machines[0].status;
		machines[0].hardware_cfg = req.body.hardware_cfg || machines[0].hardware_cfg;
		machines[0].software_cfg = req.body.software_cfg || machines[0].software_cfg;
		res.send( machines[0]);

		pingClients && pingClients();

	}
	else{
		res.status(500).send('machine not found');
	}
});

app.delete('/api/machine/:machine_id',function(req, res){
	// implement delete mechnizm
});

app.get('/api/type', function(req, res){
	// todo: connect to mysql, query data...
	res.send([
		{type_id: 1, type_name: 'MacOs' },
		{type_id: 2, type_name: 'Ubuntu' },
		{type_id: 3, type_name: 'Windows' 	},
		{type_id: 4, type_name: 'CentOs' }
	]);
});

app.get('/api/status', function(req, res){
	// todo: connect to mysql, query data...
	res.send([
		{id: 0, status_name: 'Order' },
		{id: 1, status_name: 'Ready' },
		{id: 2, status_name: 'In use' },
		{id: 3, status_name: 'Fault' }
	]);
});

const server = app.listen(3000, () => console.log('Inventory (web) app listening on port 3000!'));

wsServer = new WebSocketServer({
    httpServer: server
});

var connections = [];
var pingClients = function(){};

// WebSocket server
wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);


    //todo replace with event emtter.
    pingClients = function(){
        if(connections && connections.length > 0){
        	for(var i in connections) {
				let conn = connections[i];
                conn.send('refresh');
            }
        }
    };
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        console.log('message');

        if (message.type === 'utf8') {
            // process WebSocket message
        }
    });

    connection.on('close', function(connection) {
        console.log('close');

        // close user connection
    });

    connections.push(connection);
});