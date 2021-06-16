# MBTI Perspective Test

This project is a sample project that demonstrate the MBTI perspective test. It is intended for demonstration of various deployment solutions as DevOps Engineer. 

---

[![CircleCI](https://circleci.com/gh/tutugodfrey/mbti-perspective.svg?style=svg)](https://circleci.com/gh/tutugodfrey/mbti-perspective)
---

# RUNNING THE APPLICATION N DOCKER CONTAINER
The solution to the challenge has been coded as a Node.js application that export the `/result` API to submit the mbti test score and the users response to each questions to a PostgreSQL database.

The frontend is a Simple React application that provides the interface for users to take MBTI test and see their scoring across the MBTI dimensions. Also, to submit the result to backend API for storage.

The two applications can function independently and communicate via the export API `/result` but for convenience I've also expose the `/` API to serve the `index.html` file (available after running `npm run build`) for the frontend.

**Note:**
- For convenience setup for testing the application, the `.env` file has been included with for to provide the connection string to a postgres database server. Please change the authentication information to suite your environment if running the application locally (not within a docker contain). If using docker container you may leave the connection string as it is to avoid requiring password when deploying the applicaion.

- The application is mean to be served on port 3005 for easy testing. Hence, the connection to the backend `http://localhost:3005/result` has been hard coded in the frontend react app (`./client/functs.js`) to send MBTI score/result to the backend. If for any reason you have to change the PORT number ensure the change is reflected on both the server and the client.

### Running the application in a Docker container

The application have been scripted to run in a docker environment and has integration with PostgreSQL database also running as a container. The configuration for building the docker image is in Dockerfile at the root of the project. The following steps will be followed to build the image, run the database server and start the application. However, this has been automated, so you simple run the deploy script by typing in a terminal `./deploy-script`

run `./deploy-script` or enter the following command one by one

`docker build -t mbti-img:latest .` # Create the application container

`docker run  -d --name postgres_host -p 5433:5432 -e POSTGRES_PASSWORD=postgres postgres` # run a postgres database

`run -d -p 3005:3005 --link postgres_host:postgres_host --name mbti-app mbti-img` # run app link to the database

After the commands succeed, open your browser and visit the page by typing `http://localhost:3005`.

`docker exec -ti postgres_host sh` exec into the postgres_host container

`psql -U postgres` connect to the postgres db as user postgres

`select * from mbti_result;` select entries on the database; This should show available results if results has been submitted by the application.

### Running the application locally (not within a docker container)

The following step will help to setup the application locally. Please ensure you have Node.js and npm installed in you environment.

`git clone https://github.com/tutugodfrey/mbti-perspective.git` clone the repository

`cd mbti-perspective` change working directory

`npm install` install packages

`npm run build` build the frontend react application

`npm start` start the application. Before starting the application you may need to update the database connection string in `.env` to provide the right credential for connecting to a postgres database server (the app will start anyways).

Open the your browser and enter `http://localhost:3005` to load the application.

## DEPLOYMENT WITH TERRAFORM ON GCP

The application can be deployed on GCP by following the instructions in this section. The terraform deployment configuration can be found in the `./tf-deploy` directory. The deployment requires very minimal setup, as every setup and configuration as been carefully scripted in the `./startup.sh` script and `./deploy` script found in `./tf-deploy` directory. This terraform deployment will provisiton the following sources on GCP

- Create VPC and a subnet used solely for the project

- Create firewall rules required for the project

- Provision a virtual machine with startup script to set up the application (Install nginx, node.js, PostgreSQL, Git, Install npm packages, build the React frontend and move it to nginx web directory, configure the Database, startup the node.js server)

Given that you are using GCP Cloud SDK with terraform configured, take the following step to deploy the application.

- Run `cd tf-deploy` to change directory to the terraform deployment folder

- Please change the `project_id` variable in `main.tf` to a project you have access/authority on or create a new project and add the project Id accordingly. The other variables could be changed too but they will just be fine.

- Open the `./deploy.sh` script and Add the variable value for `DB_USER` and `DB_PASS`

- Then simply run `./deploy.sh` 

After the deployment is complete the IP address of the server will be outputed to the copy the addres and access the application in your browser over`http://IP_ADDRESS_HERE`

**NOTES:** 
- Note that while the file `./deploy.sh` will modify the `./startup.sh` file during the deployment, the changes will be reverted after the deployment thus leaving the file unchanged. This will ensure repeatability and prevent the secrets DB_USER and DB_PASS from being accidentally commited to source control.

- Please make sure not to commit changes involving `DB_USER` and `DB_PASS` in `./deploy.sh` to source control. These values separated out there to ensure that the changes can be easily spotted. That may likely be the only file that will change during the deployment process.

- If you need to clean up (destroy) the resources created with terraform simply issue the command in your terminal `terraform destroy --auto-approve` in the `./tf-deploy` directory.
