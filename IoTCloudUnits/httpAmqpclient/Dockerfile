FROM node

COPY . /client
WORKDIR /client
RUN chmod +x docker-entrypoint.sh
RUN npm install 

EXPOSE 8080
CMD ["npm", "start"]