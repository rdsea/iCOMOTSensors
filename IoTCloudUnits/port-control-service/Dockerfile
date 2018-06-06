FROM node:8-alpine

COPY . /port
WORKDIR /port
RUN npm install 

EXPOSE 9999/tcp
CMD ["npm", "start"]