# SHIFT - Technical Interview Challenge

Rather than a whiteboard interview or an automated coding test, we have each candidate perform a medium sized interview challenge. This challenge is your opportunity to show off your skills, and gives you insight into the type of technical tasks we deal with on a daily basis at SHIFT.

## Intro to the Challenge

For this task you will be building a very simplified version of our Perspective test.

Perspective is one of the tools that we use to help customers understand team dynamics is our Perspective Tool. Perspective is a 7 minute test that determines each team member's [Myers-Briggs Type Indicator](https://www.mindfulnessmuse.com/individual-differences/understanding-myers-briggs-type-indicator) (MBTI). Understanding the personality breakdown of each team member allows us to provide more insights to teams about why they are having a particular problem.

This challenge is designed to be a signgle feature, that will test your skills on both the Frontend and the Backend, because as a full stack engineer you will work on both sides of the stack. We estimate this challenge should take about 5 hours from start to finish _if_ you work on a daily basis with all parts of the tech stack. Please note that this estimate is not a time constraint. You are free to take as little or much time as you feel comfortable with, we are only giving you a ballpark so you know the level of effort we expect.

### Open Source Alternative

If you have an open source project, you can optionally submit that to us instead of performing the coding challenge. If you are considering this option, please note that:
- The open source project needs to demonstrate your ability to work on both the Frontend and the Backend as a full stack web developer.
- Your contributions to the project should show-off your skills as much as doing this challenge would.

To choose this option, please point us to the repo, and provide us with your github id that we can use to see your PR contributions.

---

# Spec

### User story
As a non-technical user,  
I want to be able to complete a short personality questionnaire,  
provide my email address,  
and after I submit it, see my personality "type",
both the 4-character MBTI,
and a visual representation of it.

### "Technical user story"
_Non-user-facing requirements_  
As an software engineer working on "a future story",  
after the user has logged in via their email address,  
I want to be able to display their MBTI to them.  
- I.e. their MBTI Data must be connected to the user in such a way, that if we have their email address, we can calculate or retrieve their MBTI score again in the future.

As an software engineer working on "a future story",  
I need to be able to retrieve the user's answers to individual questions,
not just their aggregate MBTI type indicator string.
- I.e. Although this story is about the combined MBTI result, please make sure to store the user's individual answers in the DB.

## User Interface Spec

This story involves two pages.

### 1. Landing page = Quiz

The landing page of the web application should show the user a list of questions as shown as the "Perspective Test" page in the design
- Full Design: https://www.figma.com/file/00SYaOnpIUYLAdvhGlTz4j97/Engineer-Perspective-Test?node-id=1%3A348
- The personality test show questions for the user to respond to
  - The question can be found in [./Data/Questions.csv](./Data/Questions.csv)
  - All 10 questions should be listed on the same page when the user opens up the page
  - For this story, please display the questions in the order they are found in that file

- The user should respond to each question via a 7-option radio-button-style response
  - The radio button furthest to the left indicates a 1 value, while the radio button furthest to the right indicates a 7
- At the bottom of the test the user should be asked for their email
- If a user submits without answering all of the questions, or their email address, they should be given an error message and told what to do
- Once the user hits submit, their email and test answers should be sent to the server
- The user then should be directed to their results page

### 2. Results page

The results page should display the user's MBTI results as shown as the "Perspective Results" page in the design. (For how to calculate the result, see the next section.)
- Full Design: https://www.figma.com/file/00SYaOnpIUYLAdvhGlTz4j97/Engineer-Perspective-Test?node-id=1%3A566
- On the left of the results box the user should see the text "Your Perspective" followed by their perspective type
- On the right of the results box the user should see the 4 MBTI dimensions and where they lean on each dimension
  - Note: You do not need to show the degree that they lean from each side, simply coloring the box for the side that they lean on each dimension is valid for this test

## Calculating the Individual's MBTI

You will be calculating which "end" of the 4 dimensions the user's answers put them in.

- Refer to the provided spreadsheet [./Data/Questions.csv](./Data/Questions.csv) that you used to display the 10 questions
  - As noted above, you capture their response as an integer score from 1–7.
  - If the user ranks a 1, that means the question doesn't resonate with them at all
  - If the user ranks a 7, that means the question resonates with them fully
  - If the user ranks a 4, that means the resonance was neutral
