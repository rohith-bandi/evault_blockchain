# Use a base image that has Docker installed
FROM docker:latest

# Install any additional dependencies required for your network setup
# For example, if your network setup requires curl and git
RUN apk update && apk add --no-cache curl git

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the necessary files into the container
COPY . .

# Run the network setup commands using Docker RUN instructions
RUN cd test-network && \
    ./network.sh up -ca -s couchdb && \
    ./network.sh createChannel -c mychannel && \
    ./network.sh deployCC -ccn basic -ccp asset-transfer-basic/chaincode-javascript/ -ccl javascript

