#! /bin/bash

## Changes to the variable should never be commited to svc
## Values for DB_USER and DB_PASS should be proviced before deploying
DB_USER=
DB_PASS=

sed -i "s/DB_PASS/${DB_PASS}/" startup.sh;
sed -i "s/DB_USER/${DB_USER}/" startup.sh;

terraform init;
terraform plan;
terraform apply --auto-approve;



sed -i "s/${DB_USER}/DB_USER/" startup.sh;
sed -i "s/${DB_PASS}/DB_PASS/" startup.sh;
