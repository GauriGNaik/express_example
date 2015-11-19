# Milestone: DEPLOYMENT

Our production environment is essentially a Digital Ocean Droplet with Ubuntu installed. We have used an example nodejs application for this purpose.

In this milestone, we have created a deployment pipeline which supports the following properties:

For task 1 and 2 we have used git post-commit and pre-push hooks.

post-commit hook script:

```
#!/bin/bash
url='http://localhost:8080/job/express_example/build'
curl $url
```
pre-push hook script:

```
#!/bin/bash
jobpath="http://localhost:8080/job/express_example/lastBuild/api/json"
prevStatus=`curl -silent $jobpath | grep -iEo 'result":"\w*'`
prevStatus=${prevStatus/result\"\:\"/}
if [[ "$prevStatus" == "FAILURE" ]]; then
    echo BUILD FAILURE, Reverting last Commit
    git reset --hard HEAD^1
    echo git state back to normal
    exit 1
fi
inventorypath=/Users/gaurigurunathnaik/Desktop/express_example/inventory
playbookpath=/Users/gaurigurunathnaik/Desktop/express_example/playbook.yml
deploypath=/Users/gaurigurunathnaik/Desktop/express_example/deploy2.yml
ansible-playbook -i $inventorypath $playbookpath
ansible-playbook -i $inventorypath $deploypath
```

Automatic build is done using git post-commit hook.
Once the commit is done and build is successful, it is followed by pre-push hook,  the ansible code is configured to run through pre-push hook, install the dependencies on remote instances(droplet here) and deploy the running application on instances.


1. ####Automatic Configuration of Production Environment using Ansible:

    We have used ansible for configured management of our production environment. We are using an ansible playbook(playbook.yml) for automatic configuration of the droplet.
  
  playbook.yml : On running this, the destination folder on the remote machine is created and a list of system packages are
  installed on the droplet. The paths to the destination folder directory and the list of system packages to install is listed in vars.yml.The IP address of the droplet is contained in the inventory file. The system packages chosen for installation are nodejs, npm, git.
  The command associated with running this playbooks is:
  ```
  ansible-playbook -i inventory playbook.yml
  ```
2. ####Trigerring Deployment of the software on remote machine after build,testing and analysis stage completion:

  We are using another ansible playbook(deploy2.yml) for triggering deployment of the software on the droplet.
  
  deploy2.yml: After the dependencies i.e. the system packages have been installed, this playbook pulls the latest code from github, the url to which is specified in vars.yml and populates the destination folder tree which was created by running playbook.yml. The command associated with running this playbooks is:
  ```
  ansible-playbook -i inventory deploy2.yml
  ```

3. ###Feature Flags using global redis store

  We are using Redis store key-value to store a global feature flag. We have added a new feature - "aboutFeature.jade page" to test the functionality. Based on the feature flag value, we are toggling the new page availability.
  The value of the feature flag is toggled using redi-cli from 'false' to 'true'. If it is set to 'true' the new Page is displayed to users.
  
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
<img width="988" alt="screen shot 2015-11-18 at 11 50 39 pm" src="https://cloud.githubusercontent.com/assets/8634231/11262705/85b87e0a-8e50-11e5-9fa7-3b56e6219357.png">

<img width="1360" alt="screen shot 2015-11-18 at 11 57 22 pm" src="https://cloud.githubusercontent.com/assets/8634231/11262700/5c15e5b0-8e50-11e5-9bb2-5214de2acadd.png">


4. ####Monitoring and sending alerts

  We are monitoring the deployed application based on memoryLoad and CPU usage. If the usage crosses a threshold 70%, an SMS alert is sent. The SMS alerts are sent using the [Twilio](https://www.twilio.com/) API for NodeJs.
  
5. ####Canary Release

  Using a proxy server, 70% of the traffic is routed to the production server, while the rest 30% is routed to the canary. The criteria for routing is based on memory Load and CPU usage of the instance by the application. Once it reaches a threshold, the traffic is re-routed from canary back to production instance.
  We keep checking for alerts(as specified above) and stop routing traffic to the canary if an alert is raised. Redis has been used to accomplish the same.

###Screencast
![screencast for m3](https://cloud.githubusercontent.com/assets/11006675/11262535/68c9701c-8e4e-11e5-9be5-24b465f61949.gif)





