# Example Express Application

This is an example application to accompany the article 'Creating a basic site with node.js and Express'. The site is hosted on Heroku.

# Milestone: DEPLOYMENT

Our production environment is essentially a Digital Ocean Droplet with Ubuntu installed.
In this milestone, we have created a deployment pipeline which supports the following properties:

For task 1 and 2 we have added the automatic configuration script in git pre-push hook.
Once the commit is done and build is successful, the ansible code is configured to run, install the dependencies on remote instances(droplet here) and deploy the running application on instances.


### Automatic Configuration of Production Environment using Ansible

We have used ansible for configured management of our production environment. We are using an ansible playbook(playbook.yml) for automatic configuration of the droplet.

playbook.yml : On running this, the destination folder on the remote machine is created and a list of system packages are
installed on the droplet. The paths to the destination folder directory and the list of system packages to install is listed in vars.yml.The IP address of the droplet is contained in the inventory file. The system packages chosen for installation are nodejs, npm, git.
The command associated with running this playbooks is:
```
ansible-playbook -i inventory playbook.yml
```

### Trigerring Deployment of the software on remote machine after build,testing and analysis stage completion:

We are using another ansible playbook(deploy2.yml) for triggering deployment of the software on the droplet.

deploy2.yml: After the dependencies i.e. the system packages have been installed, this playbook pulls the latest code from github, the url to which is specified in vars.yml and populates the destination folder tree which was created by running playbook.yml. The command associated with running this playbooks is:
```
ansible-playbook -i inventory deploy2.yml
```

### Feature Flags using global redis store

We are using Redis store key-value to store a global feature flag. We have added a new feature - "a new page" to test the functionality. Based on the feature flag value, we are toggling the new page availability.
The value of the feature flag is toggled using redi-cli from 'false' to 'true'.

```
127.0.0.1:6379> GET devOpsKey
"false"
```

```
127.0.0.1:6379> SET devOpsKey true
OK
```

```
127.0.0.1:6379> GET devOpsKey
"true"
```

```
app.get('/about', function(req, res){
  client.get("devOpsKey", function(err,value){ 
    if (err) throw err
      if(value=="true"){
        res.render('aboutFeature', {
         title: 'AboutFeature'
        });
      }else{
        res.render('about', {
        title: 'About'
      });
    }
  });
```

### Monitoring and sending alerts

We are monitoring the deployed application based on <metric1> and <metric2>. If the usage crosses a threshold<threshold>, an SMS alert is sent. The SMS alerts are sent using the [Twilio](https://www.twilio.com/) API for NodeJs.

### Canary Release

Using a proxy server, <x>% of the traffic is routed to the production server, while the rest <x>% is routed to the canary.
We keep checking for alerts(as specified above) and stop routing traffic to the canary if an alert is raised. Redis has been used to accomplish the same.








