# Use a base image that has Node.js installed
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the necessary files into the container
COPY . .

# Expose necessary ports if needed
EXPOSE 3000

# Install dependencies
RUN npm install

# Start the application
CMD ["node", "index.js"]
