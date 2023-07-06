#! /bin/bash

# set default project
if [[ -z $PROJECT_NAME ]]; then
  PROJECT_NAME=mbti
fi

# set default environment
# ENVIRONMENT should be one of prod, dev, test
if [[ -z $ENVIRONMENT ]]; then
  ENVIRONMENT=dev
fi

# Set the default workflow id
if [[ -z $WORKFLOW_ID ]]; then
  WORKFLOW_ID='de23469b-1ae3-4f4e-88e9-89a4d7e32a30'
fi
function deploy_initial_environment() {
  aws cloudformation deploy \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-vpc \
    --template-file vpc.yml \
    --parameter-overrideds Environment=${ENVIRONMENT}
    --no-fail-on-empty-changeset;

  aws cloudformation deploy \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-security-group \
    --template-file security-groups.yml \
    --parameter-overrideds Environment=${ENVIRONMENT}
    --no-fail-on-empty-changeset;

  aws cloudformation deploy \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-instance-profile \
    --template-file ec2-profile.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrideds Environment=${ENVIRONMENT}
    --no-fail-on-empty-changeset;
}

function deploy_db() {
  aws cloudformation deploy \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-rds \
    --template-file rds-stack.yml \
    --parameter-overrides DBMasterPassword=${DB_PASSWD} Environment=${ENVIRONMENT}
    --no-fail-on-empty-changeset; # Ensure DB_PASSWD is set in from environment
}

function deploy_cloudfront() {
  aws cloudformation deploy\
     --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-cloudfront \
     --template-file cloudfront.yml \
     --parameter-overrideds Environment=${ENVIRONMENT}
     --no-fail-on-empty-changeset;
}

function deploy_lb() {
  aws cloudformation deploy \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-loadbalancer-${WORKFLOW_ID} \
    --template-file load-balancer.yml \
    --parameter-overrideds Environment=${ENVIRONMENT} WorkflowId=${WORKFLOW_ID}
    --no-fail-on-empty-changeset;
}

function deploy_app_server() {
  aws cloudformation deploy \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-app-autoscaler-${WORKFLOW_ID} \
    --template-file app-autoscaler.yml \
    --parameter-overrideds Environment=${ENVIRONMENT} WorkflowId=${WORKFLOW_ID}
    --no-fail-on-empty-changeset;
}


