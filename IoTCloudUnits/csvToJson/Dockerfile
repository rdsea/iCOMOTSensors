FROM node:carbon

# Create app directory
WORKDIR /csvjsonbridge


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# Bundle app source
COPY . /csvjsonbridge


RUN npm install
# If you are building your code for production
# RUN npm install --only=production

ENV NODE_ENV "production"

EXPOSE 8090
CMD [ "npm", "start" ]
