# Use an official Node.js base image with version 16.15.1
FROM node:16.15.1

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