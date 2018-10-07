FROM node:carbon

# Create app directory
WORKDIR /mqttamqpbridge


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# Bundle app source
COPY . /mqttamqpbridge


RUN npm install
# If you are building your code for production
# RUN npm install --only=production

ENV NODE_ENV "production"

EXPOSE 8095
CMD [ "npm", "start" ]
