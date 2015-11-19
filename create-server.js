var needle = require('needle');
var os   = require("os");
var fs = require("fs");

var config = {};
config.token = "";

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};


var client =
{
   createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			
			"ssh_keys":[],
			
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	listKeys: function(onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/account/keys",{headers:headers}, onResponse);
	}, 
	listDropletIp: function (dropletID,onResponse)
    {    
    	var getRequest = "https://api.digitalocean.com/v2/droplets/"+dropletID;
        needle.get(getRequest,{headers:headers}, onResponse);
    }



};
client.listKeys(function(error, response) {
 
var data = response.body;
 
if(response.headers) {
    console.log("Calls remaining", response.headers["ratelimit-remaining"] );
}
 
if( data.ssh_keys)
    {
         
           console.log("SSH key Id is"+":"+data.ssh_keys[0].id);
            
         
    }
 
});

var name = "gnaik2"+os.hostname();
var region = "nyc1"; 
var image = "ubuntu-14-04-x64"; 
client.createDroplet(name, region, image, function(err, resp, body) {
 	
 	
 	if(!err && resp.statusCode == 202)
 	{
 		
 		console.log("The created droplet has id:"+ body.droplet.id);

 		var data = body.droplet.id;

        setTimeout(function(){client.listDropletIp(data, function(error, response) {

                 var data = response.body;
                 console.log("The ip address of the created droplet is: "+data.droplet.networks.v4[0].ip_address);
        	     var ip = data.droplet.networks.v4[0].ip_address
                 var fd = fs.openSync('/Users/gaurigurunathnaik/Desktop/spinupVm/inventory', 'w');
                 var buf = new Buffer('[webservers]\n');
                 fs.writeSync(fd, buf, 0, buf.length);
                 var buf1 = new Buffer('node0 ansible_ssh_host='+ip+' ansible_ssh_user=root ansible_ssh_private_key_file=/Users/gaurigurunathnaik/.ssh/id_rsa\n');
                 fs.appendFileSync('/Users/gaurigurunathnaik/Desktop/spinupVm/inventory', buf1);
                 fs.closeSync(fd);

                 } 

        	);}, 15000);

 	}
 });
