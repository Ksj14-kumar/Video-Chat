FROM node:14-alpine3.17
WORKDIR /app/
ENV URL=http://localhost:8080
COPY . /app/
RUN npm install
EXPOSE 8080
CMD [ "npm","run","start" ]
