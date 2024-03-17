# Use a base image that has Docker installed
FROM docker:latest

# Install any additional dependencies required for your network setup
# For example, if your network setup requires curl and git
RUN apk update && apk add --no-cache curl git

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the necessary files into the container
COPY . .

# Execute the network setup commands
RUN ./network.sh up -ca -s couchdb && \
    ./network.sh createChannel -c mychannel && \
    ./network.sh deployCC -ccn basic -ccp asset-transfer-basic/chaincode-javascript/ -ccl javascript

# Expose any ports required by your application
EXPOSE 3000

# Command to start your application
CMD ["node", "index.js"]
