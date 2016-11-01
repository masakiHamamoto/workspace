# Scenario Week 3 brief ![](https://travis-ci.org/culshoefer/aws-automation-thing.svg?branch=master)

As much of the build process and deployment as possible should be automated
Outcomes: Understanding/practical experience of configuring a VM on AWS for specific roles
Understanding and practical experience of deploying an application
Appreciation of how automation can be achieved and some of the tools available

# Checklist (Not an actual checklist)
- Created webapp
- Configured staging and production environment
- Automated EC2 production and staging spinup
- Enabled EC2 production and staging autoscale
- Automated Production and testing/staging RDS setup
- Automated VPC setup for production + staging
- Put all static files in S3
- Automated instance restart after failure/crash/restart
   - Cloud53: Added standby cluster for failover
- EC2 instances are Amazon Linux
- Automated building application on development machine
- Created DB automatic backup on production server
   - + DB automatic restore
   - + long-term storage?
# Task at hand

quick link to moodle: https://moodle.ucl.ac.uk/course/view.php?id=18729&section=7
Design straightforward web app (simple citation store)
**QUICKLY BUILD THE WEBAPP**
## Webapp spec
https://moodle.ucl.ac.uk/pluginfile.php/3127075/mod_resource/content/3/comp204p-sw1-spec.pdf

## Goals
1. Configure staging and production server
2. Create webapp with basic spec including DB
3. Script deployment of app to servers
4. Support automatic restart if the server crsahes/restarts
5. Devise a way to backup/restore DB on production server
   - Find out ways to backup the data (every two hours etc)
   - Store multiple versions since DB may be corrupted

## Development platform
Precisely configured with specific set of tools and versions, easily reproducible

## Staging platform
Confirm that application can be deployed
Miics production environment but also configured for testing and logging
Avoids risks of direct deployment to production

## Production platform
Stripped down to essential software everything else removed

## Use nice VCS system and automatically pull code from there
Part of automation: our tool shall clone all the code automatically

## Successful git branching model
http://nvie.com/posts/a-successful-git-branching-model/

http://nvie.com/files/Git-branching-model.pdf

--> Build independent of IDE (use build tool like maven/gradle/~~~~)

## Things to take note of
- Changing IP addresses
- Only spin up VMs when needed, use cheapest conf + monitor it
- Only use one zone OR be beware of shutdowns if using multiple zones
- Use DB + service on same server

## Actual setup
- EC2 Amazon Linux
- Creation and configuration of server should be scripted
- Keep security in mind:
  - Restrict root access to range of IP addresses
  - Explore AWS options
- Brownie points: Advanced architecture with private network + vpn gateway etc.

## Sharing resources between accounts in AWS
http://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html
