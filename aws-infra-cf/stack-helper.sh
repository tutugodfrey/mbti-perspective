#! /bin/bash
PROJECT_NAME=mbti
ENVIRONMENT=dev

function deploy_all() {
  aws cloudformation deploy --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-vpc --template-file vpc.yml --no-fail-on-empty-changeset;
  aws cloudformation deploy --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-security-group --template-file security-groups.yml --no-fail-on-empty-changeset;
  aws cloudformation deploy --stack-name mbti-dev-rds --template-file rds-stack.yml --parameter-overrides DBMasterPassword=${DB_PASSWD}; # Get DB_PASSWD from environment
}
