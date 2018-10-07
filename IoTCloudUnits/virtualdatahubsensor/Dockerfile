FROM node:carbon

# Create app directory
WORKDIR /virtualdatahubsensor


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# Bundle app source
COPY . /virtualdatahubsensor


RUN npm install
# If you are building your code for production
# RUN npm install --only=production

ENV NODE_ENV "production"

CMD [ "npm", "start" ]
