# Example Express Application

This is an example application to accompany the article 'Creating a basic site with node.js and Express'. The site is hosted on Heroku.

# Milestone: DEPLOYMENT

In this milestone, we have created a deployment pipeline which supports the following properties:

### Properties

Your production infrastructure and deployment pipeline should support the following properties.

* ###Automatic Configuration of Production Environment using Ansible



* The ability to deploy software to the production environment triggered *after* build, testing, and analysis stage is completed. The deployment needs to occur on actual remote machine/VM (e.g. AWS, droplet, VCL), and not a local VM.

* The ability to use feature flags, serviced by a global redis store, to toggle functionality of a deployed feature in production.

* The ability to monitor the deployed application (using at least 2 metrics) and send alerts using email or SMS (e.g., smtp, mandrill, twilio). An alert can be sent based on some predefined rule.

* The ability to perform a canary release: Using a proxy/load balancer server, route a percentage of traffic to a newly staged version of software and remaining traffic to a stable version of software. Stop routing traffic to canary if alert is raised.







