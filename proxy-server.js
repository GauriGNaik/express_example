var http      = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis')
var express = require('express')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var sioc = require('socket.io-client');
var socket = sioc('http://107.170.150.125:3000');
var status = 'false';
console.log('Proxy server listening at Port 3010')
client.lpush("availableServers",'http://107.170.150.125:30220')
client.lpush("availableServers",'http://107.170.69.162:3000')

var options = {};
var proxy   = httpProxy.createProxyServer(options);
socket.on("badheartbeat", function(client) {
    status = client.status;
   console.log("Status is "+status);
 
if(status==='true') {

        console.log("Canary Server Failed.");
    }
});

socket.on("goodheartbeat", function(client) {
    status = client.status;
  // console.log("Status is "+status);
console.log("Status is "+status);
 
 if(status==='true') {

        console.log("Canary Server Failed.");
    }
  });
var server  = http.createServer(function(req, res)
{
    client.rpoplpush('availableServers','availableServers',function(err,value) {
        if (err) throw err;
        if(status==='true') {
        var x='http://107.170.69.162:3000'
        proxy.web( req, res, {target: x } );
console.log("Redirecting to dev server:");
          }
else {

        proxy.web( req, res, {target: value } );
        console.log("Redirecting to :"+value);
}
    })
});
server.listen(3010);
