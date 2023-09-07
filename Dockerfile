# Use an official Node.js base image with LTS version 18.17.1-alpine3.18
FROM node:18.17.1-alpine3.18

# Set the working directory to the application folder
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire source code of your project to the working directory
COPY . .

# Expose the port on which the application runs
EXPOSE 3000

# Command to start the application
CMD [ "npm", "start" ]