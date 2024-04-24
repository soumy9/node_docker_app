# Build a docker image-
# docker build -t soumy9/event-bus .
# Push the imageto docker hub-
# docker push soumy9/event-bus
FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
CMD [ "npm","start" ]