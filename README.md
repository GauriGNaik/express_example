# Example Express Application

This is an example application to accompany the article 'Creating a basic site with node.js and Express'. The site is hosted on Heroku.

# Milestone: DEPLOYMENT

Previously, we've focused on building, testing, and analysis of our software in a continuous deployment pipeline. Now, we're ready to start deploying software into production environments.

In our deployment workshop, we've learned to how to deploy a web app using a green-blue deployment strategy. In this MILESTONE, we will extend our deployment pipeline to support additional concerns related to deployment.

### Properties

Your production infrastructure and deployment pipeline should support the following properties.

* The ability to configure a production environment *automatically*, using a configuration management tool, such as ansible, or configured using docker.

* The ability to deploy software to the production environment triggered *after* build, testing, and analysis stage is completed. The deployment needs to occur on actual remote machine/VM (e.g. AWS, droplet, VCL), and not a local VM.

* The ability to use feature flags, serviced by a global redis store, to toggle functionality of a deployed feature in production.

* The ability to monitor the deployed application (using at least 2 metrics) and send alerts using email or SMS (e.g., smtp, mandrill, twilio). An alert can be sent based on some predefined rule.

* The ability to perform a canary release: Using a proxy/load balancer server, route a percentage of traffic to a newly staged version of software and remaining traffic to a stable version of software. Stop routing traffic to canary if alert is raised.







