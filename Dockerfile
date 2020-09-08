FROM node:12.14.1-alpine
LABEL maintainer="John Pape <jpapejr@icloud.com>" 

COPY package.json /app/package.json
COPY /src /app/src
WORKDIR /app

RUN chmod go+w -R /app; npm install 

ENTRYPOINT ["npm", "start"]