# Example Express Application

This is an example application to accompany the article 'Creating a basic site with node.js and Express'. The site is hosted on Heroku.

# Milestone: DEPLOYMENT

Our production environment is essentially a Digital Ocean Droplet with Ubuntu installed.
In this milestone, we have created a deployment pipeline which supports the following properties:

### Automatic Configuration of Production Environment using Ansible

We have used ansible for configured management of our production environment. We are using an ansible playbook(playbook.yml) for automatic configuration of the droplet.

playbook.yml : On running this, the destination folder on the remote machine is created and a list of system packages are
installed on the droplet. The paths to the destination folder directory and the list of system packages to install is listed in vars.yml.The IP address of the droplet is contained in the inventory file.
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


* The ability to deploy software to the production environment triggered *after* build, testing, and analysis stage is completed. The deployment needs to occur on actual remote machine/VM (e.g. AWS, droplet, VCL), and not a local VM.

* The ability to use feature flags, serviced by a global redis store, to toggle functionality of a deployed feature in production.

* The ability to monitor the deployed application (using at least 2 metrics) and send alerts using email or SMS (e.g., smtp, mandrill, twilio). An alert can be sent based on some predefined rule.

* The ability to perform a canary release: Using a proxy/load balancer server, route a percentage of traffic to a newly staged version of software and remaining traffic to a stable version of software. Stop routing traffic to canary if alert is raised.