- Like a real MBTI, this quiz produces a result in four "dimensions" (don't worry if you don't know the Myers Briggs terminology, you don't need to understand it to implement it):
  - EI - Extraversion (E) or Introversion (I)
  - SN - Sensing (S) or Intuition (N)
  - TF - Thinking (T) or Feeling (F)
  - JP - Judging (J) or Perceiving (P)
- Each question contributes to the user's result in **one** particular dimension
  - The dimension for each question is given in the 'Dimension' column on the spreadsheet
  - The 'Meaning' column communicates: "When the user answers positively to that question, which _**end**_ of the dimension does that mean they lean toward?"
  - The 'Direction' column is used to combine different questions of the same dimension into a single score for that dimension.
    - The phrasing of the question affects which "end" of the dimention a high score supports.
    - For example, there are two `EI` questions:
      - "You find it takes effort to introduce yourself to other people": a low score is an `E` and a high score is an `I`. But on the other hand,
      - "You get energized going to social events that involve many interactions": a low score is an `I` and a high score is an `E`.
      - The 'Direction' column is an indicator of whether the score for that question needs to be reversed when combining the different questions for a particular dimension into a combined score.
- The end result for MBTI is a set of 4-letters that summarize their tendency in each of the 4 dimensions
  - For each dimension, determine which end of the dimension — which letter — they lean toward. The just combine the 4 letters.
    - For example, if a user's answers fall on the side of...
        - Extraversion (E) in the Extraversion/Introversion (E/I) Dimension
        - Intuition (N) in the Sensing/Intuition (S/N) Dimension
        - Thinking (T) in the Thinking/Feeling (T/F) Dimension
        - Perceiving (P) in the Judging/Perceiving (J/P) Dimension
    - ... then you would present their MBTI result as: "ENTP"
  - If a user's responses to a dimension are perfectly balanced (they don't lean more to one side or another) the algorithm should default to the first (left) letter of each pair.

Note: This is an _extremely_ watered down version of a MBTI test; it does not ask enough questions to give an accurate result. Your personal input may vary from what you've seen other MBTI tests say, this is expected, we're trying to keep the scope small. Just ensure that the results match the expected results in the tests spreadsheet.

### MBTI Test data

For clarity, we have provided a csv file ([./Data/Test-Cases.csv](./Data/Test-Cases.csv)) that gives sets of user responses for 7 different users, and the expected MBTI result for each one.

---

# Submitting the Challenge


## Minimum Technical Requirements

- You must provide a docker or docker-compose configuration that allows us to build the imate(s), and in the specified container we can follow your written steps to build and your software. If you do not know to docker and don't want to learn it for this challenge, please message us (same slack DM) to discuss alternate delivery of your solution.
- Your instructions to build and run must work as written.
- The application must be a web-based application.
- The user story and technical stories must be satisfied
- The test cases given as input must produce the listed result for the test case.

## FAQ
#### 1. "Which stack should I use?"
You may implement this in the stack that you feel the most comfortable with.
- If your architecture involves a js framework Frontend that communicates with the Backend via API calls, that will demonstrate more of the full-stack dev skills the job will involve. It's not quite strong enough to call it a "minimum requirement"... so just consider this an FYI.
- You may use 3rd party libs that you think are appropriate
- You do not have to use our stack (software engineering skills are transferable), but we understand that of course you want to know what it is. We use:
  - React.js + TypeScript (+ ant design + MobX) for the Frontend
  - PHP7, Laravel (+ Eloquent ORM), MySQL for the Backend

#### 2. I think the requirements aren't clear / don't address this case I'm wondering about...
If you feel there are ambiguities in the requirements:  
- In real life, you would ask for requirements clarifications. For this challenge, please instead make your best decision given the information you have, and explicitly state (write) any assumptions you had to make.

#### 3. How perfect should I make my solution / implementation?
It's a tech challenge; it's not production code and you're not trying to invest a huge amount of time. But you want us to know you're smart.  
So it's normal that there might be certain things where you'd say "I know that ABC isn't the best way to do it, I'm doing it that way for now because it's fast and works, but given more time I would want to do XYZ". If so, just say that clearly in your submission. That way, you'll know we know you know.

## Sharing your solution with us

Create a repository using your personal GitHub account and send us the link. That's it!


Happy Hacking!

# RUNNING THE APPLICATION
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

## ISSUES

### Test Cases
I think there is an error in the test cases provided for `Test Case D` and `Test Case E` and would like that it be reviewed carefully as the algorithm could not fit the provided solution without breaking the other Test Cases.

The provided solution for `Test Case D` is `INFP` but the solution is actually `INFJ`, and for `Test Case E` provided solution is `ISFP` but the actual solution is `ISTP`. I actually tried a manual computation to arrive at this solution. Perhap thare are some mixup in the solution provided in the test cases. Please take a second look at the provided Test Cases and the solutions again.

