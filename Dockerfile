FROM node:alpine as build
WORKDIR /app
COPY package.json /app
RUN npm install 
COPY ./webpack.config.js .babelrc /app/
COPY ./client /app/client
RUN npm run build

FROM node:alpine
WORKDIR /app
LABEL maintainer="Godfrey Tutu <godfrey_tutu@yahoo.com>"
LABEL description="MBTI Personality test"
COPY package.json /app
RUN npm install --production
COPY --from=build /app/public /app/public
COPY .env /app/
COPY server /app/server
EXPOSE 3005
CMD ["npm", "start"]
