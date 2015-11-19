var sio = require('socket.io')
  , http = require('http')
  , request = require('request')
  , os = require('os')
  ;
var twilio = require('twilio');
var app = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end();
    })
  , io = sio.listen(app);
function sendAlert() {
      //Put own numbers and authorization tokens. Intentionally left blank
      var client = new twilio.RestClient('', '');
client.sms.messages.create({
    to:'',
    from:'',
    body:'Message alert: Express application has exceeded memory usage threshold'
}, function(error, message) {
    // The HTTP request to Twilio will run asynchronously. This callback
    // function will be called when a response is received from Twilio
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request. In this case, it is the
        // information about the text messsage you just sent:
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);

        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('Oops! There was an error.');
    }
});

}
function memoryLoad()
{
//      console.log( os.totalmem(), os.freemem() );
//      console.log(os.totalmem()-os.freemem());

        var usedMem=((os.totalmem()-os.freemem())/os.totalmem())*100;
        console.log("Total % of used memory", usedMem);
        if( usedMem > 77.03351189337415)
        {
         sendAlert();
        }



        return usedMem;
}

// Create function to get CPU information
function cpuTicksAcrossCores()
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++)
{
                //Select CPU core
                var cpu = cpus[i];
                //Total up the time in the cores tick
                for(type in cpu.times)
                {
                        totalTick += cpu.times[type];
                }
                //Total up the idle time of the core
                totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
 return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuTicksAcrossCores();

function cpuAverage()
{
        var endMeasure = cpuTicksAcrossCores();
 //     console.log("startMeasure "+startMeasure);
        //Calculate the difference in idle and total time between the measures
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;

        //Calculate the average percentage CPU usage
        var checking = ((totalDifference-idleDifference)/totalDifference);
        console.log("average % of cpu usage "+ checking);
        if(checking > 0.004975124378109453 )
        {
            sendAlert();

        }
        return checking*100;
}
/*
function measureLatenancy(server)
{
var options = 
        {
                url: 'http://localhost' + ":" + server.address().port,
        };
        request(options, function (error, res, body) 
        {
                server.latency = undefined;
        });

        return server.latency;
}
*/
var nodeServers = [];

///////////////
//// Broadcast heartbeat over websockets
//////////////
setInterval( function ()
{
        io.sockets.emit('heartbeat',
        {
        name: "Your Computer", cpu: cpuAverage(), memoryLoad: memoryLoad(),
        //nodes: calcuateColor()
   });

}, 2000);
app.listen(3010);

/// NODE SERVERS

createServer(9000, function()
{
        // FAST
});
createServer(9001, function()
{
        // MED
        for( var i =0 ; i < 300; i++ )
        {
                i/2;
        }
});
createServer(9002, function()
{
        // SLOW 
        for( var i =0 ; i < 2000000000; i++ )
        {
                Math.sin(i) * Math.cos(i);
        }
});
function createServer(port, fn)
{
        // Response to http requests.
        var server = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' });

      fn();

      res.end();
   }).listen(port);
        nodeServers.push( server );
server.latency = undefined;
}
