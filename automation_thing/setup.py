import os

normaldir = os.getcwd()
os.chdir("~/.aws")
CREDENTIALS_FILE = os.path.join(os.getcwd(),'config')
os.chdir(normaldir)

# TODO:
'''
Setup AWS conf files eu-central-1
Setup CloudTrail
Auto create a VPC
Auto spin up our staging and production instance
- S3
- RDS
- EC2
Auto remove all unnecessary packages in production
Install monitoring tools
Enable autoscaling

'''
